<?php

namespace App\Services\CoinPaymentServices\Responses\WalletResponse;

use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\Type;
use App\Services\CoinPaymentServices\Responses\AbstractResponse;
use App\Services\CoinPaymentServices\Responses\WalletResponse\WalletResponse;

class GetWalletResponse extends AbstractResponse
{
    // #[Type("array<App\Services\CoinPaymentServices\Responses\WalletResponse\WalletResponse>")]
    #[Type("Wallets_type")]
    public ?array $items = null;
}