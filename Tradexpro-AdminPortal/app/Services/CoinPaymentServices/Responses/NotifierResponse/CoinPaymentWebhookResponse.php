<?php

namespace App\Services\CoinPaymentServices\Responses\NotifierResponse;

use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\SerializedName;

class CoinPaymentWebhookResponse
{
    #[SerializedName("walletId")]
    #[Type("string")]
    public string $walletId;

    #[SerializedName("address")]
    #[Type("string")]
    public string $address;

    #[SerializedName("transactionId")]
    #[Type("string")]
    public string $transactionId;

    #[SerializedName("txHash")]
    #[Type("string")]
    public ?string $txHash = null;

    #[SerializedName("spendRequestId")]
    #[Type("string")]
    public string $spendRequestId;

    #[SerializedName("transactionType")]
    #[Type("string")]
    public string $transactionType;

    #[SerializedName("amount")]
    #[Type("string")]
    public string $amount;

    #[SerializedName("symbol")]
    #[Type("string")]
    public string $symbol;

    #[SerializedName("coinPaymentsFee")]
    #[Type("string")]
    public string $coinPaymentsFee;

    #[SerializedName("coinPaymentsFeeSymbol")]
    #[Type("string")]
    public string $coinPaymentsFeeSymbol;

    #[SerializedName("blockchainFee")]
    #[Type("string")]
    public string $blockchainFee;

    #[SerializedName("blockchainFeeSymbol")]
    #[Type("string")]
    public string $blockchainFeeSymbol;

    #[SerializedName("totalAmount")]
    #[Type("string")]
    public string $totalAmount;

    #[SerializedName("totalAmountSymbol")]
    #[Type("string")]
    public string $totalAmountSymbol;

    #[SerializedName("nativeAmount")]
    #[Type("string")]
    public string $nativeAmount;

    #[SerializedName("coinPaymentsFeeNativeAmount")]
    #[Type("string")]
    public string $coinPaymentsFeeNativeAmount;

    #[SerializedName("blockchainFeeNativeAmount")]
    #[Type("string")]
    public string $blockchainFeeNativeAmount;

    #[SerializedName("totalNativeAmount")]
    #[Type("string")]
    public string $totalNativeAmount;

    #[SerializedName("nativeSymbol")]
    #[Type("string")]
    public string $nativeSymbol;

    #[SerializedName("confirmations")]
    #[Type("integer")]
    public int $confirmations;

    #[SerializedName("requiredConfirmations")]
    #[Type("integer")]
    public int $requiredConfirmations;

    #[SerializedName("transactionStatus")]
    #[Type("string")]
    public string $transactionStatus;
}
