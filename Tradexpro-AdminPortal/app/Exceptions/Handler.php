<?php

namespace App\Exceptions;

use Error;
use Exception;
use Throwable;
use App\Facades\ResponseFacade;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Laravel\Horizon\Exceptions\ForbiddenException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        \League\OAuth2\Server\Exception\OAuthServerException::class
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];
    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return mixed
     */
    public function render($request, Throwable $exception)
    {
        if(
               $exception instanceof NotFoundHttpException
            || $exception instanceof ForbiddenException
            || $exception instanceof HttpException
        )   return parent::render($request, $exception);

        if($exception instanceof UserApiException) {
            $data = [
//                'type' => 'api',
                'message' => $exception->getMessage(),
            ];

            $status = $exception->getCode();
            return response()->json($data, $status);
        }

        if(env('APP_ENV', 'production') == 'production'){

            // if($exception instanceof Error)
            if($exception instanceof ValidationException){
                $messagesBag = $exception->errors();
                $messagesBagKeys = array_keys($messagesBag);
                $message = $messagesBag[$messagesBagKeys[0] ?? 0][0] ?? null;
                return ResponseFacade::failed($message ?? __("Something went wrong"))->send();
            }

            $backTo = null;
            $referer = $_SERVER['HTTP_REFERER'] ?? null;
            if(!($referer && Auth::check())) $backTo = "login";

            storeLog($exception->getMessage(). " " . $exception->getTraceAsString(), "error");
            return ResponseFacade::failed(__("Something went wrong"))
                ->redirect($backTo)->send();
        }

        return parent::render($request, $exception);
    }


}
