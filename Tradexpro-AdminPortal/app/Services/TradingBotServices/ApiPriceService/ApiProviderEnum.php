<?php

namespace App\Services\TradingBotServices\ApiPriceService;

enum ApiProviderEnum: int
{
    case BINANCE = 1;
    case WHITEBIT = 2;
    case GATEOI = 3;
    case KUCOIN = 4;
    case BINANCE_CURRENT_PRICE = 5;
    case OKX = 6;

    public function getUrl(string $coinPair): string
    {
        return match ($this) {
            self::BINANCE  => "https://api.binance.com/api/v3/depth?symbol=$coinPair&limit=10",
            self::WHITEBIT => "https://whitebit.com/api/v4/public/orderbook/$coinPair?limit=1&level=2",
            self::GATEOI   => "https://api.gateio.ws/api/v4/spot/order_book?currency_pair=$coinPair&limit=10",
            self::KUCOIN   => "https://api.kucoin.com/api/v1/market/orderbook/level2_20?symbol=$coinPair&limit=10",
            self::OKX      => "https://www.okx.com/api/v5/market/ticker?instId=$coinPair",
            self::BINANCE_CURRENT_PRICE  => "https://api.binance.com/api/v3/ticker/price?symbol=$coinPair",
        };
    }
}