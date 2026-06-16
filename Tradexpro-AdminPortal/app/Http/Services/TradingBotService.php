<?php

namespace App\Http\Services;

use App\Jobs\SinglePairBotOrder;
use App\Model\CoinPair;
use App\Model\CoinPairApiPrice;
use App\Services\TradingBotServices\ApiPriceService\ApiPriceService;
use Illuminate\Support\Facades\DB;

class TradingBotService
{

    public function placeBotOrder($userId)
    {
        try {
            $coinPairs = CoinPair::select(
                'coin_pairs.id',
                'parent_coin_id as base_coin_id',
                'child_coin_id as trade_coin_id',
                'coin_pairs.is_token',
                'coin_pairs.bot_trading',
                'coin_pairs.initial_price',
                'coin_pairs.bot_possible',
                'coin_pairs.bot_operation',
                'coin_pairs.bot_percentage',
                'coin_pairs.upper_threshold',
                'coin_pairs.lower_threshold',
                DB::raw("visualNumberFormat(price) as last_price"),
                'child_coin.coin_type as trade_coin_type',
                'parent_coin.coin_type as base_coin_type',
                'child_coin.coin_price as trade_coin_usd_rate',
                'parent_coin.coin_price as base_coin_usd_rate',
                DB::raw('CONCAT(child_coin.coin_type,"_",parent_coin.coin_type) as pair_bin')
            )
                ->join('coins as child_coin', ['coin_pairs.child_coin_id' => 'child_coin.id'])
                ->join('coins as parent_coin', ['coin_pairs.parent_coin_id' => 'parent_coin.id'])
                ->where(['coin_pairs.status' => STATUS_ACTIVE, 'coin_pairs.bot_trading' => STATUS_ACTIVE])
                ->orderBy('coin_pairs.id', 'asc')
                ->get();
            // dd($coinPairs);
            if (isset($coinPairs[0])) {
                foreach ($coinPairs as $pair) {
                    $this->processSinglePairBotOrder($userId, $pair);
                }
            }
        } catch (\Exception $e) {
            storeException('placeBotOrder', $e->getMessage());
        }
    }

    // process single pair order
    public function processSinglePairBotOrder($user, $pair): void
    {
        try {
            $service = new TradingBotOrderPlaceService();
            if ($pair->bot_possible) { // checked this coin pair is market pair
                $apiService = new ApiPriceService($pair);

                $apiPriceResponse = $apiService->getPriceBy($pair->pair_bin);
                if(!is_success($apiPriceResponse)) return;

                $index    = rand(0,9);
                $buyData  = $apiPriceResponse['data']['buyData'] ?? [];
                $sellData = $apiPriceResponse['data']['sellData'] ?? [];
                $apiPrice = (object) [
                    'buy_price'   => $buyData [$index][0] ?? $buyData [0][0] ?? 0,
                    'buy_amount'  => $buyData [$index][1] ?? $buyData [0][1] ?? 0,
                    'sell_price'  => $sellData[$index][0] ?? $sellData[0][0] ?? 0,
                    'sell_amount' => $sellData[$index][1] ?? $sellData[0][1] ?? 0,
                ];
                // generate market bot order amount
                $apiPrice->buy_amount  = ($buyData [0][2] ?? false) ? $apiPrice->buy_amount  : $this->generateCustomBotAmount($pair);
                $apiPrice->sell_amount = ($sellData[0][2] ?? false) ? $apiPrice->sell_amount : $this->generateCustomBotAmount($pair);

                if(!!$apiPrice->buy_price  && !!$apiPrice->buy_amount ){
                    $service->createMarketBuyOrder($pair, $apiPrice, $user);
                }

                if(!!$apiPrice->sell_price  && !!$apiPrice->sell_amount){
                    $service->createMarketSellOrder($pair, $apiPrice, $user);
                }
            } else {
                $orderData = $this->generateBotOrderPriceAndAmount($pair);
                if (
                    $orderData 
                    && (($orderData['order_1']['price'] && $orderData['order_1']['amount'])
                    && ($orderData['order_2']['price'] && $orderData['order_2']['amount']))
                ) $service->placeBotBuySellOrder($orderData, $pair, $user);
            }
        } catch (\Exception $e) {
            storeException('processSinglePairOrder ' . $pair->pair_bin, $e->getMessage());
        }
    }


    // generate order price and amount
    public function generateBotOrderPriceAndAmount($pair)
    {
        $order_1 = $this->generateBotCustomPrice($pair, TRADE_TYPE_BUY);
        $order_2 = $this->generateBotCustomPrice($pair, TRADE_TYPE_SELL);

        $response = [
            'order_1' => $order_1,
            'order_2' => $order_2
        ];

        return $response;
    }

    public function generateBotCustomPrice(
        $pair,
        $tradeType,
        $operation = BOT_RANDOM_MARKET_PRICE,
    ) {
        try {
            $price = 0;
            $coinPairDecimal = 8;
            $operation = $pair->bot_operation;

            if ($operation == BOT_RANDOM_MARKET_PRICE) {
                $operation = getRandOperation();
            }

            $amount = $this->generateCustomBotAmount($pair);
            if ($amount <= 0) goto AMOUNT_IS_ZERO;

            $priceFactorRes = $this->generateLessDiffPricePercentFactor($pair);
            $randomPercentFactor = $priceFactorRes['percentFactor'];

            $response = $this->calculatePrice($pair, $randomPercentFactor, null, $operation);
            $price = $response['price'];
            $operation = $response['operation'];
            $priceChange = $response['priceChange'];
            $marketPrice = $response['marketPrice'];

            $price = formatAmountDecimal($price, $coinPairDecimal);

            if (!$pair->is_token && $operation == BOT_SYNC_MARKET_PRICE) {
                $curr_market_price = CoinPair::find($pair->id)->price;

                if ($curr_market_price > $price) {
                    $tradeType = TRADE_TYPE_SELL;
                } elseif ($curr_market_price < $price) {
                    $tradeType = TRADE_TYPE_BUY;
                }

                if ($curr_market_price != $price) {
                    $amount += bcmulx($amount, bcdivx(1000, 100, 8), 8);
                }
            }

            $amount = formatAmountDecimal($amount, $coinPairDecimal);

            AMOUNT_IS_ZERO:

            if ($pair->upper_threshold > 0 && $pair->lower_threshold > 0) {
                if ($price <= $pair->lower_threshold) {
                    $priceFactor = $this->generateLessDiffPricePercentFactor($pair, $pair->upper_threshold)['percentFactor'] ?? null;
                    $amount += $this->generateCustomBotAmount($pair);
                    $price   = $pair->upper_threshold - $pair->upper_threshold * ($priceFactor / 100);
                }
                if ($price >= $pair->upper_threshold) {
                    $priceFactor = $this->generateLessDiffPricePercentFactor($pair, $pair->lower_threshold)['percentFactor'] ?? null;
                    $amount += $this->generateCustomBotAmount($pair);
                    $price   = $pair->lower_threshold + $pair->lower_threshold * ($priceFactor / 100);
                }
            }
            $resData = [
                'price' => $price,
                'amount' => $amount,
                'orderType' => $tradeType,
                'operation' => $operation,
                'market_price' => $marketPrice ?? NULL
            ];

            return $resData;
        } catch (\Exception $e) {
            storeException('generateBotCustomPrice ' . $pair->pair_bin, $e->getMessage());
        }
    }

    public function getBotPrice($operation, $marketPrice, $randomPercentFactor)
    {
        if ($operation == BOT_SYNC_MARKET_PRICE) {
             $factor = getRandomInt(1);
            if ($factor % 2 == 0) {
                $operation = BOT_INCREASE_MARKET_PRICE;
            } else {
                $operation = BOT_INCREASE_MARKET_PRICE;
            }
        }

        $price = $marketPrice;
        $priceChange = bcmulx($marketPrice, bcdivx($randomPercentFactor, 100, 8), 8);
        if ($operation == BOT_INCREASE_MARKET_PRICE) {
            $price = bcaddx($marketPrice, $priceChange, 8);
        } elseif ($operation == BOT_DECREASE_MARKET_PRICE) {
            $price = bcsubx($marketPrice, $priceChange);
        }

        return $price;
    }

    // calculate price new
    public function calculatePrice($pair, $randomPercentFactor, $marketPrice = null, $operation = BOT_RANDOM_MARKET_PRICE)
    {
        $price = 0;
        $priceChange = 0;
        if (!$marketPrice) {
            $marketPrice = CoinPair::find($pair->id)->price;
        }
        if ($operation == BOT_RANDOM_MARKET_PRICE) {
            $operation = getRandOperation();
        }
        $maxPrice = $pair->upper_threshold;
        $minPrice = $pair->upper_threshold;
        $priceMatch = 1;
        
        if (!$pair->is_token && $operation == BOT_SYNC_MARKET_PRICE) {
            $response = $this->processOperationNeutral($pair);
            $price = $response['price'];
            $priceChange = $response['priceChange'];
        } else {
            $price = $this->getBotPrice($operation, $marketPrice, $randomPercentFactor);
        }

        $res = [
            'price' => $price,
            'marketPrice' => $marketPrice,
            'priceChange' => $priceChange,
            'operation' => $operation,
        ];
    
        return $res;
    }

    // generate bot custom amount
    public function generateCustomBotAmount($pair)
    {
        $min = floatval($pair->bot_min_amount);
        $max = floatval($pair->bot_max_amount);
        $min = (int) ($min * 10**10);
        $max = (int) ($max * 10**10);

        if($min > 0) { // $pair->is_token && 
            return mt_rand($min,$max) / 10**10;
        }

        $result = 0;
        try {
            $usdPrice = getConvertAmount($pair, $pair->trade_coin_type, 'USD', 1);
            $dividendFactor = getRandomIntFromRange(40, 100);
            $result = bcdivx($dividendFactor, $usdPrice, 8);
        } catch (\Exception $e) {
            storeException('generateCustomBotAmount ' . $pair->id, $e->getMessage());
        }
        return $result;
    }

    // generate less different price percent factor
    public function generateLessDiffPricePercentFactor($pair, $price = null, $randDiff = null, $randStart = null, $randEnd = null)
    {
        if (!$price) {
            $price = CoinPair::find($pair->id)->price;
        }
        $percentFactor = 0;
        $leftLength = getLeftSideLength($price);
        if ($price >= 1) {
            if ($leftLength >= 3) {
                $randStart = $randStart ? $randStart : generateNumOfZeros($leftLength - 3);
                $maxRandEnd = generateNumOfZeros($leftLength - 2);
                $wouldBeRandEnd = null;
                if ($randDiff) {
                    $wouldBeRandEnd = bcaddx($randStart, $randDiff, 8);
                    if ($wouldBeRandEnd > $maxRandEnd) {
                        $randEnd = $maxRandEnd;
                    }
                }
                $randEnd = $randEnd ?? $wouldBeRandEnd ?? $maxRandEnd;
                $dividendFactor = getRandomIntFromRange($randStart, $randEnd);
                $percentFactor = bcdivx($dividendFactor, $price);
            } else {
                $randStart = $randStart ?? generateNumOfZeros($leftLength - 1);

                $maxRandEnd = generateNumOfZeros($leftLength);
                $wouldBeRandEnd = null;
                if ($randDiff) {
                    $wouldBeRandEnd = bcaddx($randStart, $randDiff, 8);
                    if ($wouldBeRandEnd > $maxRandEnd) $randEnd = $maxRandEnd;
                }
                $randEnd = $randEnd ?? $wouldBeRandEnd ?? $maxRandEnd;

                $dividendFactor = getRandomIntFromRange($randStart, $randEnd);
                $percentFactor = bcdivx($dividendFactor, $price, 8);
            }
        } else {
            $len_zeros = getConsecutiveZeroLength($price);
            $randStart = $randStart ?? generateNumOfZeros($len_zeros);

            $maxRandEnd = generateNumOfZeros($len_zeros + 1);
            $wouldBeRandEnd = null;
            if ($randDiff) {
                $wouldBeRandEnd = bcaddx($randStart, $randDiff);
                if ($wouldBeRandEnd > $maxRandEnd) $randEnd = $maxRandEnd;
            }

            $randEnd = $randEnd ?? $wouldBeRandEnd ?? $maxRandEnd;

            $multiplierFactor = getRandomIntFromRange($randStart, $randEnd);
            $percentFactor = bcmulx($multiplierFactor, $price, 8);
        }
        $data = [
            'percentFactor' => $percentFactor,
            'price' => $price
        ];
        return $data;
    }

    // process operation neutral
    public function processOperationNeutral($pair)
    {
        // here trying to generate a price, which will be much close to current price from global market
        $data = $this->generatePriceUsingGlobalPrice($pair, BOT_SYNC_MARKET_PRICE, RATE_SOURCE_EXTERNAL);
        $res = [
            'price' => $data['price'],
            'priceChange' => $data['priceChange']
        ];
        return $res;
    }

    // generate price using global price
    public function generatePriceUsingGlobalPrice(
        $pair,
        $operation = BOT_RANDOM_MARKET_PRICE,
        $source = RATE_SOURCE_DB,
        $marketPrice = null
    ) {
        if (!$marketPrice) {
            $marketPrice = CoinPair::find($pair->id)->price;
        }
        if ($operation == BOT_RANDOM_MARKET_PRICE) {
            $operation = getRandOperation();
        }
        $price = 0;
        $priceChange = 0;

        $globalPrice = getConvertAmount($pair, $pair->trade_coin_type, $pair->base_coin_type, 1, $source);
        if ($operation == BOT_SYNC_MARKET_PRICE) {
            $price = $globalPrice;
        } else {
            $percentFactor = $this->generateLessDiffPricePercentFactor($pair, $globalPrice, 1000);
            $change = bcmulx($globalPrice, bcdivx($percentFactor['percentFactor'], 100, 8), 8);
            if ($operation == BOT_INCREASE_MARKET_PRICE) {
                $price = bcaddx($globalPrice, $change, 8);
            } elseif ($operation == BOT_DECREASE_MARKET_PRICE) {
                $price = bcsubx($globalPrice, $change);
            }
        }

        $priceChange = $priceChange = abs($price - $marketPrice);

        $res = [
            'price' => $price,
            'marketPrice' => $marketPrice,
            'priceChange' => $priceChange,
            'operation' => $operation,
        ];

        return $res;
    }

    public function generateRandPricePercentFactor(
        $percent_left_len,
        $percent_decimal,
        $max_percent,
        $min_percent
    ) {
        $percent_left_len = $percent_left_len
            ? $percent_left_len
            : PERCENT_LEFT_LEN;
        $percent_decimal = $percent_decimal
            ? $percent_decimal
            : PERCENT_DECIMAL;
        $max_percent = $max_percent
            ? $max_percent
            : MAX_PERCENT;
        $min_percent = $min_percent
            ? $min_percent
            : MIN_PERCENT;

        $randomPercentFactor =
            getRandomDecimalNumber($percent_left_len, $percent_decimal) ||
            $min_percent;
        if ($randomPercentFactor > $max_percent) {
            $randomPercentFactor = getRandomIntFromRange(1, 5) || 3;
        }

        return $randomPercentFactor;
    }

    public function getCoinPairPriceFromApi()
    {
        try {
            $coinPairs = CoinPair::select(
                'coin_pairs.id',
                'parent_coin_id as base_coin_id',
                'child_coin_id as trade_coin_id',
                'coin_pairs.bot_trading',
                DB::raw('CONCAT(child_coin.coin_type,"_",parent_coin.coin_type) as pair_bin')
            )
                ->join('coins as child_coin', ['coin_pairs.child_coin_id' => 'child_coin.id'])
                ->join('coins as parent_coin', ['coin_pairs.parent_coin_id' => 'parent_coin.id'])
                ->where(['coin_pairs.status' => STATUS_ACTIVE, 'coin_pairs.bot_trading' => STATUS_ACTIVE])
                ->orderBy('coin_pairs.id', 'asc')
                ->get();
            // dd($coinPairs);
            if (isset($coinPairs[0])) {
                foreach ($coinPairs as $pair) {
                    $callApi = getPriceFromApi($pair->pair_bin);
                    if (isset($callApi['success']) && $callApi['success']) {
                        $data = $callApi['data']  ?? [];
                        $sell = $data['sellData'] ?? [];
                        $buy  = $data['buyData']  ?? [];

                        CoinPairApiPrice::updateOrCreate([
                            "pair" => $pair->pair_bin
                        ], [
                            "buy_price"   => $buy[0][0],
                            "buy_amount"  => $buy[0][1],
                            "sell_price"  => $sell[0][0],
                            "sell_amount" => $sell[0][1],
                        ]);
                    }
                }
            }
        } catch (\Exception $e) {
        }
    }
}
