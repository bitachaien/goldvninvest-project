<?php

namespace App\Listeners;

use Illuminate\Http\Request;
use App\Events\AdminLoginEvent;
use App\Model\AdminLoginActivity;
use Illuminate\Support\Facades\Http;
use App\Services\ClientInformation\ClientInformation;

class AdminLoginListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(AdminLoginEvent $event): void
    {
        $admin   = $event->admin;
        $adminId = $admin->id;

        $userAgent = request()->header('User-Agent') ?? php_uname();
        $ip        = request()->ip() ?? '127.0.0.1';

        $browser = ClientInformation::detectBrowser($userAgent);
        $os      = ClientInformation::detectOS($userAgent);
        $device  = ClientInformation::detectDevice($userAgent);
        $location= ClientInformation::detectLocation($ip);

        try {
            AdminLoginActivity::create([
                'admin_id' => $adminId,
                'ip_address' => $ip,
                'device' => $device,
                'browser' => $browser,
                'os' => $os,
                'user_agent' => $userAgent,
                'login_at' => now(),
                'location' => $location,
            ]);
        } catch (\Throwable $th) {
            storeLog($th->getMessage(), 'error');
        }
    }
}
