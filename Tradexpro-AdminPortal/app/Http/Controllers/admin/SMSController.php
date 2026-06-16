<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\NexmoRequest;
use Illuminate\Http\Request;
use App\Http\Services\SmsService;

class SMSController extends Controller
{
    private $smsService;
    public function __construct()
    {
        $this->smsService = new SmsService;
    }

    public function adminChooseSmsSettings(Request $request)
    {
        $response = $this->smsService->adminChooseSmsSettings($request);

        if ($response['success'] == true) {
            return redirect()->route('adminSettings', ['tab' => 'sms'])->with('success', __("Sms gateway updated successfully"));
        } else {
            return redirect()->route('adminSettings', ['tab' => 'sms'])->withInput()->with('success', $response['message']);
        }
    }
    public function adminNexmoSmsSettingsSave(NexmoRequest $request)
    {
        $response = $this->smsService->adminNexmoSmsSettingsSave($request);

        if ($response['success'] == true) {
            return redirect()->route('adminSettings', ['tab' => 'sms'])->with('success', __("Nexmo setup updated successfully"));
        } else {
            return redirect()->route('adminSettings', ['tab' => 'sms'])->withInput()->with('success', $response['message']);
        }
    }

    public function adminAfricaTalkSmsSettingsSave(Request $request)
    {
        $response = $this->smsService->adminAfricaTalkSmsSettingsSave($request);

        if ($response['success'] == true) {
            return redirect()->route('adminSettings', ['tab' => 'sms'])->with('success', __("Africa talking setup updated successfully"));
        } else {
            return redirect()->route('adminSettings', ['tab' => 'sms'])->withInput()->with('success', $response['message']);
        }
    }

    public function adminSendTestSms(Request $request)
    {
        $response = $this->smsService->sendTestSMS($request);
        if ($response['success'] ?? false) {
            return redirect()->route('adminSettings', ['tab' => 'sms'])->with('success', __("Test SMS sent successfully"));
        } else {
            return redirect()->route('adminSettings', ['tab' => 'sms'])->withInput()->with('success', $response['message']);
        }
    }
}
