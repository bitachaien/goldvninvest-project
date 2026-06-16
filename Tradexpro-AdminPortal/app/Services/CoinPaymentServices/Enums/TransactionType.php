<?php

namespace App\Services\CoinPaymentServices\Enums;

enum TransactionType: string
{
    case InternalReceive = 'InternalReceive';
    case UtxoExternalReceive = 'UtxoExternalReceive';
    case AccountBasedExternalReceive = 'AccountBasedExternalReceive';
    case InternalSpend = 'InternalSpend';
    case ExternalSpend = 'ExternalSpend';
    case SameUserReceive = 'SameUserReceive';
    case AccountBasedExternalTokenReceive = 'AccountBasedExternalTokenReceive';
    case AccountBasedTokenSpend = 'AccountBasedTokenSpend';

    /**
     * Check Param Type Is Relivenet Of Deposit Type
     * 
     * @param string $type
     * @return bool
     */
    public static function isReceivedDeposit(string $type):bool
    {
        return match($type){
            self::InternalReceive->value,
            self::UtxoExternalReceive->value,
            self::AccountBasedExternalReceive->value,
            self::SameUserReceive->value,
            self::AccountBasedExternalTokenReceive->value
                    => true,
            default => false
        };
    }
}
