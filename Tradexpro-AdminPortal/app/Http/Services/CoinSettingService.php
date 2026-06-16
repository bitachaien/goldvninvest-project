<?php

namespace App\Http\Services;

use App\Exceptions\InvalidRequestException;
use App\Http\Repositories\CoinSettingRepository;
use App\Model\Coin;
use App\Model\CoinSetting;
use App\Model\DepositeTransaction;
use App\Model\WithdrawHistory;
use Illuminate\Http\Request;

class CoinSettingService extends BaseService
{

    public $model = CoinSetting::class;
    public $repository = CoinSettingRepository::class;
    public $coinService;

    public function __construct()
    {
        parent::__construct($this->model, $this->repository);
        $this->coinService = new CoinService();
    }

    // get coin setting
    public function getCoinSettings($coinId)
    {
        $coin = $this->coinService->getCoinDetailsById($coinId);
        if (empty($coin))
            throw new InvalidRequestException(__('Coin not found'));

        $coinSetting = $this->object->getCoinSettingData($coin, $coin->network);
        if (empty($coinSetting))
            throw new InvalidRequestException(__('Coin settings not found'));

        return $coinSetting;
    }

    // update coin setting
    public function updateCoinSetting($request)
    {
        $coin = $this->coinService->getCoinDetailsById(decrypt($request->coin_id));
        if (empty($coin))
            throw new InvalidRequestException(__('Coin not found'));

        $this->object->createCoinSetting($coin->id, $coin->network);

        return match ($coin->network) {
            BITGO_API => $this->updateBitgoApi($coin->id, $coin->network, $request),
            BITCOIN_API => $this->updateBitCoinApi($coin->id, $coin->network, $request),
            default => $this->updateERCCoinApi($coin->id, $coin->network, $request)
        };
    }

    // update bitcoin api
    public function updateBitCoinApi(int $coinId, int $network, Request $request)
    {
        $data = [
            'coin_api_user' => $request->coin_api_user,
            'coin_api_pass' => encrypt($request->coin_api_pass),
            'coin_api_host' => $request->coin_api_host,
            'coin_api_port' => $request->coin_api_port,
            'check_encrypt' => STATUS_SUCCESS,
        ];
        $this->object->updateWhere(['coin_id' => $coinId, 'network' => $network], $data);
        return $this->responseData(true, __('Coin api setting updated successfully'));
    }

    // update bitcoin api
    public function updateBitgoApi(int $coinId, int $network, Request $request)
    {
        $data = [
            'bitgo_wallet_id' => $request->bitgo_wallet_id,
            'bitgo_wallet' => encrypt($request->bitgo_wallet),
            'chain' => $request->chain,
            'check_encrypt' => STATUS_SUCCESS,
        ];
        $this->object->updateWhere(['coin_id' => $coinId, 'network' => $network], $data);
        return $this->responseData(true, __('Coin api setting updated successfully'));
    }
    // update erc20 or bep20 api
    public function updateERCCoinApi(int $coinId, int $network,  Request $request): array
    {
        $data = [
            'contract_coin_name' => $request->contract_coin_name,
            'chain_link' => $request->chain_link,
            'contract_address' => $request->contract_address,
            'contract_decimal' => $request->contract_decimal,
            'gas_limit' => $request->gas_limit,
            'network_name' => $request->network_name,
            'check_encrypt' => STATUS_SUCCESS,
        ];

        // $coin_update_data = [];
        // if (isset($request->last_block_number))
        //     $coin_update_data['last_block_number'] = $request->last_block_number;

        // if (isset($request->from_block_number))
        //     $coin_update_data['from_block_number'] = $request->from_block_number;

        // if (isset($request->to_block_number))
        //     $coin_update_data['to_block_number'] = $request->to_block_number;

        // if ($coin_update_data)
        //     $coin_update = Coin::where('id', $coinId)->update($coin_update_data);


        $coinSetting = (new CoinSettingRepository(CoinSetting::class))
            ->getCoinSettingData($coinId, $network);

        $coinSettingContactAddress = CoinSetting::where([
            'contract_address' => $request->contract_address,
            'network' => $network
        ])->first();

        if($coinSettingContactAddress && $coinSettingContactAddress->coin_id != $coinId)
            return $this->responseData(false, __('Contract address already has on same network'));

        if ($request->chain_link != $coinSetting->chain_link) {
            $data['chain_link'] = $request->chain_link;

            $coinSetting->chain_link = $data['chain_link'];

            $erc20Api = new ERC20TokenApi($coinSetting);
            $response = $erc20Api->getNetworkId([]);

            if ($response['success'] == false) throw new InvalidRequestException($response['message']);

            $data['chain_id'] =  $response['data']->chainId;

            if (!empty($coinSetting->chain_id) && $data['chain_id'] != $coinSetting->chain_id) {
                $isThereAnyPendingTokens = DepositeTransaction::whereNotIn('network', [COIN_PAYMENT, BITCOIN_API, BITGO_API])
                    ->where([
                        'coin_type' => $coinSetting->coin_type,
                        'address_type' => ADDRESS_TYPE_EXTERNAL,
                        'is_admin_receive' => DepositeTransaction::PENDING
                    ])->count();

                if ($isThereAnyPendingTokens > 0)
                    throw new InvalidRequestException(__("There are pending tokens, they must be accepted before changing network by RPC."));

                if ($coinSetting->network_name == $request->network_name)
                    throw new InvalidRequestException(__("You need to set the network name based on the RPC."));

                $pendingWithdrawal = WithdrawHistory::whereNotIn('network', [COIN_PAYMENT, BITCOIN_API, BITGO_API])
                    ->whereIn('status', [WithdrawHistory::PENDING, WithdrawHistory::FAILED])
                    ->where([
                        'coin_type' => $coinSetting->coin_type,
                        'address_type' => ADDRESS_TYPE_EXTERNAL,
                    ])->exists();

                if ($pendingWithdrawal)
                    throw new InvalidRequestException(__("There are pending user withdrawal request, they must be accepted before changing network by rpc."));
            }
        }
        $this->object->updateWhere(['coin_id' => $coinId, 'network' => $network], $data);

        return $this->responseData(true, __('Coin api setting updated successfully'));
    }
    // update coin setting
    public function adjustBitgoWallet($coinId)
    {
        $bitgoApi = new BitgoWalletService();
        $response = responseData(false);
        try {
            $coin = $this->coinService->getCoinDetailsById($coinId);
            if (empty($coin)) {
                return responseData(false, __('Coin not found'));
            }
            $data = $this->object->getCoinSettingData($coin->id, $coin->network);
            if ($data->network == BITGO_API) {
                if (empty($data->bitgo_wallet_id)) {
                    return responseData(false, __('Please add your bitgo wallet id first'));
                }
                $getWallet = $bitgoApi->getBitgoWallet($data->coin_type, $data->bitgo_wallet_id);
                if ($getWallet['success']) {
                    $datas = [
                        'bitgo_deleted_status' => $getWallet['data']['deleted'],
                        'bitgo_approvalsRequired' => $getWallet['data']['approvalsRequired'],
                        'bitgo_wallet_type' => $getWallet['data']['type'],
                        'webhook_status' => 1,
                    ];
                    $this->object->updateWhere(['coin_id' => $coinId], $datas);
                    $response = responseData(true, __('Bitgo wallet adjusted successfully'));
                } else {
                    $response = responseData(false, $getWallet['message']);
                }
            } else {
                $response = responseData(false, __('This coin API is not a bitgo wallet api'));
            }
        } catch (\Exception $e) {
            storeException('updateCoinSetting', $e->getMessage());
            $response = responseData(false);
        }
        return $response;
    }
}
