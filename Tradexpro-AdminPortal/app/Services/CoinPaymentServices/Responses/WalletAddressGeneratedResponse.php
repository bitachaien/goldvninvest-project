<?php

namespace App\Services\CoinPaymentServices\Responses;

use DateTimeImmutable;
use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\SerializedName;
use App\Services\CoinPaymentServices\Responses\AbstractResponse;

class WalletAddressGeneratedResponse extends AbstractResponse
{
    #[Type('string')]
    #[SerializedName('addressId')]
    public string $addressId;

    #[Type('string')]
    #[SerializedName('networkAddress')]
    public string $networkAddress;

    #[Type('DateTimeImmutable<"Y-m-d\TH:i:s">')]
    #[SerializedName('rentedTill')]
    public ?DateTimeImmutable $rentedTill;
}