<?php

namespace App\Http\Controllers\Api;

use App\User;
use Exception;
use Carbon\Carbon;
use Pusher\Pusher;
use App\Model\Coin;
use App\Model\Wallet;
use Pusher\PusherException;
use App\Model\WalletNetwork;
use Illuminate\Http\Request;
use App\Http\Services\Logger;
use App\Model\BuyCoinHistory;
use App\Model\DepositeTransaction;
use Illuminate\Support\Facades\DB;
use App\Model\WalletAddressHistory;
use App\Http\Controllers\Controller;
use App\Http\Services\WalletService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use JMS\Serializer\SerializerBuilder;
use App\Http\Services\BitCoinApiService;
use App\Exceptions\InvalidRequestException;
use App\Services\CoinPaymentServices\Enums\TransactionType;
use App\Services\CoinPaymentServices\Enums\TransactionStatus;
use App\Services\CoinPaymentServices\Responses\NotifierResponse\CoinPaymentWebhookResponse;

class WalletNotifier extends Controller
{

    private $service;
    function __construct()
    {
        $this->service = new WalletService();
    }
    // Wallet notifier for checking and confirming order process
    public function coinPaymentNotifier(Request $request)
    {
        $raw_request = $request->all();
        storeException('coinPaymentNotifier request', json_encode($raw_request));
        $merchant_id = settings('ipn_merchant_id');
        $secret = settings('ipn_secret');

        if (env('APP_ENV') != "local") {
            if (!isset($_SERVER['HTTP_HMAC']) || empty($_SERVER['HTTP_HMAC'])) {
                storeException('coinPaymentNotifier', 'No HMAC signature sent');

                die("No HMAC signature sent");
            }

            $merchant = isset($_POST['merchant']) ? $_POST['merchant'] : '';
            if (empty($merchant)) {
                storeException('coinPaymentNotifier', 'No Merchant ID passed');

                die("No Merchant ID passed");
            }

            if ($merchant != $merchant_id) {
                storeException('coinPaymentNotifier', 'Invalid Merchant ID');

                die("Invalid Merchant ID");
            }

            $request = file_get_contents('php://input');
            if ($request === FALSE || empty($request)) {
                storeException('coinPaymentNotifier', 'Error reading POST data');

                die("Error reading POST data");
            }

            $hmac = hash_hmac("sha512", $request, $secret);

            if ($hmac != $_SERVER['HTTP_HMAC']) {
                storeException('coinPaymentNotifier', 'HMAC signature does not match');

                die("HMAC signature does not match");
            }
        }

        return $this->depositeWallet($raw_request);
    }
    public function coinPaymentV2Notifier(Request $request)
    {
        $raw_request = $request->all();
        $responseAsJson = json_encode($raw_request);
        storeException('coinPaymentV2Notifier request',$responseAsJson);

        $serializer = SerializerBuilder::create()->build();
        /** @var \App\Services\CoinPaymentServices\Responses\NotifierResponse\CoinPaymentWebhookResponse $response */
        $response = $serializer->deserialize($responseAsJson, CoinPaymentWebhookResponse::class, 'json');

        if(!TransactionType::isReceivedDeposit($response->transactionType)){
            storeException('coinPaymentV2Notifier request',"Transaction Type Invalid");
            return failed(__("Transaction Type Invalid"));
        }

        if(!TransactionStatus::isComplete($response)){
            storeException('coinPaymentV2Notifier request',"Transaction Status Invalid");
            return failed(__("Transaction Status Invalid"));
        }

        return $this->depositeWallet([
            "address" => $response->address,
            "currency"=> $response->symbol,
            "txn_id"  => $response->txHash ?? $response->spendRequestId,
            "amount"  => $response->amount,
            "confirms"=> $response->confirmations,

            "ipn_type" => 'deposit',
            'status'   => 200
        ]);
    }

    public function depositeWallet($request)
    {
        return $this->handlerGeneralResponse(function () use ($request) {
            $request = (object)$request;

            if (isset($request->dest_tag) && !empty($request->dest_tag))
                $walletAddress = WalletAddressHistory::where(['address' => $request->address, 'memo' => $request->dest_tag])->with('wallet')->first();
            else
                $walletAddress = WalletAddressHistory::where(['address' => $request->address])->with('wallet')->first();

            if (isset($walletAddress)) {
                if (($request->ipn_type == "deposit") && ($request->status >= 100)) {
                    $wallet =  $walletAddress->wallet;
                    $coin_type = strtok($request->currency, ".");
                    $data['user_id'] = $wallet->user_id;

                    if (empty($wallet))
                        throw new Exception(__("Wallet not found"));

                    if ($wallet->coin_type != $coin_type && $wallet->coin_type != $request->currency)
                        throw new Exception(__('Coin type not matched'));

                    $checkDeposit = DepositeTransaction::where('transaction_id', $request->txn_id)->first();
                    if (isset($checkDeposit))
                        throw new Exception(__('Transaction id already exists in deposit'));

                    $depositData = [
                        'address' => $request->address,
                        'address_type' => ADDRESS_TYPE_EXTERNAL,
                        'amount' => $request->amount,
                        'fees' => 0,
                        'coin_type' => $walletAddress->coin_type,
                        'network' => COIN_PAYMENT,
                        'transaction_id' => $request->txn_id,
                        'confirmations' => $request->confirms,
                        'status' => DepositeTransaction::SUCCESS,
                        'receiver_wallet_id' => $wallet->id
                    ];

                    DB::beginTransaction();
                    try {
                        $depositCreate = DepositeTransaction::create($depositData);
                        $wallet->increment('balance', $depositCreate->amount);

                        DB::commit();
                    } catch (Exception $e) {
                        DB::rollBack();
                        throw new Exception($e->getMessage());
                    }
                }
            } else {
                $checkNetworkAddress = WalletNetwork::where(['address' => $request->address])->first();
                if (empty($checkNetworkAddress))
                    throw new Exception(__("Wallet address not found"));

                if (($request->ipn_type == "deposit") && ($request->status >= 100)) {
                    $wallet =  Wallet::find($checkNetworkAddress->wallet_id);
                    $data['user_id'] = $wallet->user_id;
                    $coin_type = strtok($request->currency, ".");

                    if (empty($wallet))
                        throw new Exception(__("Wallet not found"));

                    if ($wallet->coin_type != $coin_type && $wallet->coin_type != $request->currency)
                        throw new Exception(__("Coin type not matched"));

                    $checkDeposit = DepositeTransaction::where('transaction_id', $request->txn_id)->first();
                    if (isset($checkDeposit))
                        throw new Exception(__("Transaction id already exists in deposit"));

                    $depositData = [
                        'address' => $request->address,
                        'address_type' => ADDRESS_TYPE_EXTERNAL,
                        'amount' => $request->amount,
                        'fees' => 0,
                        'coin_type' => $wallet->coin_type,
                        'network' => COIN_PAYMENT,
                        'transaction_id' => $request->txn_id,
                        'confirmations' => $request->confirms,
                        'status' => STATUS_SUCCESS,
                        'receiver_wallet_id' => $wallet->id,
                        'network_type' => $checkNetworkAddress->network_type
                    ];

                    DB::beginTransaction();
                    try {
                        $depositCreate = DepositeTransaction::create($depositData);
                        $wallet->increment('balance', $depositCreate->amount);

                        DB::commit();
                    } catch (Exception $e) {
                        DB::rollBack();
                        throw new Exception($e->getMessage());
                    }
                }
            }

            return $this->responseData(true, __('Wallet deposited successfully'));
        });
    }

    // wallet notifier for personal node

    public function walletNotify(Request $request)
    {
        storeException('walletNotify called', date('Y-m-d H:i:s'));
        storeException('walletNotify request', $request);
        return response()->json([
            'message' => __('Notified successful.'),
        ]);
        try {
            storeException('walletNotify', json_encode($request->all()));
            $coinType = strtoupper($request->coin_type);

            $transactionId = $request->transaction_id;
            // storeException('walletNotify','transactionId : '. $transactionId);
            $coin = Coin::join('coin_settings', 'coin_settings.coin_id', '=', 'coins.id')
                ->where(['coins.coin_type' => $coinType])
                ->select('coins.*', 'coin_settings.*')
                ->first();
            $coinservice =  new BitCoinApiService($coin->coin_api_user, decryptId($coin->coin_api_pass), $coin->coin_api_host, $coin->coin_api_port);
            $transaction = $coinservice->getTranscation($transactionId);
            storeException('walletNotify $transaction', json_encode($transaction));
            return response()->json([
                'message' => __('Notified successful.'),
            ]);

            // next process done by wallet confirm process
            if ($transaction) {
                $details = $transaction['details'];
                storeException('walletNotify $transaction details', json_encode($details));
                foreach ($details as $data) {
                    storeException('walletNotify data', json_encode($data));
                    if ($data['category'] = 'receive') {
                        $address[] = $data['address'];
                        $amount[] = $data['amount'];
                    }
                }
                if (empty($address) || empty($amount)) {
                    storeException('walletNotify', 'transaction : This is a withdraw transaction hash ');
                    return response()->json(['message' => __('This is a withdraw transaction hash')]);
                }
                DB::beginTransaction();
                try {
                    $wallets = WalletAddressHistory::whereIn('address', $address)->get();

                    if ($wallets->isEmpty()) {
                        storeException('walletNotify', 'transaction address : Notify Unsuccessful. Address not found ');
                        return response()->json(['message' => __('Notify Unsuccessful. Address not found!')]);
                    }
                    if (!$wallets->isEmpty()) {
                        foreach ($wallets as $wallet) {
                            foreach ($address as $key => $val) {
                                if ($wallet->address == $val) {
                                    $currentAmount = $amount[$key];
                                }
                            }
                            $inserts[] = [
                                'address' => $wallet->address,
                                'receiver_wallet_id' => $wallet->wallet_id,
                                'address_type' => 1,
                                'amount' => $currentAmount,
                                'coin_type' => $coinType,
                                //                            'type' => 'receive',
                                'status' => STATUS_PENDING,
                                'transaction_id' => $transactionId,
                                'confirmations' => $transaction['confirmations'],
                                'created_at' => Carbon::now(),
                                'updated_at' => Carbon::now()
                            ];
                        }
                    }

                    $response = [];
                    if (!empty($inserts)) {
                        foreach ($inserts as $insert) {
                            $has_transaction = DepositeTransaction::where(['transaction_id' => $insert['transaction_id'], 'address' => $insert['address']])->count();
                            if (!$has_transaction) {
                                try {
                                    $deposit = DepositeTransaction::insert($insert);
                                    storeException('bitcoin deposit', json_encode($deposit));
                                } catch (\Exception $e) {
                                    return response()->json([
                                        'message' => __('Transaction Hash is already in DB .' . $e->getMessage()),
                                    ]);
                                }
                                $response[] = [
                                    'transaction_id' => $insert['transaction_id'],
                                    'address' => $insert['address'],
                                    'success' => true
                                ];
                            } else {
                                $response[] = [
                                    'transaction_id' => $insert['transaction_id'],
                                    'address' => $insert['address'],
                                    'success' => false
                                ];
                            }
                        }
                    }
                    storeException('walletNotify notyfy-', json_encode($response));
                    DB::commit();
                } catch (\Exception $e) {
                    DB::rollback();
                    $response[] = [
                        'transaction_id' => '',
                        'address' => '',
                        'success' => false
                    ];
                }

                if (empty($response)) {
                    return response()->json([
                        'message' => __('Notified Unsuccessful.'),
                    ]);
                }

                return response()->json([
                    'response' => $response,
                ]);
            }
        } catch (\Exception $e) {
            storeException('walletNotify ex', $e->getMessage());
        }

        return response()->json(['message' => __('Not a valid transaction.')]);
    }

    public function notifyConfirm(Request $request)
    {
        storeException('notifyConfirm', 'notify confirmed called');
        $response = responseData(true, 'Transactions processed successfully');
        DB::beginTransaction();
        try {
            storeException('notifyConfirm', json_encode($request->all()));
            // $number_of_confirmation = settings('number_of_confirmation');
            $number_of_confirmation = 0;
            // $transactions = $request->transactions['transactions'];
            $coinType = $request->coin_type;
            $transactions = $request->transactions;


            if (!empty($transactions)) {
                foreach ($transactions as $transaction) {
                    if ($transaction['category'] == 'receive') {
                        $is_confirmed = false;
                        $transactionId = $transaction['txid'];
                        $address = $transaction['address'];
                        $amount = $transaction['amount'];
                        $confirmation = $transaction['confirmations'];
                        $pendingTransaction = DepositeTransaction::where(['transaction_id' => $transactionId, 'address' => $address])->first();
                        if (empty($pendingTransaction)) {
                            $checkAddress = WalletAddressHistory::where(['address' => $address, 'coin_type' => $coinType])->first();
                            if ($checkAddress) {
                                storeException('notifyConfirm', $confirmation);
                                if ($confirmation >= $number_of_confirmation) {

                                    try {
                                        $insert = [
                                            'address' => $address,
                                            'receiver_wallet_id' => $checkAddress->wallet_id,
                                            'address_type' => 1,
                                            'amount' => $amount,
                                            'coin_type' => $coinType,
                                            'status' => STATUS_SUCCESS,
                                            'transaction_id' => $transactionId,
                                            'confirmations' => $transaction['confirmations'],
                                            'created_at' => Carbon::now(),
                                            'updated_at' => Carbon::now()
                                        ];
                                        $deposit = DepositeTransaction::create($insert);
                                        storeException('deposit ', json_encode($deposit));
                                        $amount = $deposit->amount;
                                        storeException('notifyConfirm', 'Received Amount: ' . $amount);
                                        storeException('notifyConfirm', 'Balance Before Update: ' . $deposit->receiverWallet->balance);
                                        $deposit->receiverWallet->increment('balance', $amount);
                                        storeException('notifyConfirm', 'Balance After Update: ' . $deposit->receiverWallet->balance);
                                        $response[] = [
                                            'txid' => $transactionId,
                                            'is_confirmed' => true,
                                            'message' => __('success')
                                        ];
                                    } catch (\Exception $e) {
                                        DB::rollback();
                                        $logText = [
                                            'walletID' => $deposit->receiverWallet->id,
                                            'transactionID' => $transactionId,
                                            'amount' => $amount,
                                        ];

                                        storeException('notifyConfirm ex: ', $logText);
                                        storeException('notifyConfirm ex: ', processExceptionMsg($e));
                                    }
                                    //
                                }
                            }
                        }
                    }
                }
            } else {
                storeException('notifyConfirm', 'No Transaction Found');
                $response[] = responseData(false, 'No Transaction Found');
            }
        } catch (\Exception $e) {
            DB::rollback();
            storeException('notifier confirm ex', $e->getMessage());
            return response()->json(responseData(false, processExceptionMsg($e)));
        }
        DB::commit();
        return response()->json($response);
    }


    /**
     * For broadcast data
     * @param $data
     */
    public function broadCast($data)
    {
        $channelName = 'depositConfirmation.' . customEncrypt($data['userId']);
        $fields = json_encode([
            'channel_name' => $channelName,
            'event_name' => 'confirm',
            'broadcast_data' => $data['broadcastData'],
        ]);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://' . env('BROADCAST_HOST') . '/api/broadcast',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $fields,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json",
                'broadcast-secret: an9$md_eoUqmNpa@bm34Jd'
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);
    }

    // bitgo wallet webhook
    public function bitgoWalletWebhook(Request $request)
    {
        $this->handlerApiResponse(function () use ($request) {
            if (empty($request->hash))
                throw new InvalidRequestException('Bitgo: Hash is empty');

            $txId = $request->hash;
            $type = $request->type;
            $coinType = $request->coin;
            // $state = $request->state;
            $walletId = $request->wallet;

            if (!in_array($type, ['transfer', 'transaction'])) {
                throw new InvalidRequestException('Bitgo: Invalid type');
            }

            $existingTransaction = DepositeTransaction::where([
                'transaction_id' => $txId,
                'coin_type' => $coinType
            ])->first();

            if (empty($existingTransaction)) {
                $this->service->bitgoWalletCoinDeposit($coinType, $walletId, $txId);
            }
            return $this->responseData(true, 'Transaction processed successfully');
        });
    }
}
