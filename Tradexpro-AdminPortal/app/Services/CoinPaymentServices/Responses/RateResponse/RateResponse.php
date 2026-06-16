<?php

namespace App\Services\CoinPaymentServices\Responses\RateResponse;

use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\SerializedName;
use App\Services\CoinPaymentServices\Responses\AbstractResponse;
use App\Services\CoinPaymentServices\Responses\RateResponse\RateItem;

class RateResponse extends AbstractResponse
{
    #[Type("array<App\Services\CoinPaymentServices\Responses\RateResponse\RateItem>")]
    #[SerializedName("items")]
    public array $items;
}