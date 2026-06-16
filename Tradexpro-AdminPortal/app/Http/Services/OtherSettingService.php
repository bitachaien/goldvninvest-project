<?php

namespace App\Http\Services;

use App\Exceptions\InvalidRequestException;
use App\Model\Coin;
use App\Model\DepositeTransaction;
use App\Model\Wallet;
use App\Model\WalletAddressHistory;
use App\Model\WalletNetwork;
use App\Model\WithdrawHistory;
use App\Traits\ResponseFormatTrait;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class OtherSettingService
{
    use ResponseFormatTrait;

    public function deleteWalletAddress(Request $request, User $admin)
    {
        $result['redirectUrl'] = route('otherSetting', ['tab' => 'address_delete']);

        if (env('APP_MODE') == 'demo')
            throw new InvalidRequestException(__('Currently disable only for demo'));

        // check is coin type available
        if (empty(@$request->coin_type))
            return $this->responseData(false, __("Select a coin to delete address"), $result);

        // check is password has
        if (empty(@$request->password))
            return $this->responseData(false, __("Admin password is required for this action"), $result);

        // check password
        if (!(Hash::check($request->password, $admin->password)))
            return $this->responseData(false, __("Password is incorrect"), $result);

        // check is coin available
        $coin = Coin::where('coin_type', $request->coin_type)->first();
        if (empty($coin))
            return $this->responseData(false, __("Selected coin not found"), $result);

        // check is wallet has in system
        $wallet = Wallet::where('coin_type', $request->coin_type)->first();
        if (empty($wallet))
            return $this->responseData(false, __("Selected coin has no wallet"), $result);

        $conditions = ['coin_type' => $request->coin_type, 'network' => $coin->network];

        // check is wallet have address
        $address = WalletAddressHistory::where($conditions)->first();
        if (empty($address) && !($request->coin_type == COIN_USDT && $coin->network == COIN_PAYMENT))
            return $this->responseData(false, __("Selected coin's wallet dose not have address"), $result);

        // delete all data of selected coin
        DB::beginTransaction();
        try {
            WalletAddressHistory::where($conditions)->update(['status' => WalletAddressHistory::EXPIRE]);
            DepositeTransaction::where($conditions)->update(['status' => DepositeTransaction::EXPIRE]);
            WithdrawHistory::where($conditions)->update(['status' => WithdrawHistory::EXPIRE]);

            if ($request->coin_type == COIN_USDT && $coin->network == COIN_PAYMENT)
                WalletNetwork::where('coin_id', $coin->id)->update(['status' => WalletNetwork::EXPIRE]);

            DB::commit();
            return $this->responseData(true, __("Selected coin's wallet address deleted successfully"), $result);
        } catch (\Exception $e) {
            DB::rollBack();
            storeLog(processExceptionMsg($e), "error");
            return $this->responseData(false, __("Failed to delete selected coin's wallet address"), $result);
        }
    }
}
