<?php

namespace App\Http\Services;

use Exception;
use App\Model\Coin;
use App\Model\Wallet;
use App\Jobs\TransactionDeposit;
use App\Model\DepositeTransaction;
use Illuminate\Support\Facades\DB;
use App\Model\WalletAddressHistory;
use App\Exceptions\InvalidRequestException;
use App\Http\Repositories\CoinSettingRepository;
use App\Http\Resources\CoinResource;
use App\Http\Resources\DepositeTransactionResource;
use App\Http\Resources\DepositTransactionResource;
use App\Model\CoinSetting;
use App\Traits\NumberFormatTrait;
use App\Traits\ResponseFormatTrait;

use function PHPUnit\Framework\isEmpty;

class TransactionDepositService
{
    use ResponseFormatTrait, NumberFormatTrait;

    public function __construct() {}

    public function getNetworks(): array
    {
        $responseData = [];
        $networks = function_exists('selected_node_network') ? selected_node_network() : [];
        foreach ($networks as $key => $value) {
            $responseData[] = [
                "id" => $key,
                "name" => $value,
            ];
        }
        return $this->responseData(true, __("Networks get successfully"), $responseData);
    }

    public function getCoinNetwork($request): array
    {
        if (!isset($request->network_id))
            return responseData(false, __("No network found"));
        if (!is_numeric($request->network_id))
            return responseData(false, __("Network is invalid"));

        $coins = Coin::where("network", $request->network_id)->get(["id", "name", "coin_type", "network as network_id"]);
        return $this->responseData(true, __("Network coins get successfully"), $coins);
    }

    public function checkCoinTransactionAndDeposit($request, bool $isAdmin = false): array
    {
        $coin = (new CoinSettingRepository(CoinSetting::class))
            ->getCoinSettingData($request->coin_id, $request->network_id);

        if (empty($coin))
            throw new Exception(__("Coin not found"));

        $deposit = DepositeTransaction::where("transaction_id", $request->trx_id)->first();
        if ($deposit)
            return $this->responseData(true, __("This transaction already deposited in our system"), new DepositTransactionResource($deposit));

        $erc20Api = new ERC20TokenApi($coin);
        $getTransaction = $erc20Api->getTransactionData([
            'transaction_hash' => $request->trx_id,
            'contract_address' => $coin->contract_address
        ]);
        if ($getTransaction["success"] == false)
            throw new InvalidRequestException($getTransaction["message"]);

        $transactionData = (array) $getTransaction['data'];

        // This check only for TRC20_TOKEN, ERC20_TOKEN already checked from node end
        if (isset($transactionData['contract_address']) && $coin->contract_address != @$transactionData['contract_address'])
            throw new InvalidRequestException('Contract address mismatch detected. Please select the correct coin.');

        $data = [
            'coin_id' => $coin->coin_id, //for admin check deposit
            'coin_type' => $coin->coin_type,
            'network_id' => $coin->network, //for admin check deposit
            'network' => $coin->network,
            'txId' => $transactionData['txID'],
            'confirmations' => DepositeTransaction::SUCCESS,
            'amount' => $this->truncateNum($transactionData['amount']),
            'address' => $transactionData['toAddress'],
            'from_address' => $transactionData['fromAddress']
        ];
        if ($isAdmin)
            return $this->responseData(true, __("Transaction details found"), $data);

        return $this->transactionAndDepositProcess($data);
    }

    public function transactionAndDepositProcess($data)
    {
        $responseData = $data;
        $responseData["network_name"] = (new CoinSettingRepository())->getNetworkName($data['coin_id'], $data['network']);

        $checkAddress = WalletAddressHistory::where(['address' => $data['address'], 'coin_type' => $data['coin_type']])->first();
        if (empty($checkAddress))
            return responseData(true, __("Transaction details found but To address not match in system"), $responseData);

        $wallet = Wallet::find($checkAddress->wallet_id);
        if (empty($wallet))
            return responseData(true, __("This transaction already deposited in our system"), $responseData);

        TransactionDeposit::dispatch($data)->onQueue("deposit");
        return $this->responseData(true, __("Transaction details found, System will adjust deposit soon"), $responseData);
    }

    public function checkAddressAndDeposit($data)
    {
        $deposit = DepositeTransaction::where("transaction_id", $data['txId'])->first();
        if ($deposit)
            throw new Exception(__('Transaction already exist'));

        $checkAddress = WalletAddressHistory::where(['address' => $data['address'], 'coin_type' => $data['coin_type']])->first();
        if (empty($checkAddress))
            throw new Exception('This address not found in db the address is ' . $data['address']);

        $wallet = Wallet::find($checkAddress->wallet_id);
        if (empty($wallet))
            throw new Exception(__('wallet not found'));

        DB::beginTransaction();
        try {
            DepositeTransaction::create($this->depositData($data, $wallet));
            $wallet->increment('balance', $data['amount']);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception($e->getMessage());
        }
        return $this->responseData(true, __('Wallet deposited successfully'));
    }
    // deposit data
    public function depositData($data, $wallet)
    {
        return [
            'address' => $data['address'],
            'from_address' => $data['from_address'],
            'receiver_wallet_id' => $wallet->id,
            'address_type' => ADDRESS_TYPE_EXTERNAL,
            'coin_type' => $wallet->coin_type,
            'network' => $data['network'],
            'network_type' => @$data['network_type'],
            'amount' => $data['amount'],
            'transaction_id' => $data['txId'],
            'status' => STATUS_SUCCESS,
            'confirmations' => $data['confirmations']
        ];
    }
}
