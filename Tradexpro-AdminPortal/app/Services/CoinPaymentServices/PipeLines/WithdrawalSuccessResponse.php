<?php

namespace App\Services\CoinPaymentServices\PipeLines;

use App\Services\CoinPaymentServices\DTO\ResponseFilterDTO;
use App\Services\CoinPaymentServices\Responses\WithdrawalResponse\WithdrawalConfirmationResponse;

class WithdrawalSuccessResponse
{
    public function handle(ResponseFilterDTO $responseFilter, $next)
    {
        $status = $responseFilter->response->getStatusCode();
        $payload= $responseFilter->returnTypePayload;

        if(
               $status === 202
            && $payload == WithdrawalConfirmationResponse::class
        ) {
            $responseFilter->passed();
            $responseFilter->setReturnResponse(new WithdrawalConfirmationResponse);
        }

        return $next($responseFilter);
    }
}