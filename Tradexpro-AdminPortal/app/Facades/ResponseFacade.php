<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;
use App\Services\ResponseServices\ResponseService;
use App\Services\ResponseServices\ResponseServiceContract;

/**
 * This Facade Has Response Builder To Return Response
 * 
 * @method static JsonResponse|RedirectResponse|View send()
 * @method static void throw()
 * @method static void safeThrow()
 * @method static ResponseService result(array $result)
 * @method static ResponseService redirect(string $route)
 * @method static ResponseService redirect_next(string $route)
 * @method static ResponseService redirect_back(string $route)
 * @method static ResponseService next_view(string $view_name)
 * @method static ResponseService back_view(string $view_name)
 * @method static ResponseService query(array $query)
 * @method static ResponseService success(mixed $messageOrData = null, mixed $data = [], array $topLevelData = [])
 * @method static ResponseService failed(mixed $messageOrData = null, mixed $data = [], array $topLevelData = [])
 * 
 * @see ResponseService
 */
 class ResponseFacade extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor(): string
    {
        return ResponseServiceContract::class;
    }
}
