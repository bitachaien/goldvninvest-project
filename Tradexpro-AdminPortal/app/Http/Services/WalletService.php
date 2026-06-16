<?php

namespace App\Http\Services;

use App\Exceptions\InvalidRequestException;
use App\Http\Repositories\CoinSettingRepository;
use App\User;
use Carbon\Carbon;
use App\Http\Repositories\DashboardRepository;
use App\Model\Coin;
use App\Model\Wallet;
use App\Model\FutureWallet;
use App\Model\WalletNetwork;
use Illuminate\Http\Request;
use App\Model\WithdrawHistory;
use App\Model\DepositeTransaction;
use App\Model\AdminSendCoinHistory;
use App\Model\WalletAddressHistory;
use Illuminate\Support\Facades\Auth;
use App\Model\AdminWalletDeductHistory;
use App\Http\Repositories\WalletRepository;
use App\Http\Resources\WalletResource;
use App\Model\CoinSetting;
use App\Traits\NumberFormatTrait;
use App\Traits\ResponseFormatTrait;
use Exception;
use App\Model\WalletSwapHistory;
use Illuminate\Support\Facades\DB;

class WalletService
{
    use NumberFormatTrait, ResponseFormatTrait;

    public $repository;
    public $bitgoService;

    public function __construct()
    {
        $this->repository = new WalletRepository();
        $this->bitgoService = new BitgoWalletService();
    }

    // user wallet list
    public function userWalletList($userId, $request): array
    {
        $list = isset($request->type) && $request->type == 'usd'
            ? $this->repository->getMyWalletListWithOnOrderWithTotal($userId, $request->per_page, $request->search)
            : $this->repository->getMyWalletListWithOnOrderWithTotalWithoutUSD($userId, $request->per_page, $request->search);

        $data = [
            'currency' => "USD",
            'wallets' => $list['wallets'],
        ];
        return $this->responseData(true, __('Data get'), $data);
    }

    //get user wallet list only
    public function getUserWalletList($userId)
    {
        return $this->repository->getUserWalletList($userId);
    }

    // user wallet deposit address
    public function userWalletDeposit(int $userId, string $coinType): array
    {
        $coin = (new CoinService())
            ->getDocs(['coin_type' => $coinType, 'status' => STATUS_ACTIVE])->first();
        if (empty($coin))
            throw new Exception(__('Coin not found'));

        $coinSetting = CoinSetting::where(['coin_id' => $coin->id, 'network' => $coin->network])->first();
        if (empty($coinSetting))
            throw new Exception(__('Coin settings not found'));

        if (in_array($coin->network, [ERC20_TOKEN, TRC20_TOKEN]) && empty($coinSetting->network_name))
            throw new InvalidRequestException(__('Network name should set form admin'));

        $wallet = $this->repository->walletInfo($userId, $coin);
        if (empty($wallet))
            throw new Exception(__('Wallet not found'));

        if ($coin->is_deposit == STATUS_INACTIVE)
            throw new InvalidRequestException(__('Deposit is disable right now'));

        $walletAddressService = new WalletAddressHistoryService;

        if ($coin->coin_type == COIN_USDT && $coin->network == COIN_PAYMENT)
            $coinPaymentNetworks = $walletAddressService->coinPaymentNetworks($coin->coin_type, $coin->network)['data'];
        else
            $walletAddress = $walletAddressService->getUserWalletAddress($userId, $coin, $wallet->id)['data'];

        $network = [
            'id' => $coin->network,
            'type' => api_settings($coin->network),
            'name' => $coinSetting->network_name
        ];
        $result = [
            'network' => $network,
            'address' => @$walletAddress->address,
            'token_address' => $coinSetting->contract_address,
            'memo' => @$walletAddress->memo,
            'coin_payment_networks' => @$coinPaymentNetworks,
            'rented_till' => $walletAddress['rented_till'] ?? null,
            'current_time' => Carbon::now()
        ];
        return $this->responseData(true, __('Success'), $result);
    }

    // user wallet withdrawal
    public function userWalletWithdrawal(int $userId, string $coinType): array
    {
        $coin = (new CoinService())->getDocs(['coin_type' => $coinType, 'status' => STATUS_ACTIVE])->first();
        if (empty($coin))
            throw new Exception(__('Coin not found'));

        $coinSetting = CoinSetting::where(['coin_id' => $coin->id, 'network' => $coin->network])->first();
        if (empty($coinSetting))
            throw new Exception(__('Coin settings not found'));

        if (in_array($coin->network, [ERC20_TOKEN, TRC20_TOKEN]) && empty($coinSetting->network_name))
            throw new InvalidRequestException(__('Network name should set form admin'));

        $wallet = $this->repository->walletInfo($userId, $coin);
        if (empty($wallet))
            throw new Exception(__('Wallet not found'));

        if ($coin->is_withdrawal == STATUS_INACTIVE)
            throw new InvalidRequestException(__('Withdrawal is currently disable'));

        $wallet->network_name = api_settings($wallet->network);

        if (empty($wallet))
            throw new Exception(__('Wallet not found'));

        if ($coin->coin_type == COIN_USDT && $coin->network == COIN_PAYMENT) {
            $walletAddressService = new WalletAddressHistoryService;
            $coinPaymentNetworks = $walletAddressService->coinPaymentNetworks($coin->coin_type, $coin->network)['data'];
        }
        $network = [
            'id' => $coin->network,
            'type' => api_settings($coin->network),
            'name' => $coinSetting->network_name
        ];
        $result = [
            'wallet' => new WalletResource($wallet),
            'network' => $network,
            'coin_payment_networks' => @$coinPaymentNetworks
        ];
        return $this->responseData(true, __('Wallet found'), $result);
    }

    public function get_wallet_rate($request)
    {
        return $this->repository->get_wallet_rate($request);
    }

    public function coinSwap($from_wallet, $to_wallet, $converted_amount, $requested_amount, $rate)
    {
        return $this->repository->coinSwap($from_wallet, $to_wallet, $converted_amount, $requested_amount, $rate);
    }

    // bitgo wallet deposit
    public function bitgoWalletCoinDeposit($coinType, $walletId, $txId)
    {
        $bitgoService = new BitgoWalletService();
        $checkHash = DepositeTransaction::where(['transaction_id' => $txId])->first();
        if (isset($checkHash))
            throw new InvalidRequestException('Bitgo deposit hash already in db' . $txId);

        $transactionData = $this->getTransaction($coinType, $walletId, $txId)['data'];

        if (!($transactionData['type'] == 'receive' && $transactionData['state'] == 'confirmed'))
            throw new InvalidRequestException(__('Bitgo the transaction type is not receive'));

        $coinVal = $bitgoService->getDepositDivisibilityValues($transactionData['coin']);
        $amount = bcdivx($transactionData['value'], $coinVal, 8);

        $data = [
            'coin_type' => $transactionData['coin'],
            'network' => BITGO_API,
            'txId' => $transactionData['txid'],
            'confirmations' => $transactionData['confirmations'],
            'amount' => $amount
        ];
        foreach ($transactionData['entries'] as $entry) {
            if (isset($entry['wallet']) && ($entry['wallet'] == $transactionData['wallet'])) {
                $data['address'] = $entry['address'];
            }
        }
        if (empty(@$data['address']))
            throw new InvalidRequestException(__('Bitgo: Address not found'));

        return $this->checkAddressAndDeposit($data);
    }

    // get transaction
    public function getTransaction($coinType, $walletId, $txId)
    {
        try {
            $bitgoResponse = $this->bitgoService->transferBitgoData($coinType, $walletId, $txId);

            if ($bitgoResponse['success'] == false)
                throw new InvalidRequestException($bitgoResponse['message']);

            return $this->responseData(true, __('Data get successfully'), $bitgoResponse['data']);
        } catch (\Exception $e) {
            return $this->responseData(false, $e->getMessage());
        }
    }
    // check deposit address
    public function checkAddressAndDeposit($data)
    {
        $checkAddress = WalletAddressHistory::where(['address' => $data['address'], 'coin_type' => $data['coin_type']])->first();
        if (!$checkAddress)
            throw new InvalidRequestException('This address already in db the address is ' . $data['address']);

        $wallet = $this->walletInfo($checkAddress->user_id, $checkAddress->coin_type);
        if (empty($wallet))
            throw new InvalidRequestException(__('Wallet not found'));

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
            'from_address' => @$data['from_address'],
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

    // send coin balance to user
    public function sendCoinBalanceToUser($request)
    {
        try {
            if (isset($request->wallet_id[0])) {
                $wallets = $request->wallet_id;
                $counts = sizeof($request->wallet_id);
                for ($i = 0; $i < $counts; $i++) {
                    $wallet = Wallet::find($wallets[$i]);
                    if (isset($wallet)) {
                        AdminSendCoinHistory::create($this->balanceSendData($wallet, $request->amount, Auth::id()));
                        $wallet->increment('balance', $request->amount);
                    }
                }
                $response = responseData(true, __('Coin sent successful'));
            } else {
                $response = responseData(false, __('Must select at least one wallet'));
            }
        } catch (\Exception $e) {
            storeException('sendCoinBalanceToUser', $e->getMessage());
            $response = responseData(false, __('Something went wrong'));
        }
        return $response;
    }

    // make wallet send history data
    public function balanceSendData($wallet, $amount, $authId)
    {
        return [
            'user_id' => $wallet->user_id,
            'wallet_id' => $wallet->id,
            'amount' => $amount,
            'updated_by' => $authId
        ];
    }

    // generate USDT address
    public function getWalletNetworkAddress($request, $userId)
    {
        $coin = (new CoinService())
            ->getDocs(['coin_type' => $request->coin_type, 'status' => STATUS_ACTIVE])->first();
        if (empty($coin))
            throw new Exception(__('Coin not found'));

        if ($coin->coin_type != 'USDT')
            throw new Exception(__('No need to create address with this coin'));

        $wallet = $this->repository->walletInfo($userId, $coin);
        if (empty($wallet))
            throw new Exception(__('Wallet not found'));

        $networkAddress = WalletNetwork::firstOrCreate(
            [
                'wallet_id' => $wallet->id,
                'network_type' => $request->network_type,
                'status' => WalletNetwork::ACTIVE
            ],
            ['coin_id' => $wallet->coin_id]
        );

        if(isset($networkAddress) && !!$networkAddress->rented_till){
            $now = Carbon::now();
            $valid = Carbon::parse($networkAddress->rented_till);
            if($now->gte($valid)) $networkAddress->address = null;
        }

        if (empty($networkAddress->address)) {
            $address = (new WalletAddressHistoryService)
                ->generateWalletAddress($networkAddress->network_type, $wallet->coin->network)['data'];

            if ($address['address']) {
                $networkAddress->update([
                    'address' => $address['address'],
                    "coin_payment_wallet_id" => $address['wallet_id'] ?? null,
                    'rented_till' => $address['rented_till'] ?? null
                ]);
                // $networkAddress = WalletNetwork::where(['wallet_id' => $wallet->id, 'network_type' => $request->network_type])->first();
            }
        }
        if (empty($networkAddress->address))
            throw new InvalidRequestException(__('Failed to generate address'));

        return $this->responseData(true, __('Address generated successfully'), $networkAddress);
    }

    public function adminSendBalanceDelete($id)
    {
        try {
            $sendCoinHistoryDetails = AdminSendCoinHistory::find($id);

            $depositBalance = DepositeTransaction::where('receiver_wallet_id', $sendCoinHistoryDetails->wallet_id)->get()->sum('amount');
            $userWallet = Wallet::find($sendCoinHistoryDetails->wallet_id);

            $userCurrentBalance = $userWallet->balance - $depositBalance;

            if ($userCurrentBalance > $sendCoinHistoryDetails->amount) {

                $userWallet->decrement('balance', $sendCoinHistoryDetails->amount);
            } else {
                if ($userCurrentBalance > 0) {
                    $userWallet->decrement('balance', $userCurrentBalance);
                }
            }
            $sendCoinHistoryDetails->delete();

            $response = ['success' => true, 'message' => __('Send Coin transaction deleted successfully!')];
            return $response;
        } catch (\Exception $e) {
            storeException('adminSendBalanceDelete', $e->getMessage());
            $response = ['success' => false, 'message' => __('Send Coin transaction is not deleted!')];
        }
        return $response;
    }

    public function deductWalletBalanceSave($request)
    {
        $wallet_details = Wallet::find(decrypt($request->wallet_id));
        if (isset($wallet_details)) {
            $new_balance = $wallet_details->balance - $request->deduct_amount;
            if ($new_balance > 0) {
                $deduct_wallet_balance_history = new AdminWalletDeductHistory();
                $deduct_wallet_balance_history->user_id = $wallet_details->user_id;
                $deduct_wallet_balance_history->wallet_id = $wallet_details->id;
                $deduct_wallet_balance_history->updated_by = auth()->user()->id;
                $deduct_wallet_balance_history->old_balance = $wallet_details->balance;
                $deduct_wallet_balance_history->deduct_amount = $request->deduct_amount;
                $deduct_wallet_balance_history->new_balance = $new_balance;
                $deduct_wallet_balance_history->reason = $request->reason;
                $deduct_wallet_balance_history->save();

                $wallet_details->decrement('balance', $request->deduct_amount);

                $response = ['success' => true, 'message' => __('Deduct Wallet Balance Successfully!')];
            } else {
                $response = ['success' => false, 'message' => __('This wallet has not enough balance to deduct this amount!')];
            }
        } else {
            $response = ['success' => false, 'message' => __('Wallet Not found!')];
        }

        return $response;
    }

    public function getWalletBalanceDetails($request)
    {

        $coin = $request->coin_type ?? "BTC";
        $total = 0;
        $data = [];
        $setting = settings(['p2p_module', 'wallet_overview_selected_coins', 'wallet_overview_banner']);
        $string_coins = $setting["wallet_overview_selected_coins"] ?? "[]";
        $coin_array = json_decode($string_coins);
        $p2p_enable = ($setting['p2p_module'] ?? 0) ? 1 : 0;
        if (!(json_last_error() === JSON_ERROR_NONE))
            $coin_array = [];
        if (!empty($coin_array))
            $coin = $request->coin_type ?? $coin_array[0];
        else {
            if ($coin_data = Coin::first())
                $coin = $coin_data->coin_type;
            else
                $coin = "BTC";
        }

        $spot_wallet = Wallet::where(["user_id" => getUserId(), "coin_type" => $coin])->first();
        $future_wallet = FutureWallet::where(["user_id" => getUserId(), "coin_type" => $coin])->first();
        $p2p_wallet = null;

        if ($p2p_enable && class_exists(\Modules\P2P\Entities\P2PWallet::class))
            $p2p_wallet = \Modules\P2P\Entities\P2PWallet::where(["user_id" => getUserId(), "coin_type" => $coin])->first();

        if ($spot_wallet) {
            $data['spot_wallet'] = $this->trimNum($spot_wallet->balance ?? 0);
            $data['spot_wallet_usd'] = userCurrencyConvert($data['spot_wallet'], $coin);
            $total += $data['spot_wallet'];
        }

        if ($future_wallet) {
            $data['future_wallet'] = $this->trimNum($future_wallet->balance ?? 0);
            $data['future_wallet_usd'] = userCurrencyConvert($data['future_wallet'], $coin);
            $total += $data['future_wallet'];
        }

        if ($p2p_wallet) {
            $data['p2p_wallet'] = $this->trimNum($p2p_wallet->balance ?? 0);
            $data['p2p_wallet_usd'] = userCurrencyConvert($data['p2p_wallet'], $coin);
            $total += $data['p2p_wallet'];
        }
        $data['currency'] = auth()->user()->currency ?? "USD";
        $data['total'] = $this->trimNum($total);
        $data['total_usd'] = userCurrencyConvert($total, $coin);
        $data['coins'] = $coin_array;
        $data['selected_coin'] = $coin;
        $data['banner'] = isset($setting['wallet_overview_banner']) ? asset(IMG_PATH . $setting['wallet_overview_banner']) : null;

        $data['withdraw'] = WithdrawHistory::where(['user_id' => getUserId(), "coin_type" => $coin, 'status' => STATUS_ACCEPTED])->latest()->limit(2)->get(["coin_type", "amount", "status", "created_at"]);
        if ($wallet = Wallet::where(['user_id' => getUserId(), "coin_type" => $coin])->first()) {
            $data['deposit'] = DepositeTransaction::where(['receiver_wallet_id' => $wallet->id, "coin_type" => $coin, 'status' => STATUS_ACCEPTED])->latest()->limit(2)->get(["coin_type", "amount", "status", "created_at"]);
        }

        return responseData(true, __("Wallet overview get successfully"), $data);
    }

    public function userWalletTotalValue(int $user_id)
    {
        $total = 0;
        $dashboardRepo = new DashboardRepository();
        $wallets = Wallet::join('coins', 'coins.id', '=', 'wallets.coin_id')
            ->where([
                'wallets.user_id' => $user_id,
                'wallets.type' => PERSONAL_WALLET,
                'coins.status' => STATUS_ACTIVE
            ])
            ->select("wallets.coin_id", "wallets.balance", "wallets.coin_type", "wallets.user_id", "wallets.type", "coins.status")
            ->get();

        if (isset($wallets[0])) {
            $wallets->map(function ($wallet) use ($dashboardRepo, &$total, $user_id) {
                $wallet->on_order = $dashboardRepo->getOnOrderBalance($wallet->coin_id, $user_id);
                $wallet->available_balance = $wallet->balance;
                $wallet->total = bcaddx($wallet->on_order, $wallet->available_balance, 8);

                $wallet->total_balance_usd = get_coin_usd_value($wallet->total, $wallet->coin_type);
                $total = $total + $wallet->total_balance_usd;
            });
        }
        $total = $this->trimNum((is_numeric($total) && ($total > 0)) ? $total : 0);

        $result = [
            'total' => truncate_num($total, 4),
            'currency' => strtoupper(getUserCurrency())
        ];

        return $this->responseData(true, __("Total balance value found"), $result);
    }

    public function walletInfo(int $userID, Coin|int|string $coin)
    {
        return $this->repository->walletInfo($userID, $coin);
    }

    public function bulkWalletGenerate($id, $type)
    {
        if ($type == WALLET_GENERATE_BY_COIN) {
            $coin = Coin::find($id);
            $users = User::where(['status' => STATUS_ACTIVE, 'super_admin' => STATUS_INACTIVE])->get();

            foreach ($users as $user) {
                DB::beginTransaction();
                try {
                    $this->walletInfo($user->id, $coin);
                    DB::commit();
                } catch (\Exception $e) {
                    storeLog(processExceptionMsg($e));
                    DB::rollBack();
                }
            }
        } else if ($type == WALLET_GENERATE_BY_USER) {
            $user = User::find($id);
            $coins = Coin::where('status', STATUS_ACTIVE)->get();

            foreach ($coins as $coin) {
                DB::beginTransaction();
                try {
                    $this->walletInfo($user->id, $coin);
                    DB::commit();
                } catch (\Exception $e) {
                    storeLog(processExceptionMsg($e));
                    DB::rollBack();
                }
            }
        }
        return $this->responseData(true, __('Wallet generated successfully'));
    }

    public function checkWalletAddress(Request $request)
    {
        if (empty($request->coin_type))
            throw new InvalidRequestException(__('Coin type is missing!'));

        if (empty($request->network))
            throw new InvalidRequestException(__('Network is missing!'));

        if (empty($request->wallet_key))
            throw new InvalidRequestException(__('Wallet key is missing!'));

        $coin = (new CoinSettingRepository())->getCoinSettingData($request->coin_type, $request->network);

        if (empty($coin))
            throw new InvalidRequestException(__('Invalid Request'));

        $api = new ERC20TokenApi($coin);
        $requestData = ['contracts' => $request->wallet_key];
        $result = $api->getAddressFromPK($requestData);

        if ($result['success'] == false)
            throw new InvalidRequestException($result['message']);

        return $this->responseData(true, __('Your wallet address is :address', ['address' => $result['data']->address]));
        return responseData(true, __('Wallet generated successfully'));
    }

    public function walletHistoryApp(Request $request, int $userId): array
    {
        $limit = $request->per_page ?? 5;
        $order_data = [
            'column_name' => $request->column_name ?? 'created_at',
            'order_by' => $request->order_by ?? 'DESC',
        ];
        $data = [];

        if (!in_array($request->type, ['deposit', 'withdraw'])) {
            throw new InvalidRequestException(__('Invalid request'));
        }
        $data['type'] = $request->type;
        $data['sub_menu'] = $request->type;

        $processObj = [
            'deposit' => [
                'title' => __('Deposit History'),
                'method' => 'depositTransactionHistories',
                'progress_status_setting' => 'progress_status_for_deposit',
                'progress_status_type' => PROGRESS_STATUS_TYPE_DEPOSIT,
            ],
            'withdraw' => [
                'title' => __('Withdrawal History'),
                'method' => 'withdrawTransactionHistories',
                'progress_status_setting' => 'progress_status_for_withdrawal',
                'progress_status_type' => PROGRESS_STATUS_TYPE_WITHDRAWN,
            ],
        ];

        $processData = $processObj[$request->type];

        $data['title'] = $processData['title'];

        $transService = new TransService();
        $data['histories'] = $transService->{$processData['method']}($userId, $request->status, $request->search, $order_data)->paginate($limit);

        $data['progress_status_for_deposit'] = allsetting('progress_status_for_deposit');
        $data['progress_status_for_withdrawal'] = allsetting('progress_status_for_withdrawal');

        if (allsetting($processData['progress_status_setting'])) {
            $progressService = new ProgressStatusService();
            $data['progress_status_list'] = $progressService->getProgressStatusActiveListBytype($processData['progress_status_type'])['data'];
        }
        $data['status'] = deposit_status();

        return responseData(true, $data['title'], $data);
    }

    public function coinSwapHistoryApp(Request $request)
    {
        $limit = $request->per_page ?? 5;
        $order_data = [
            'column_name' => $request->column_name ?? 'created_at',
            'order_by' => $request->order_by ?? 'DESC',
        ];
        $data['title'] = __('Coin swap history');
        $data['sub_menu'] = 'swap_history';
        $data['list'] = WalletSwapHistory::where(['user_id' => auth()->id()])
            ->when(isset($request->search), function ($query) use ($request) {
                $query->where('requested_amount', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('converted_amount', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('from_coin_type', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('to_coin_type', 'LIKE', '%' . $request->search . '%');
            })
            ->orderBy($order_data['column_name'], $order_data['order_by'])
            ->paginate($limit);

        foreach ($data['list'] as &$item) {
            $item->fromWallet = $item->fromWallet->name;
            $item->toWallet = $item->toWallet->name;
        }
        return responseData(true, $data['title'], $data);
    }
}
