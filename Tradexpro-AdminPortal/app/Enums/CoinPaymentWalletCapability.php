<?php

namespace App\Enums;

enum CoinPaymentWalletCapability: string
{
    case PAYMENTS = 'payments';
    case SINGLE_SIG_ACCOUNTS = 'singleSigAccounts';
    case UTXO = 'utxo';
    case POOLED_ACCOUNTS = 'pooledAccounts';
    case DEST_TAG = 'dest_tag';
    case CONVERT = 'convert';

    /**
     * Check if a specific capability exists in a capabilities list.
     *
     * @param string[] $capabilities
     * @param self $capability
     * @return bool
     */
    public static function has(array $capabilities, self $capability): bool
    {
        return in_array($capability->value, $capabilities, true);
    }

    /**
     * Get all capabilities as string array.
     *
     * @return string[]
     */
    public static function values(): array
    {
        return array_map(fn(self $case) => $case->value, self::cases());
    }

    /**
     * Get enum case from string, or null if invalid
     *
     * @param string $value
     * @return self|null
     */
    public static function tryFromString(string $value): ?self
    {
        foreach (self::cases() as $case) {
            if ($case->value === $value) {
                return $case;
            }
        }

        return null;
    }
}
