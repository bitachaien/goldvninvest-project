<?php

namespace App\Services\CoinPaymentServices\Responses\WalletResponse;

use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\SerializedName;

class BalanceResponse
{
    #[Type('string')]
    #[SerializedName('value')]
    public string $value;

    #[Type('string')]
    #[SerializedName('currencyId')]
    public string $currencyId;

    #[Type('string')]
    #[SerializedName('currencySymbol')]
    public string $currencySymbol;
}