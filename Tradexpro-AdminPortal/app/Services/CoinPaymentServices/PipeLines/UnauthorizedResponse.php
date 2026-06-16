<?php

namespace App\Services\CoinPaymentServices\PipeLines;

use App\Services\CoinPaymentServices\DTO\ResponseFilterDTO;
use App\Services\CoinPaymentServices\Responses\WithdrawalResponse\WithdrawalConfirmationResponse;

class UnauthorizedResponse
{
    public function handle(ResponseFilterDTO $responseFilter, $next)
    {
        $status = $responseFilter->response->getStatusCode();
        $payload= $responseFilter->returnTypePayload;

        if($status === 401) {
            $intense = class_exists($payload) ? new $payload() : new \stdClass;
            $intense->status = $status;
            $intense->detail = __("Unauthorized Request");
            $responseFilter->passed();
            $responseFilter->setReturnResponse($intense);
        }

        return $next($responseFilter);
    }
}