<?php

namespace App\Services\CoinPaymentServices\Enums;

enum HttpMethod: string
{
    case GET  = 'GET';
    case POST = 'POST';

    /**
     * Check Is Current Instance Is Get/Post Method
     * @return bool
     */
    public function isMethod(string $method): bool
    {
        $method = strtoupper($method);

        return match ($this) {
            self::GET->value  == $method => true,
            self::POST->value == $method => true,
            default => false
        };
    }

    /**
     * Check Is Current Instance Is Get Method
     * @return bool
     */
    public function isGetMethod(): bool
    {
        return $this->isMethod("GET");
    }

    /**
     * Check Is Current Instance Is Post Method
     * @return bool
     */
    public function isPostMethod(): bool
    {
        return $this->isMethod("GET");
    }
}