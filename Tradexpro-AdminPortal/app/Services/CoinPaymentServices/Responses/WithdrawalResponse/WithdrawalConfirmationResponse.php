<?php

namespace App\Services\CoinPaymentServices\Responses\WithdrawalResponse;

use JMS\Serializer\Annotation\Type;
use App\Services\CoinPaymentServices\Responses\AbstractResponse;

class WithdrawalConfirmationResponse extends AbstractResponse
{
    public string $response = "success";
}