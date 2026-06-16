<?php

namespace App\Services\AppServices;

use Illuminate\Contracts\Foundation\Application;

interface AppServiceContract{

    /**
     * This method will  set dependence on application container
     * @param \Illuminate\Contracts\Foundation\Application $app
     * @return void
     */
    public static function set_dependence(Application $app): void;

    /**
     * This method will set macros on application
     * @return void
     */
    public static function set_macros(): void;

    /**
     * This method will Cache and load all admin settings data
     * @return array
     */
    public static function load_admin_settings(): array;
}