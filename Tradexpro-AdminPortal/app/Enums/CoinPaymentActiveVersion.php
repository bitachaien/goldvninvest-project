<?php

namespace App\Enums;

use App\Http\Services\CoinPaymentsAPI;
use App\Services\CoinPaymentServices\CoinPaymentService;

enum CoinPaymentActiveVersion: int
    {
        case LEGACY = 1;
        case COIN_PAYMENT_V2 = 2;
    
        /**
         * Get human-readable names for all versions
         */
        public static function getVersionNames(): array
        {
            return [
                self::LEGACY->value => 'Legacy',
                self::COIN_PAYMENT_V2->value => 'CoinPayment V2'
            ];
        }
    
        /**
         * Get the human-readable name for the current version
         */
        public function getVersionName(): string
        {
            return match($this) {
                self::LEGACY => 'Legacy',
                self::COIN_PAYMENT_V2 => 'CoinPayment V2'
            };
        }
    
        /**
         * Generate HTML select options
         */
        public static function toSelectOptions(?string $selectedValue = null): string
        {
            $html = '';
            foreach (self::cases() as $case) {
                $selected = $selectedValue == $case->value ? 'selected' : '';
                $html .= sprintf(
                    '<option value="%s" %s>%s</option>',
                    $case->value,
                    $selected,
                    $case->getVersionName()
                );
            }
            return $html;
        }
    
        /**
         * Get all available versions as an associative array
         */
        public static function toArray(): array
        {
            return array_combine(
                array_column(self::cases(), 'value'),
                array_map(fn($case) => $case->getVersionName(), self::cases())
            );
        }
    
        /**
         * Get enum case from value
         */
        public static function fromValue(string $value): self
        {
            return match($value) {
                '1' => self::LEGACY,
                '2' => self::COIN_PAYMENT_V2,
                default => throw new \InvalidArgumentException("Invalid API version: $value")
            };
        }

        /**
         * Get CoinPayment Service
         * @return CoinPaymentsAPI|CoinPaymentService
         */
        public function getService(): CoinPaymentsAPI|CoinPaymentService
        {
            return match($this){
                self::LEGACY          => new CoinPaymentsAPI(),
                self::COIN_PAYMENT_V2 => new CoinPaymentService(),
            };
        }
    }