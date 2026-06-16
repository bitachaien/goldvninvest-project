<?php

namespace App\Services\TradingBotServices\ApiPriceService;

use App\Dtos\BotCoinPairDto;
use Exception;
use App\Model\Buy;
use App\Model\Sell;
use App\Model\CoinPair;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Http\Services\BuyOrderService;
use App\Http\Services\SellOrderService;
use App\Services\TradingBotServices\ApiPriceService\ApiProviderEnum;

class ApiPriceService
{
    public function __construct(private CoinPair|BotCoinPairDto $coinPair){}

    public function getPriceBy(string $coinPair, ?ApiProviderEnum $provider = null): mixed
    {
        if($this->coinPair->last_price < 5) $this->cacheOrderbookPrices();

        $currentPriceFailed = false;
        $provider ??= ApiProviderEnum::tryFrom(rand(1,6));
        $providerIndex = 1;
        while(true){
            $response = null;
            if($providerIndex == 6) break;

            try{
                $response = $this->apiRequest(
                    coinPair: $coinPair,
                    provider: $provider ??= ApiProviderEnum::tryFrom($providerIndex++)
                );

                if(! $response["buyData"] ) $response = false;

                // Return if current price failed
                if($currentPriceFailed && $response) return success(
                    $this->getCurrentPriceFailedAdjustAbleAmountByPrice($response)
                );
            } catch(Exception $e){
                logger("getPriceBy for market bot");
                logger($e->getMessage());

                if($provider == ApiProviderEnum::BINANCE_CURRENT_PRICE)
                    $currentPriceFailed = true;

                $provider = null;
                $response = false;
            }

            // Return Response
            if($response) return $this->successPriceResponseFilter(
                response: $response,
                provider: $provider
            );
        }
        return failed();
    }

    public function getCoinPairReady(string $coinPair, ApiProviderEnum $provider): string
    {
        return match($provider){
            ApiProviderEnum::BINANCE  => str_replace('_', '', $coinPair),
            ApiProviderEnum::WHITEBIT => $coinPair,
            ApiProviderEnum::GATEOI   => $coinPair,
            ApiProviderEnum::KUCOIN   => str_replace('_', '-', $coinPair),
            ApiProviderEnum::OKX   => str_replace('_', '-', $coinPair),
            ApiProviderEnum::BINANCE_CURRENT_PRICE  => str_replace('_', '', $coinPair),
            // default => $coinPair
        };
    }

    /**
     * Summary of apiRequest
     * @param string $coinPair
     * @param \App\Services\TradingBotServices\ApiPriceService\ApiProviderEnum $provider
     * @return array{buyData: array<mixed>, sellData: array<mixed>}
     */
    public function apiRequest(string $coinPair, ApiProviderEnum $provider): array
    {
        $headers = [
            "User-Agent" => "Mozilla/5.0",
            "Accept" => "application/json",
            "Content-Type" => "application/json",
        ];

        $options = [
            'http' => [
                'header'  => implode("\r\n", array_map(fn($key)=> "$key: {$headers[$key]}" ,array_keys($headers))),
                'method'  => 'GET',
                'content' => null,
                'timeout' => 3,
            ],
        ];

        $context  = stream_context_create($options);
        $url = $provider->getUrl($this->getCoinPairReady($coinPair, $provider));
        $response = file_get_contents($url,false, $context);
        if(! $response) return ["buyData" => [], "sellData" => []];
        $data = json_decode($response, true);

        return match($provider){
            ApiProviderEnum::BINANCE  => ["buyData" => $data['bids'] ?? [], "sellData" => $data['asks'] ?? []],
            ApiProviderEnum::WHITEBIT => ["buyData" => $data['bids'] ?? [], "sellData" => $data['asks'] ?? []],
            ApiProviderEnum::GATEOI   => ["buyData" => $data['bids'] ?? [], "sellData" => $data['asks'] ?? []],
            ApiProviderEnum::KUCOIN   => ["buyData" => $data['data']['bids'] ?? [], "sellData" => $data['data']['asks'] ?? []],
            ApiProviderEnum::OKX      => $this->okx_current_price($data),
            ApiProviderEnum::BINANCE_CURRENT_PRICE => $this->binance_current_price($data),
            // default => ["buyData" => [], "sellData" => []],
        };
    }

    /**
     * Summary of binance_current_price
     * @param mixed $response
     * @return array{buyData: array<mixed>, sellData: array<mixed>}
     */
    private function binance_current_price(mixed $response)
    {
        $price = $response['price'] ?? 0;
        return $this->getOderBookAdjustAbleAmountByPrice($price);
    }

    /**
     * Summary of okx_current_price
     * @param mixed $response
     * @return array{buyData: array<mixed>, sellData: array<mixed>}
     */
    private function okx_current_price(mixed $response)
    {
        $price = $response['data'][0]['last'] ?? 0;
        return $this->getOderBookAdjustAbleAmountByPrice($price);
    }

    /**
     * Summary of getOderBookAdjustAbleAmountByPrice
     * @param float $price
     * @return array{buyData: array<mixed>, sellData: array<mixed>}
     */
    private function getOderBookAdjustAbleAmountByPrice(float $price): mixed
    {
        return [
            "buyData" => [
                [ $price, $this->getBestSellPrice($price), true ]
            ],
            "sellData" => [
                [ $price, $this->getBestBuyPrice($price), true ]
            ]
        ];
    }

    /**
     * Summary of getOderBookAdjustAbleAmountByPrice
     * @param array{buyData: array<mixed>, sellData: array<mixed>} $response
     * @return array{buyData: array<mixed>, sellData: array<mixed>}
     */
    private function getCurrentPriceFailedAdjustAbleAmountByPrice(array $response): array
    {
        return [
            "buyData" => [
                [ $response['buyData'][0][0], $this->getBestSellPrice($response['buyData'][0][0]), true ]
            ],
            "sellData" => [
                [ $response['sellData'][0][0], $this->getBestBuyPrice($response['sellData'][0][0]), true ]
            ]
        ];
    }

    public function successPriceResponseFilter(array $response, ApiProviderEnum $provider): array
    {
        $buyKey = "orderbook_pending_buy_prices_{$this->coinPair->base_coin_id}_{$this->coinPair->trade_coin_id}";
        $sellKey = "orderbook_pending_sell_prices_{$this->coinPair->base_coin_id}_{$this->coinPair->trade_coin_id}";
        $buyPrices = Cache::get($buyKey) ?? [];
        $sellPrices = Cache::get($sellKey) ?? [];
        if(
            $provider == ApiProviderEnum::BINANCE_CURRENT_PRICE
            || $provider == ApiProviderEnum::OKX
        ) return success($response);

        foreach ($response['buyData'] as $key => $value) {
            $price = $response['buyData'][$key][0];
            if(in_array($price, $buyPrices)) unset($response['buyData'][$key]);
        }

        foreach ($response['sellData'] as $key => $value) {
            $price = $response['sellData'][$key][0];
            if(in_array($price, $sellPrices)) unset($response['sellData'][$key]);
        }

        return success($response);
    }

    /**
     * Summary of getBestBuyPrice
     * @param float $price
     * @return float
     */
    protected function getBestBuyPrice(float $price): float
    {
        $buyOrder = Buy::select(DB::raw("MIN(price) as price, SUM(amount) as amount"))->where([
            "trade_coin_id" => $this->coinPair->trade_coin_id,
            "base_coin_id"  => $this->coinPair->base_coin_id,
            "status"        => 0,
        ])->where("price", ">=", $price)->first();

        return $buyOrder?->amount ?: rand(10**6 * 0.006, 10**6 * 0.09) / 10**6;
    }

    /**
     * Summary of getBestSellPrice
     * @param float $price
     * @return float
     */
    protected function getBestSellPrice(float $price): float
    {
        $sellOrder = Sell::select(DB::raw("MIN(price) as price, SUM(amount) as amount"))->where([
            "trade_coin_id" => $this->coinPair->trade_coin_id,
            "base_coin_id"  => $this->coinPair->base_coin_id,
            "status"        => 0,
        ])->where("price", "<=", $price)->first();

        return $sellOrder?->amount ?: rand(10**6 * 0.006, 10**6 * 0.09) / 10**6;

    }

    protected function cacheOrderbookPrices(): void
    {
        $buyKey = "orderbook_pending_buy_prices_{$this->coinPair->base_coin_id}_{$this->coinPair->trade_coin_id}";
        $sellKey = "orderbook_pending_sell_prices_{$this->coinPair->base_coin_id}_{$this->coinPair->trade_coin_id}";

        if(Cache::has($buyKey) && Cache::has($sellKey)) return;

        $buyService  = new BuyOrderService();
        $sellService = new SellOrderService();

        $buyPrices = $buyService->getAllOrders(
            base_coin_id : $this->coinPair->base_coin_id,
            trade_coin_id: $this->coinPair->trade_coin_id,
        )->limit(20)->pluck('price')->toArray();
        
        $sellPrices = $sellService->getAllOrders(
            base_coin_id : $this->coinPair->base_coin_id,
            trade_coin_id: $this->coinPair->trade_coin_id,
        )->limit(20)->pluck('price')->toArray();

        Cache::put($buyKey, $buyPrices, now()->addMinutes(10));
        Cache::put($sellKey, $sellPrices, now()->addMinutes(10));
    }
}