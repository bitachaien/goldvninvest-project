<?php


namespace App\Http\Services;

use App\Exceptions\InvalidRequestException;
use App\Model\Coin;
use App\Model\CoinSetting;
use App\Model\DepositeTransaction;
use App\Traits\ResponseFormatTrait;

class DepositService
{
    use ResponseFormatTrait;

    public function __construct() {}

    // check deposit by transaction
    public function checkDepositByHash($request)
    {
        $coin = Coin::join('coin_settings', function ($join) use ($request) {
            $join->on('coin_settings.coin_id', 'coins.id')
                ->where('coin_settings.coin_id', $request->coin_id)
                ->where('coin_settings.network', $request->network_id);
        })->where('coins.id', $request->coin_id)->first();

        if (empty($coin))
            throw new InvalidRequestException(__('Coin not found'));

        $deposit = DepositeTransaction::where("transaction_id", $request->trx_id)->first();
        if ($deposit) {
            $deposit["network"] = selected_node_network($request->network_id);
            return $this->responseData(true, __("This transaction already deposited in our system"), $deposit->toArray());
        }

        $transactionDepositService = new TransactionDepositService();
        $depositData = $transactionDepositService->checkCoinTransactionAndDeposit($request, true);

        if ($request->type == CHECK_DEPOSIT) {
            $response = $this->responseData(true, __('Transaction found'), $depositData['data']);
        } else {
            $response = $transactionDepositService->checkAddressAndDeposit($depositData['data']);
        }
        return $response;
    }
}
