<?php
declare(strict_types=1);

namespace App\Services\CoinPaymentServices;

interface Response
{
    /**
     * Check if response has errors
     */
    public function hasErrors(): bool;
}