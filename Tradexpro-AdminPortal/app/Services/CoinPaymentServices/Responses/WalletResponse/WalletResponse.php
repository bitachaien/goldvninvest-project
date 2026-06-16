<?php

namespace App\Services\CoinPaymentServices\Responses\WalletResponse;

use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\SerializedName;
use App\Services\CoinPaymentServices\Responses\WalletResponse\BalanceResponse;

class WalletResponse
{
    #[Type('string')]
    #[SerializedName('walletId')]
    public string $walletId;

    // #[Type('string')]
    // #[SerializedName('walletType')]
    // public string $walletType;

    // #[Type('string')]
    // #[SerializedName('currencyId')]
    // public string $currencyId;

    // #[Type('string')]
    // #[SerializedName('currencySymbol')]
    // public string $currencySymbol;

    // #[Type('bool')]
    // #[SerializedName('isActive')]
    // public bool $isActive;

    // #[Type('bool')]
    // #[SerializedName('isLocked')]
    // public bool $isLocked;

    // #[Type('string')]
    // #[SerializedName('label')]
    // public string $label;

    // // #[Type('App\Services\CoinPaymentServices\Responses\WalletResponse\BalanceResponse')]
    // // #[SerializedName('confirmedBalance')]
    // // public BalanceResponse $confirmedBalance;

    // // #[Type('App\Services\CoinPaymentServices\Responses\WalletResponse\BalanceResponse')]
    // // #[SerializedName('unconfirmedBalance')]
    // // public BalanceResponse $unconfirmedBalance;

    // // #[Type('App\Services\CoinPaymentServices\Responses\WalletResponse\BalanceResponse')]
    // // #[SerializedName('confirmedNativeBalance')]
    // // public BalanceResponse $confirmedNativeBalance;

    // // #[Type('App\Services\CoinPaymentServices\Responses\WalletResponse\BalanceResponse')]
    // // #[SerializedName('unconfirmedNativeBalance')]
    // // public BalanceResponse $unconfirmedNativeBalance;

    // #[Type('bool')]
    // #[SerializedName('canCreateAddresses')]
    // public bool $canCreateAddresses;

    // #[Type('bool')]
    // #[SerializedName('isVaultLocked')]
    // public bool $isVaultLocked;

    // #[Type('DateTimeImmutable|null')]
    // #[SerializedName('vaultLockoutEndDateTime')]
    // public ?\DateTimeImmutable $vaultLockoutEndDateTime = null;

    // #[Type('bool')]
    // #[SerializedName('hasPermanentAddresses')]
    // public bool $hasPermanentAddresses;

    // #[Type('bool')]
    // #[SerializedName('hasActiveAddress')]
    // public bool $hasActiveAddress;

    // #[Type('string')]
    // #[SerializedName('clientId')]
    // public string $clientId;
}