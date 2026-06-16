<?php

namespace App\Services\ClientInformation;

use Illuminate\Support\Facades\Http;

class ClientInformation
{
    /**
     * Get Client Browser Name
     * @param string $agent
     * @return string
     */
    public static function detectBrowser(string $agent): string
    {
        return match (true) {
            str_contains($agent, 'Firefox') => 'Firefox',
            str_contains($agent, 'Chrome') => 'Chrome',
            str_contains($agent, 'Safari') => 'Safari',
            str_contains($agent, 'Edge') => 'Edge',
            str_contains($agent, 'Opera') => 'Opera',
            default => 'Unknown',
        };
    }

    /**
     * Get Client Operating System
     * @param string $agent
     * @return string
     */
    public static function detectOS(string $agent): string
    {
        return match (true) {
            str_contains($agent, 'Windows') => 'Windows',
            str_contains($agent, 'Mac OS') => 'MacOS',
            str_contains($agent, 'Linux') => 'Linux',
            str_contains($agent, 'Android') => 'Android',
            str_contains($agent, 'iPhone') => 'iOS',
            default => 'Unknown',
        };
    }

    /**
     * Get Client Device
     * @param string $agent
     * @return string
     */
    public static function detectDevice(string $agent): string
    {
        return match (true) {
            str_contains($agent, 'Mobile') => 'Mobile',
            str_contains($agent, 'Tablet') => 'Tablet',
            default => 'Desktop',
        };
    }

    /**
     * Get Client Location
     * @param string $ip
     */
    public static function detectLocation(string $ip): ?string
    {
        try {
            $response = Http::timeout(3)->get("https://ipapi.co/{$ip}/json/");
            if ($response->failed()) {
                return null;
            }

            $data = $response->json();

            if (isset($data['city']) && isset($data['country_name'])) {
                return "{$data['city']}, {$data['country_name']}";
            }

            return $data['country_name'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }
}