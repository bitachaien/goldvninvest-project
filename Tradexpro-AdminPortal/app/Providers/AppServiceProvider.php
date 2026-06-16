<?php

namespace App\Providers;

use Laravel\Passport\Passport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use App\Services\AppServices\AppService;
use Illuminate\Support\Facades\Validator;
use Laravel\Passport\Console\KeysCommand;
use Laravel\Passport\Console\ClientCommand;
use Laravel\Passport\Console\InstallCommand;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        AppService::load_service_providers($this->app);
        // Load Dependence
        AppService::set_dependence($this->app);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);

        Validator::extend('strong_pass', function ($attribute, $value, $parameters, $validator) {
            return is_string($value);
        });

        Passport::routes();

        /* ADD THIS LINES */
        $this->commands([
            InstallCommand::class,
            ClientCommand::class,
            KeysCommand::class,
        ]);

        if (function_exists('bcscale')) {
            bcscale(8);
        }
        if (DB::connection()->getDatabaseName()) {
            if (Schema::hasTable('admin_settings')) {
                // // Load Admin Setting
                $adm_setting = AppService::load_admin_settings();

                $capcha_site_key = isset($adm_setting['NOCAPTCHA_SITEKEY']) ? $adm_setting['NOCAPTCHA_SITEKEY'] : env('NOCAPTCHA_SITEKEY');
                $capcha_secret_key = isset($adm_setting['NOCAPTCHA_SECRET']) ? $adm_setting['NOCAPTCHA_SECRET'] : env('NOCAPTCHA_SECRET');

                config(['captcha.sitekey' => $capcha_site_key]);
                config(['captcha.secret' => $capcha_secret_key]);
            }
        }

        // Load Macros
        AppService::set_macros();
    }
}
