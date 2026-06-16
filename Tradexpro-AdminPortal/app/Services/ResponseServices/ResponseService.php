<?php

namespace App\Services\ResponseServices;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View as ViewFacade;
use Illuminate\Routing\ResponseFactory;

class ResponseService implements ResponseServiceContract
{
    private array $result          = [];
    private ?string $redirect      = null;
    private ?string $redirect_next = null;
    private ?string $redirect_back = null;
    private ?string $next_view     = null;
    private ?string $back_view     = null;
    private array   $query         = [];
    public function __construct(){}

    /**
     * Set Response Data
     * @param array $result
     * @return ResponseService
     */
    public function result(array $result): self
    {
        $this->result = $result;
        return $this;
    }

    /**
     * Set Success Response Redirect Route For Success/Failed
     * @param ?string $redirect
     * @return ResponseService
     */
    public function redirect(?string $redirect): self
    {
        $this->redirect = $redirect;
        return $this;
    }

    /**
     * Set Success Response Redirect Route
     * @param ?string $redirect_next
     * @return ResponseService
     */
    public function redirect_next(?string $redirect_next): self
    {
        $this->redirect_next = $redirect_next;
        return $this;
    }

    /**
     * Set Failed Response Redirect Route
     * @param ?string $redirect_back
     * @return ResponseService
     */
    public function redirect_back(?string $redirect_back): self
    {
        $this->redirect_back = $redirect_back;
        return $this;
    }

    /**
     * Set Success Response Redirect View
     * @param string $next_view
     * @return ResponseService
     */
    public function next_view(string $next_view): self
    {
        $this->next_view = $next_view;
        return $this;
    }

    /**
     * Set Failed Response Redirect View
     * @param string $back_view
     * @return ResponseService
     */
    public function back_view(string $back_view): self
    {
        $this->back_view = $back_view;
        return $this;
    }

    /**
     * Set Query Redirect Route
     * @param array<mixed> $query
     * @return ResponseService
     */
    public function query(array $query): self
    {
        $this->query = $query;
        return $this;
    }

    /**
     * This method will send back response
     * @return JsonResponse|RedirectResponse|View
     */
    public function send(): JsonResponse|RedirectResponse|View
    {
        return $this->build();
    }

    /**
     * This method will throw back response
     * @return void
     */
    public function throw(): void
    {
        /** @var RedirectResponse $send */
        $send = $this->build();
        $send->throwResponse();
    }

    /**
     * This method will throw back response and save log
     * 
     * @return void
     */
    public function safeThrow(): void
    {
        /** @var RedirectResponse $send */
        $send = $this->build();

        $message = match (true){
            $send instanceof RedirectResponse => session("success") ?? session("dismiss"),
            $send instanceof JsonResponse     => $send->original['message'] ?? __("Something went wrong"),
            default  => __("Something went wrong")
        };

        $send->throwHttpResponse($message);
    }

    /**
     * Set Success Response
     * @param mixed $messageOrData
     * @param mixed $data
     * @param array<string, mixed> $topLevelData
     * @return ResponseService
     */
    public function success(mixed $messageOrData = null, mixed $data = [], array $topLevelData = []): self
    {
        $this->result = success($messageOrData, $data, $topLevelData);
        return $this;
    }

    /**
     * Set Failed Response
     * @param mixed $messageOrData
     * @param mixed $data
     * @param array<string, mixed> $topLevelData
     * @return ResponseService
     */
    public function failed(mixed $messageOrData = null, mixed $data = [], array $topLevelData = []): self
    {
        $this->result = failed($messageOrData, $data, $topLevelData);
        return $this;
    }

        /**
     * validate result
     * @return array
     */
    private function validate()
    {
        if(blank($this->result))
            return failed(__("Result not set"));

        return success();
    }

    private function build(): JsonResponse|RedirectResponse|View
    {

        $responseData = $this->result;
        $validation = $this->validate();
        if(!$validation['success']) $responseData = $validation;

        if(IS_API_CALL){
            /** @var ResponseFactory $responseTo */
            $responseTo = response();
            return $responseTo->json($responseData);
        }

        /** @var Redirector $redirect */
        $redirect = redirect();

        return match(true){
            $responseData['success'] => $this->successHandler($redirect, $responseData),
            default                  => $this->failedHandler($redirect, $responseData),
        };
    }

    /**
     * Redirect To Route Or Url With Query
     * @param \Illuminate\Routing\Redirector $redirector
     * @param ?string $redirectTo
     * @param array $query
     * @return RedirectResponse
     */
    private function redirectTo(Redirector $redirector, ?string $redirectTo, array $query): RedirectResponse
    {
        if(Route::has($redirectTo ?? ''))
            return $redirector->route($redirectTo, $query);

        $query = http_build_query($query);
        return $redirector->to("$redirectTo?$query")->withInput();
    }

    /**
     * Success Handler
     * @param \Illuminate\Routing\Redirector $redirector
     * @param array $responseData
     * @return RedirectResponse|View
     */
    private function successHandler(Redirector &$redirector, array $responseData): RedirectResponse|View
    {
        if($this->next_view && ViewFacade::exists($this->next_view)){
            /** @var View $viewPage */
            $viewPage = view($this->next_view, $responseData['data'] ?? []);
            return $viewPage->with("success", $responseData['message'] ?? "");
        }

        if($this->redirect_next){
            return $this->redirectTo($redirector, $this->redirect_next, $this->query)
                ->with("success", $responseData["message"] ?? '');
        }

        if($this->redirect){
            return $this->redirectTo($redirector, $this->redirect, $this->query)
                ->with($responseData['success'] ? "success" : "dismiss", $responseData["message"] ?? '');
        }

        return $redirector->back()->with("success", $responseData["message"] ?? '');
    }

    /**
     * Failed Handler
     * @param \Illuminate\Routing\Redirector $redirector
     * @param array $responseData
     * @return RedirectResponse|View
     */
    private function failedHandler(Redirector &$redirector, array $responseData): RedirectResponse|View
    {
        if($this->back_view && ViewFacade::exists($this->back_view)){
            /** @var View $viewPage */
            $viewPage = view($this->back_view, $responseData['data'] ?? []);
            return $viewPage->with("dismiss", $responseData['message'] ?? "");
        }

        if($this->redirect_back){
            return $this->redirectTo($redirector, $this->redirect_back, $this->query)
                ->with("dismiss", $responseData["message"] ?? '');
        }

        if($this->redirect){
            return $this->redirectTo($redirector, $this->redirect, $this->query)
                ->with($responseData['success'] ? "success" : "dismiss", $responseData["message"] ?? '');
        }

        return $redirector->back()->with("dismiss", $responseData["message"] ?? '');
    }
}