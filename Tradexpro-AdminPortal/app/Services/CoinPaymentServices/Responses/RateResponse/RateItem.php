<?php

namespace App\Services\CoinPaymentServices\Responses\RateResponse;

use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation as Serializer;
use JMS\Serializer\Annotation\SerializedName;

class RateItem
{
    #[Type('string')]
    #[SerializedName('baseCurrencyId')]
    public string $baseCurrencyId;

    #[Type('string')]
    #[SerializedName('baseSymbol')]
    public string $baseSymbol;

    #[Type('string')]
    #[SerializedName('quoteCurrencyId')]
    public string $quoteCurrencyId;

    #[Type('string')]
    #[SerializedName('quoteSymbol')]
    public string $quoteSymbol;

    #[Type('string')]
    #[SerializedName('rate')]
    public string $rate;
}