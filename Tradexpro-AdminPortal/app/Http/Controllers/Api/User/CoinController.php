<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\CoinResource;
use App\Http\Services\CoinPairService;
use App\Http\Services\CoinService;
use App\Http\Services\Logger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CoinController extends Controller
{
    public $service;
    public $pairService;
    public $logger;
    public function __construct()
    {
        $this->service = new CoinService();
        $this->pairService = new CoinPairService();
        $this->logger = new Logger();
    }

    public function getCoinList(Request $request): JsonResponse
    {
        return $this->handlerApiResponse(function () use ($request) {
            $data['status'] = STATUS_ACTIVE;

            if ($request->currency_type)
                $data['currency_type'] = $request->currency_type;

            if ($request->is_deposit) {
                $data['is_deposit'] = STATUS_ACTIVE;
                if ($request->check_deposit) {
                    $data['network'] = ['operator' => 'in', 'values' => collect(selected_node_network())->keys()->toArray()];
                }
            }
            if ($request->is_withdrawal)
                $data['is_withdrawal'] = STATUS_ACTIVE;

            if ($request->trade_status)
                $data['trade_status'] = STATUS_ACTIVE;

            $coins = $this->service->getCoin($data);
            return $this->responseData(true, __('All Coins'), CoinResource::collection($coins));
        });
    }

    /**
     * all coin pair list
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCoinPairList()
    {
        $pairs = $this->pairService->getAllCoinPairs();
        return response()->json($pairs);
    }
}
