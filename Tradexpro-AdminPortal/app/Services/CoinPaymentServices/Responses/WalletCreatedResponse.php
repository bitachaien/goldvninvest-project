<?php

namespace App\Services\CoinPaymentServices\Responses;

use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\VirtualProperty;
use App\Services\CoinPaymentServices\Responses\AbstractResponse;

class WalletCreatedResponse extends AbstractResponse
{
    #[Type('string')]
    #[SerializedName('walletId')]
    public string $walletId;

    #[Type('string')]
    #[SerializedName('address')]
    public ?string $address = null;

    public function hasAddress(): bool
    {
        return $this->address !== null;
    }

    #[VirtualProperty]
    #[SerializedName('isAddressGenerated')]
    public function isAddressGenerated(): bool
    {
        return $this->hasAddress();
    }
}