<?php

namespace App\Services\Order;

use App\Dtos\OrderCreationDto;
use App\Exceptions\OrderException;
use App\Model\CoinPair;

class ToleranceCheckerService
{
    public function checkTolarence(OrderCreationDto $data, CoinPair $coinPair, string $type)
    {
        $settingTolerance = settings('trading_price_tolerance');

        if (bccompx($settingTolerance, '0', 2) <= 0) {
            return;
        }

        $lastPrice = $coinPair->price;

        if (bccompx($lastPrice, 0) <= 0) {
            return;
        }

        $tolerancePrice = bcdivx(bcmulx($lastPrice, $settingTolerance), '100');
        $highTolerance = bcaddx($lastPrice, $tolerancePrice);
        $lowTolerance = bcsubx($lastPrice, $tolerancePrice);

        if (bccompx($data->price, $highTolerance) > 0 || bccompx($data->price, $lowTolerance) < 0) {

            throw new OrderException(__('The price must be between :lowTolerance and :highTolerance ', ['lowTolerance' => $lowTolerance, 'highTolerance' => $highTolerance]));
        }
    }
}
