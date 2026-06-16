<?php

namespace App\Services\Order;

class OrderCostService
{
    public function getTotalCost(
        $price,
        $amount,
        $makerFees,
        $takerFees,
        string $type
    ) {
        if ($type == 'sell') {
            return custom_number_format($amount);
        }

        $total = bcmulx($price, $amount);
        $fees = $makerFees > $takerFees ? $makerFees : $takerFees;
        $totalWithFees = bcaddx($total, bcdivx(bcmulx($total, $fees), "100"));

        return custom_number_format($totalWithFees);
    }
}
