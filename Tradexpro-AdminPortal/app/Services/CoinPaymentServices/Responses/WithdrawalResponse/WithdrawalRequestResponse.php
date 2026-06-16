<?php

namespace App\Services\CoinPaymentServices\Responses\WithdrawalResponse;

use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\SerializedName;
use App\Services\CoinPaymentServices\Responses\AbstractResponse;

class WithdrawalRequestResponse extends AbstractResponse
{
    #[Type('string')]
    #[SerializedName('spendRequestId')]
    public string $spendRequestId;

    #[Type('string')]
    #[SerializedName('fromWalletId')]
    public string $fromWalletId;

    #[Type('string')]
    #[SerializedName('toAddress')]
    public string $toAddress;

    #[Type('string')]
    #[SerializedName('fromCurrencyId')]
    public string $fromCurrencyId;

    #[Type('string')]
    #[SerializedName('fromCurrencySymbol')]
    public string $fromCurrencySymbol;

    #[Type('string')]
    #[SerializedName('fromAmount')]
    public string $fromAmount;

    #[Type('string')]
    #[SerializedName('toCurrencyId')]
    public string $toCurrencyId;

    #[Type('string')]
    #[SerializedName('toCurrencySymbol')]
    public string $toCurrencySymbol;

    #[Type('string')]
    #[SerializedName('toAmount')]
    public string $toAmount;

    #[Type('string')]
    #[SerializedName('blockchainFee')]
    public string $blockchainFee;

    #[Type('string')]
    #[SerializedName('coinpaymentsFee')]
    public string $coinpaymentsFee;

    #[Type('string')]
    #[SerializedName('memo')]
    public ?string $memo;

    #[Type('string')]
    #[SerializedName('walletToPayFeeFrom')]
    public ?string $walletToPayFeeFrom;
}