<?php

namespace App\Services\ResponseServices;

use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use App\Services\ResponseServices\ResponseService;

interface ResponseServiceContract{

    /**
     * Set Response Data
     * @param array $result
     * @return ResponseService
     */
    public function result(array $result): ResponseService;

    /**
     * Set Success Response Redirect Route For Success/Failed
     * @param string $redirect
     * @return ResponseService
     */
    public function redirect(string $redirect): self;

    /**
     * Set Success Response Redirect Route
     * @param string $redirect_next
     * @return ResponseService
     */
    public function redirect_next(string $redirect_next): ResponseService;

    /**
     * Set Failed Response Redirect Route
     * @param string $redirect_back
     * @return ResponseService
     */
    public function redirect_back(string $redirect_back): ResponseService;

    /**
     * Set Success Response Redirect View
     * @param string $next_view
     * @return ResponseService
     */
    public function next_view(string $next_view): ResponseService;

    /**
     * Set Failed Response Redirect View
     * @param string $back_view
     * @return ResponseService
     */
    public function back_view(string $back_view): ResponseService;

    /**
     * Set Query Redirect Route
     * @param array<mixed> $query
     * @return ResponseService
     */
    public function query(array $query): ResponseService;

    /**
     * This method will send back response
     * @return JsonResponse|RedirectResponse|View
     */
    public function send(): JsonResponse|RedirectResponse|View;

    /**
     * This method will throw back response
     * @return void
     */
    public function throw(): void;

    /**
     * This method will throw back response and save log
     * 
     * @return void
     */
    public function safeThrow(): void;

    /**
     * Set Success Response
     * @param mixed $messageOrData
     * @param mixed $data
     * @param array<string, mixed> $topLevelData
     * @return ResponseService
     */
    public function success(mixed $messageOrData = null, mixed $data = [], array $topLevelData = []): ResponseService;

    /**
     * Set Failed Response
     * @param mixed $messageOrData
     * @param mixed $data
     * @param array<string, mixed> $topLevelData
     * @return ResponseService
     */
    public function failed(mixed $messageOrData = null, mixed $data = [], array $topLevelData = []): ResponseService;

}
