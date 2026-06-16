<?php

namespace App\Http\Middleware;

use App\Facades\ResponseFacade;
use Closure;
use App\Model\KycList;
use Illuminate\Http\Request;
use App\Model\VerificationDetails;
use Illuminate\Support\Facades\Auth;

class KYCVerification
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next,$kycVerificationType)
    {
        $user = Auth::user();
        if (empty($user)) return ResponseFacade::failed(__("User not found"))->send();

        $checkKYCEnabledType = getEnabledKYCType($kycVerificationType);
        if($checkKYCEnabledType['success'])
        {
            $verification_type = $checkKYCEnabledType['data'] ?? '';
            if($verification_type == KYC_TYPE_PERSONA)
            {
                $checkVerificationStatus = checkThirdPartyVerificationStatus($user);
                if(!$checkVerificationStatus['success'])
                    return ResponseFacade::result($checkVerificationStatus)->send();
            }else{
                $kycVerification = getKYCVerificationActiveList($kycVerificationType);
                $userVerification = userVerificationActiveList($user);
    
                if($kycVerification['success']==true)
                {
                    $kycVerificationActiveList = json_decode($kycVerification['data']);
                    $kycList = KycList::whereStatus(STATUS_ACTIVE)->get('type');
    
                    if(isset($kycVerificationActiveList))
                    {
                        foreach($kycVerificationActiveList as $item)
                        {
                            if(!$kycList->where('type', $item)->first()) continue;
                            $hasUserVerified = !in_array($item, $userVerification);
                            $kycFailedMessage = match(intval($item)){
                                KYC_PHONE_VERIFICATION    => __('KYC (Phone) is not verified'),
                                KYC_EMAIL_VERIFICATION    => __('KYC (Email) is not verified'),
                                KYC_NID_VERIFICATION      => __('KYC (NID) is not verified'),
                                KYC_PASSPORT_VERIFICATION => __('KYC (Passport) is not verified'),
                                KYC_DRIVING_VERIFICATION  => __('KYC (Driving) licence is not verified'),
                                KYC_VOTERS_CARD_VERIFICATION => __('KYC (Voter) Card is not verified'),
                                default => __('KYC (Unknown) is not verified'),
                            };
                            if($hasUserVerified)
                                return ResponseFacade::failed($kycFailedMessage, $item)->send();
                        }
                    }
                }
            }
        }
        return $next($request);
    }
}
