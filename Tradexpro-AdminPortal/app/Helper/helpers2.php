<?php

use App\User;
use Illuminate\Http\JsonResponse;

function responseJsonData(bool $success, string $message = '', array|object|null $data = []): JsonResponse
{
    $message = !$success && empty($message) ? __('Something went wrong! Please try again later') : $message;
    return response()->json(['success' => $success, 'message' => $message, 'data' => $data]);
}

if (!function_exists("success")) {
    /**
     * Generate Success Response Array
     * @param mixed $messageOrData
     * @param mixed $data
     * @param array $topLevelData
     * @return array{success:bool,message:string,data:mixed}
     */
    function success(mixed $messageOrData = null, mixed $data = [], array $topLevelData = []): array
    {
        if($messageOrData === null) 
            $messageOrData = __("Success");

        if (gettype($messageOrData) !== 'string') {
            $data = $messageOrData;
            $messageOrData = __("Success");
        }

        $response = [
            'success' => true,
            'message' => $messageOrData,
            'data'    => $data
        ];

        foreach ($topLevelData as $key => $value) {
            $response[$key] = $value;
        }

        return $response;
    }
}

if (!function_exists("failed")) {
    /**
     * Generate Failed Response Array
     * @param mixed $messageOrData
     * @param mixed $data
     * @param array $topLevelData
     * @return array{success:bool,message:string,data:mixed}
     */
    function failed(mixed $messageOrData = null, mixed $data = [], array $topLevelData = []): array
    {
        if ($messageOrData === null)
            $messageOrData = __("Failed");

        if (gettype($messageOrData) !== 'string') {
            $data = $messageOrData;
            $messageOrData = __("Failed");
        }

        $response = success($messageOrData, $data, $topLevelData);
        $response['success'] = false;

        return $response;
    }
}

if (!function_exists("is_success")) {
    /**
     * Check Response Array
     * @param array{success:bool,message:string,data:mixed} $response
     * @return bool
     */
    function is_success(array $response): bool
    {
        return !!($response["success"] ?? false);
    }
}

if(!function_exists("adminGoogleAuthEnabled")){
    /**
     * Check Admin Google Auth Is Enabled

     * @return bool
     */
    function adminGoogleAuthEnabled(): bool
    {
        return Auth::user()?->g2f_enabled ?? false;
    }
}

if(!function_exists("authId")){
    /**
     * Return Auth Id
     * @return int
     */
    function authId(): int
    {
        return Auth::id() ?? Auth::guard('api')->id() ?? 0;
    }
}

if(!function_exists("authUser")){
    /**
     * Return Auth User|Null
     * @return ?User
     */
    function authUser(): ?User
    {
        return Auth::user() ?? Auth::guard('api')->user() ?? null;
    }
}
