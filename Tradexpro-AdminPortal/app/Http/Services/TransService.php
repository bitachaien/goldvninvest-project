<?php

namespace App\Http\Services;

use App\User;
use Exception;
use Carbon\Carbon;
use App\Model\Coin;
use App\Model\Wallet;
use App\Jobs\MailSend;
use App\Jobs\Withdrawal;
use App\Model\CoinSetting;
use App\Model\TempWithdraw;
use App\Model\WalletCoUser;
use Illuminate\Support\Str;
use App\Model\WalletNetwork;
use App\Model\WithdrawHistory;
use PragmaRX\Google2FA\Google2FA;
use App\Traits\NumberFormatTrait;
use App\Jobs\WithdrawalProcessJob;
use App\Model\DepositeTransaction;
use Illuminate\Support\Facades\DB;
use App\Model\WalletAddressHistory;
use Illuminate\Support\Facades\Log;
use App\Traits\ResponseFormatTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use function PHPUnit\Framework\isNull;
use App\Enums\CoinPaymentActiveVersion;
use App\Model\CoWalletWithdrawApproval;
use App\Http\Repositories\WalletRepository;
use App\Exceptions\InvalidRequestException;
use App\Http\Repositories\AffiliateRepository;
use App\Jobs\DistributeWithdrawalReferralBonus;
use App\Http\Repositories\CoinSettingRepository;
use Azimo\Apple\Api\Exception\InvalidResponseException;

class TransService
{
    use ResponseFormatTrait, NumberFormatTrait;

    protected $logger;

    public function __construct()
    {
        $this->logger = new Logger();
    }

    private function generate_email_verification_key()
    {
        do {
            $key = Str::random(60);
        } while (User::where('email_verified', $key)->count() > 0);

        return $key;
    }

    // make withdrawal data
    private function makeWithdrawalData(array $data, string $trans_id)
    {
        return [
            'wallet_id' => $data['wallet']->id,
            'address' => $data['address'],
            'amount' => $data['amount'],
            'address_type' => $data['addressType'],
            'fees' => $data['fees'],
            'coin_type' => $data['coin']->coin_type,
            'transaction_hash' => $trans_id,
            'confirmations' => 0,
            'status' => WithdrawHistory::INITIAL,
            'message' => $data['note'],
            'receiver_wallet_id' => @$data['receiverWallet']->id,
            'user_id' => $data['user']->id,
            'network' => $data['coin']->network,
            'network_type' => $data['network_type'],
            'memo' => $data['memo']
        ];
    }
    // withdrawal process from job
    public function startWithdrawalProcess($data): array
    {
        $user = $data['user'];
        $coin = $data['coin'];
        $wallet = $data['wallet'];

        $validateData = $this->checkWithdrawalValidation($data['address'], $data['amount'], $user, $coin, $wallet, $data['memo'])['data'];
        $data = array_merge($data, $validateData);

        $trans_id = Str::random(32); // we make this same for deposit and withdrawal

        $sendAmount = bcaddx($data['amount'], $data['fees'], 8);

        DB::beginTransaction();
        try {
            $wallet->decrement('balance', $sendAmount);

            $transaction = WithdrawHistory::create($this->makeWithdrawalData($data, $trans_id));

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            storeLog(processExceptionMsg($e), 'error');
            throw new Exception($e->getMessage());
        }
        return match ($validateData['addressType']) {
            ADDRESS_TYPE_INTERNAL => $this->processInternalWithdrawal($transaction, $trans_id, $data),
            ADDRESS_TYPE_EXTERNAL => $this->processExternalWithdrawal($transaction, $coin, $data['amount']),
            default => $this->processExternalWithdrawal($transaction, $coin, $data['amount']),
        };
    }

    public function processInternalWithdrawal(WithdrawHistory $transaction, string $trans_id, array $data): array
    {
        DB::beginTransaction();
        try {
            $receive_tr =  DepositeTransaction::create($this->makeDepositData($data, $trans_id));

            $transaction->update(['status' => WithdrawHistory::SUCCESS]);

            $receive_tr->update(['status' => DepositeTransaction::SUCCESS]);

            $data['receiverWallet']->increment('balance', $data['amount']);

            DB::commit();

            return responseData(true, __('Internal withdrawal process success'));
        } catch (Exception $e) {
            DB::rollBack();

            $transaction->update([
                'status' => WithdrawHistory::FAILED,
                'reject_note' => $e->getMessage(),
            ]);
            storeLog(processExceptionMsg($e), 'error');
            throw new Exception($e->getMessage());
        }
    }

    public function processExternalWithdrawal(WithdrawHistory $transaction, Coin $coin, float $amount)
    {
        if (checkCryptoAdminApproval($amount, $coin->id) || defined("IS_PUBLIC_API")) {
            // If the need admin approval, the transaction status is set to PENDING
            $transaction->update(['status' => WithdrawHistory::PENDING]);
            return responseData(true, __('External withdrawal process goes to admin approval'));
        }
        $transaction->update(['status' => WithdrawHistory::PROCESSING]);

        return $this->acceptPendingExternalWithdrawal($transaction);
    }


    //make deposit data
    public function makeDepositData(array $data, string $trans_id)
    {
        return [
            'address' => $data['address'],
            'address_type' => $data['addressType'],
            'amount' => $data['amount'],
            'fees' => $data['fees'],
            'coin_type' => $data['coin']->coin_type,
            'transaction_id' => $trans_id,
            'confirmations' => 0,
            'status' => DepositeTransaction::SUCCESS,
            'sender_wallet_id' => $data['wallet']->id,
            'receiver_wallet_id' => @$data['receiverWallet']->id,
            'network_type' => $data['network_type'],
            'network' => $data['coin']->network,
        ];
    }
    // check internal address
    private function isInternalAddress($address, $memo = null)
    {
        $checkAddressQuery = WalletAddressHistory::where('address', $address)->with('wallet');
        if ($memo) $checkAddressQuery->where('memo', $memo);
        $checkAddress = $checkAddressQuery->first();
        if ($checkAddress) {
            return $checkAddress;
        } else {
            return WalletNetwork::where('address', $address)->with('wallet')->first();
        }
    }

    // cancel transaction
    private function _cancelTransaction($user, $wallet, $address, $amount, $pendingTransaction)
    {
        if (!empty($pendingTransaction)) {
            $pendingTransaction->status = STATUS_REJECTED;
            $pendingTransaction->update();
        }
        //  $mailService = app(MailService::class);
        $userName = $user->first_name . ' ' . $user->last_name;
        $userEmail = $user->email;
        $companyName = settings("company_name") ?? __('Company Name');
        $subject = __(':emailSubject | :companyName', ['emailSubject' => __('Send coin failure'), 'companyName' => $companyName]);
        $data['user'] = $user;
        $data['amount'] = $amount;
        $data['address'] = $address;
        $data['wallet'] = $wallet;
        //  $mailService->send('email.send_coin_failure', $data, $userEmail, $userName, $subject);
    }





    private function calculate_fees($amount)
    {
        return $amount;
    }


    private function sendTransactionMail($sender_user, $mailTemplet, $receiver_user, $amount, $emailSubject)
    {
        $mailService = app(MailService::class);
        $userName = $sender_user->first_name . ' ' . $sender_user->last_name;
        $userEmail = $sender_user->email;
        $companyName = settings("company_name") ?? __('Company Name');
        $subject = __(':emailSubject | :companyName', ['emailSubject' => $emailSubject, 'companyName' => $companyName]);
        $data['data'] = $sender_user;
        $data['anotherUser'] = $receiver_user;
        $data['amount'] = $amount;
        $mailService->send($mailTemplet, $data, $userEmail, $userName, $subject);
    }

    private function sendExternalTransactionMail($sender_user, $mailTemplet, $address, $amount, $emailSubject)
    {
        $mailService = app(MailService::class);
        $userName = $sender_user->first_name . ' ' . $sender_user->last_name;
        $userEmail = $sender_user->email;
        $companyName = settings("company_name") ?? __('Company Name');
        $subject = __(':emailSubject | :companyName', ['emailSubject' => $emailSubject, 'companyName' => $companyName]);
        $data['data'] = $sender_user;
        $data['address'] = $address;
        $data['amount'] = $amount;
        $mailService->send($mailTemplet, $data, $userEmail, $userName, $subject);
    }

    private function sendVerificationSms($phone, $randno)
    {
        $smsText = 'Your ' . allsetting()['app_title'] . ' verification code is here ' . $randno;
        app(SmsService::class)->send($phone, $smsText);
    }

    // user deposit history
    public function depositTransactionHistories($user_id = null, $status = null, $search = null, $order_by = null)
    {
        $histories = DepositeTransaction::join('wallets', 'wallets.id', 'deposite_transactions.receiver_wallet_id')
            ->select('wallets.*', 'deposite_transactions.*')
            ->when($user_id, function ($query) use ($user_id) {
                return $query->where('wallets.user_id', $user_id);
            })
            ->when($status, function ($query) use ($status) {
                return $query->where('deposite_transactions.status', $status);
            })
            ->when($search, function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('deposite_transactions.address', 'like', "%$search%")
                        ->orWhere('deposite_transactions.transaction_id', 'like', "%$search%")
                        ->orWhere('deposite_transactions.coin_type', 'like', "%$search%")
                        ->orWhere('deposite_transactions.amount', 'like', "%$search%");
                });
            })
            ->when(!empty($order_by['column_name']) && !empty($order_by['order_by']), function ($query) use ($order_by) {
                $withdraw_columns = ['created_at', 'address', 'amount', 'fees', 'coin_type'];
                if (in_array($order_by['column_name'], $withdraw_columns)) {
                    return $query->orderBy("deposite_transactions.$order_by[column_name]", $order_by['order_by']);
                }
                return $query->orderBy("wallets.$order_by[column_name]", $order_by['order_by']);
            });

        return $histories;
    }

    // user withdrawal history
    public function withdrawTransactionHistories($user_id = null, $status = null, $search = null, $order_by = null)
    {
        $histories = WithdrawHistory::join('wallets', 'wallets.id', 'withdraw_histories.wallet_id')
            ->select('wallets.*', 'withdraw_histories.*')
            ->when($user_id, function ($query) use ($user_id) {
                return $query->where('wallets.user_id', $user_id);
            })
            ->when($status, function ($query) use ($status) {
                return $query->where('withdraw_histories.status', $status);
            })
            ->when($search, function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('withdraw_histories.address', 'like', "%$search%")
                        ->orWhere('withdraw_histories.transaction_hash', 'like', "%$search%")
                        ->orWhere('withdraw_histories.coin_type', 'like', "%$search%")
                        ->orWhere('withdraw_histories.amount', 'like', "%$search%");
                });
            })
            ->when(!empty($order_by['column_name']) && !empty($order_by['order_by']), function ($query) use ($order_by) {
                $withdraw_columns = ['created_at', 'address', 'amount', 'fees', 'coin_type'];
                if (in_array($order_by['column_name'], $withdraw_columns)) {
                    return $query->orderBy("withdraw_histories.$order_by[column_name]", $order_by['order_by']);
                }
                return $query->orderBy("wallets.$order_by[column_name]", $order_by['order_by']);
            });

        return $histories;
    }

    public function isAllApprovalDoneForCoWalletWithdraw($tempWithdraw)
    {
        if (empty($tempWithdraw)) {
            Log::warning('Empty temp withdrawal.');
            return ['success' => false, 'message' => __('Invalid withdrawal.')];
        }
        $response = $this->approvalCounts($tempWithdraw);
        if ($response['alreadyApprovedUserCount'] >= $response['requiredUserApprovalCount']) {
            $tempWithdraw->status = STATUS_ACCEPTED;
            try {
                if (!$tempWithdraw->save()) throw new \Exception(__('Temp withdraw status success save failed'));
                return ['success' => true, 'message' => ''];
            } catch (\Exception $e) {
                Log::warning($e->getMessage());
                return ['success' => false, 'message' => $e->getMessage()];
            }
        } else return ['success' => false, 'message' => __('Not enough approval done yet.')];
    }

    public function approvalCounts($tempWithdraw)
    {
        $userPercentageForApproval = settings(CO_WALLET_WITHDRAWAL_USER_APPROVAL_PERCENTAGE_SLUG);
        $userPercentageForApproval = !empty($userPercentageForApproval) ? $userPercentageForApproval : 60;
        $coUserCount = WalletCoUser::where(['wallet_id' => $tempWithdraw->wallet_id])->count();
        $requiredUserApprovalCount = ceil($coUserCount * ($userPercentageForApproval / 100.0));
        $alreadyApprovedUserCount = CoWalletWithdrawApproval::where(['temp_withdraw_id' => $tempWithdraw->id])->count();
        return ['requiredUserApprovalCount' => $requiredUserApprovalCount, 'alreadyApprovedUserCount' => $alreadyApprovedUserCount];
    }

    // check withdrawal validation
    public function checkWithdrawalValidation(string $address, float $amount, User $user, Coin $coin, Wallet $wallet, mixed $memo = null)
    {
        $walletAddress = $this->isInternalAddress($address, $memo);
        if ($walletAddress) {
            if ($walletAddress->user_id == $user->id)
                throw new InvalidRequestException(__('You can not send to your own wallet!'));

            if ($walletAddress->wallet->coin_type != $coin->coin_type)
                throw new InvalidRequestException(__('Both wallet coin type should be same'));

            $data = [
                'fees' => 0,
                'receiverWallet' => $walletAddress->wallet,
                'addressType' => ADDRESS_TYPE_INTERNAL,
            ];
        } else {
            $fees = check_withdrawal_fees($amount, $coin->withdrawal_fees, $coin->withdrawal_fees_type);

            $data = [
                'fees' => $fees,
                'receiverWallet' => null,
                'addressType' => ADDRESS_TYPE_EXTERNAL,
            ];
        }
        $data = array_merge($data, [
            'amount' => $amount,
            'fees_percentage' => $coin->withdrawal_fees,
            'fees_type' => $coin->withdrawal_fees_type,
        ]);

        $this->checkWithdrawalCoinStatus($coin, $wallet, $amount, $data['fees']);

        return $this->responseData(true, __('Withdrawal validation check passed'), $data);
    }

    public function checkWithdrawalCoinStatus(Coin $coin, Wallet $wallet, float $amount, float $fees)
    {
        if ($coin->status != STATUS_ACTIVE) {
            throw new InvalidRequestException(__(':coin_type both wallet coin type should be same', ['coin_type' => $coin->coin_type]));
        }
        if ($coin->is_withdrawal != STATUS_ACTIVE) {
            throw new InvalidRequestException(__(':coin_type coin is not available for withdrawal right now', ['coin_type' => $coin->coin_type]));
        }
        if (($amount + $fees) < $coin->minimum_withdrawal) {
            throw new InvalidRequestException(__('Minimum withdrawal amount :amount', ['amount' => $coin->minimum_withdrawal . ' ' . $coin->coin_type]));
        }
        if (($amount + $fees) > $coin->maximum_withdrawal) {
            throw new InvalidRequestException(__('Maximum withdrawal amount :amount', ['amount' => $coin->maximum_withdrawal . ' ' . $coin->coin_type]));
        }
        if ($wallet->balance < ($amount + $fees)) {
            throw new InvalidRequestException(__("Insufficient balance for withdrawal"));
        }
        return $this->responseData(true, __('Coin status check passed'));
    }

    // admin pending withdrawal accept process
    public function acceptPendingExternalWithdrawal(WithdrawHistory $transaction, ?int $adminId = null): array
    {
        try {
            $gas_fee = 0;

            if ($transaction->network == COIN_PAYMENT) {
                $networkFees = network_fees_coinPayment($transaction->network_type);
                $amountWithNetworkFees = bcaddx($transaction->amount, $networkFees, 8);

                $coinPaymentVersion = CoinPaymentActiveVersion::tryFrom(settings('COIN_PAYMENT_VERSION') ?? 0);
                if(!$coinPaymentVersion) return failed(__("CoinPayment version invalid"));

                $coinPaymentService = $coinPaymentVersion->getService();
                $response = match($coinPaymentVersion){
                    CoinPaymentActiveVersion::LEGACY => $coinPaymentService->CreateWithdrawal(amount: $amountWithNetworkFees, currency: $transaction->network_type, address: $transaction->address, dest_tag: $transaction->memo),
                    CoinPaymentActiveVersion::COIN_PAYMENT_V2 => $coinPaymentService->CreateWithdrawal($transaction->wallet_id,$amountWithNetworkFees, $transaction->network_type, $transaction->address, dest_tag: $transaction?->memo ?? '')
                };

                if (@$response['error'] != 'ok')
                    throw new Exception($response['error']);

                $transaction_hash = $response['result']['id'];
            } elseif ($transaction->network == BITCOIN_API) {
                $result = $this->sendCoinWithBitCoin($transaction, auth()->id(), true, $transaction->user_id);

                $transaction_hash = $result['transaction_id'];
            } elseif ($transaction->network == BITGO_API) {
                $result = $this->sendCoinWithBitgo($transaction);

                $transaction_hash = $result['data'];
            } elseif (in_array($transaction->network, [ERC20_TOKEN, BEP20_TOKEN, TRC20_TOKEN, MATIC_TOKEN])) {
                $result = $this->sendCoinWithERC20($transaction)['data'];

                $transaction_hash = $result['transaction_id'];
            } else
                throw new Exception(__('No Api found'));

            return $this->completeWithdrawalTransaction($transaction, $transaction_hash, $gas_fee, $adminId);
        } catch (Exception $e) {
            $transaction->update([
                'status' => WithdrawHistory::FAILED,
                'reject_note' => $e->getMessage(),
            ]);
            throw new Exception($e->getMessage());
        }
    }

    public function completeWithdrawalTransaction(
        WithdrawHistory $transaction,
        string|null $transaction_hash,
        float $gas_fee = 0,
        ?int $adminId = null,
        int $status = WithdrawHistory::SUCCESS
    ): array {
        $transaction->update([
            'transaction_hash' => $transaction_hash ?: $transaction->transaction_hash,
            'used_gas' => $gas_fee,
            'status' => $status,
            'updated_by' => $adminId,
        ]);
        DistributeWithdrawalReferralBonus::dispatch($transaction)->onQueue('referral');

        // Send email notification to the user
        // $title = __("Withdraw request approved by system");
        // $body = __("Your withdrawal request is approved by System. \nWithdrawal transaction hash is $transaction_hash.");
        // $this->sendEmailAndNotification($title, $body, $transaction->user);

        return $this->responseData(
            true,
            empty($adminId)
                ? __('User withdrawal processed successfully')
                : __('Pending withdrawal accepted Successfully')
        );
    }

    // external transfer by using bit coin api
    public function sendCoinWithBitCoin(WithdrawHistory $transaction, $authId, $isAdmin, $user_id)
    {
        $coin = (new CoinSettingRepository(CoinSetting::class))
            ->getCoinSettingData($transaction->coin_type, $transaction->network);

        if (empty($coin))
            throw new Exception(__('Coin not found'));

        $api = new BitCoinApiService($coin->coin_api_user, decryptId($coin->coin_api_pass), $coin->coin_api_host, $coin->coin_api_port);
        $response = $api->verifyAddress($transaction->address);

        if (empty($response))
            throw new Exception(__('Invalid address!'));

        $adminId = $isAdmin ? $authId : null;
        $userId = $isAdmin ? $user_id : $authId;

        $transaction_id = $api->sendToAddress($transaction->address, $transaction->amount, $userId, $adminId);

        if (empty($transaction_id))
            throw new Exception(__('Failed to send coin!'));

        return $this->responseData(true, __('Transfer successfully!'), $transaction_id);
    }

    // withdrawal process
    public function withdrawalProcess($user, $request)
    {
        $coin = (new CoinService)->getCoin(['coin_type' => $request->coin_type, 'is_withdrawal' => STATUS_ACTIVE, 'status' => STATUS_ACTIVE])->first();
        if (!$coin)
            throw new Exception(__('Coin not found'));

        $wallet = (new WalletRepository())->walletInfo($user->id, $coin);
        if (!$wallet)
            throw new Exception(__('Wallet not found'));

        if ($coin->coin_type == COIN_USDT && $request->network_id == COIN_PAYMENT) {
            $data['network_type'] = $request->network_type;

            $checkNetwork = WalletNetwork::where(['wallet_id' => $wallet->id, 'network_type' => $request->network_type])->first();
            if (empty($checkNetwork))
                throw new InvalidResponseException(__('Selected network not found'));
        }
        $validationResponse = $this->checkWithdrawalValidation(
            address: $request->address,
            amount : $request->amount,
            user   : $user,
            coin   : $coin,
            wallet : $wallet,
            memo   : $request?->memo
        );

        $data = [
            ...($validationResponse['data'] ?? []),
            'user' => $user,
            'coin' => $coin,
            'wallet' => $wallet,
            'amount' => $request->amount,
            'address' => $request->address,
            'note' => $request?->note,
            'network_type' => $request?->network_type,
            'memo' => $request?->memo
        ];

        if (isset($request->code) && !defined("IS_PUBLIC_API")) {
            $request->merge(['code_type' => GOOGLE_AUTH]);
            $response = checkTwoFactor("two_factor_withdraw", $request);
            if ($response["success"] == false)
                throw new InvalidResponseException($response['message']);
        }
        // Dispatching the withdrawal job to the 'withdrawal' queue
        WithdrawalProcessJob::dispatch($data)->onQueue('withdrawal');

        $message = checkCryptoAdminApproval($request->amount, $coin->id)
            ? __('Withdrawal process started successfully. Please wait for admin approval')
            : __('Withdrawal process started successfully. We will notify you the result soon');

        return $this->responseData(true, $message);
    }

    // kyc validation check
    public function kycValidationCheck($userId)
    {
        $response = [
            'success' => true,
            'message' => __('success ')
        ];
        if (settings('kyc_enable_for_withdrawal') == STATUS_ACTIVE) {
            if (settings('kyc_nid_enable_for_withdrawal') == STATUS_ACTIVE) {
                $checkNid = checkUserKyc($userId, KYC_NID_REQUIRED, __('withdrawal '));
                if ($checkNid['success'] == false) {
                    $response = [
                        'success' => false,
                        'message' => $checkNid['message']
                    ];
                    return $response;
                } else {
                    $response = [
                        'success' => true,
                        'message' => __('success ')
                    ];
                }
            }
            if (settings('kyc_passport_enable_for_withdrawal') ==  STATUS_ACTIVE) {
                $checkPass = checkUserKyc($userId, KYC_PASSPORT_REQUIRED, __('withdrawal '));
                if ($checkPass['success'] == false) {
                    $response = [
                        'success' => false,
                        'message' => $checkPass['message']
                    ];
                    return $response;
                } else {
                    $response = [
                        'success' => true,
                        'message' => __('success ')
                    ];
                }
            }
            if (settings('kyc_driving_enable_for_withdrawal') ==  STATUS_ACTIVE) {
                $checkDrive = checkUserKyc($userId, KYC_DRIVING_REQUIRED, __('withdrawal '));
                if ($checkDrive['success'] == false) {
                    $response = [
                        'success' => false,
                        'message' => $checkDrive['message']
                    ];
                    return $response;
                } else {
                    $response = [
                        'success' => true,
                        'message' => __('success ')
                    ];
                }
            }
        } else {
            $response = [
                'success' => true,
                'message' => __('success ')
            ];
        }

        return $response;
    }

    // send coin with bitgo
    public function sendCoinWithBitgo($transaction)
    {
        $coin = (new CoinSettingRepository(CoinSetting::class))
            ->getCoinSettingData($transaction->coin_type, $transaction->network);

        if (empty($coin))
            throw new Exception(__('Coin not found'));

        $bitgoService = new BitgoWalletService();
        $bitgoResponse = $bitgoService->sendCoinsWithBitgo(
            $coin->coin_type,
            $coin->bitgo_wallet_id,
            $transaction->amount,
            $transaction->address,
            decryptId($coin->bitgo_wallet)
        );
        if ($bitgoResponse['success'] == false)
            throw new Exception($bitgoResponse['message']);

        $txid = data_get($bitgoResponse, 'data.txid')
            ?? data_get($bitgoResponse, 'data.transfer.txid')
            ?? data_get($bitgoResponse, 'data.transfer.coinSpecific.txid')
            ?? '';

        return $this->responseData(true, __('Coin send successful'), $txid);
    }

    // send coin with erc20 api
    public function sendCoinWithERC20($transaction)
    {

        $coin = (new CoinSettingRepository(CoinSetting::class))
            ->getCoinSettingData($transaction->coin_type, $transaction->network);

        if (empty($coin))
            throw new Exception(__('Coin not found'));

        $coinApi = new ERC20TokenApi($coin);
        $requestData = [
            "amount_value" => (float)$transaction->amount,
            "from_address" => $coin->wallet_address,
            "to_address" => $transaction->address,
            "contracts" => decryptId($coin->wallet_key)
        ];
        $result = $coinApi->sendCustomToken($requestData);

        if ($result['success'] == false)
            throw new Exception($result['message']);

        $data['transaction_id'] = $result['data']->hash;
        $data['used_gas'] = $result['data']->used_gas;

        return $this->responseData(true, __('Coin sent successfully'), $data);
    }

    // pre withdrawal process
    public function preWithdrawalProcess($userId, $request): array
    {
        $coin = (new CoinService())
            ->getDocs(['coin_type' => $request->coin_type, 'is_withdrawal' => STATUS_ACTIVE, 'status' => STATUS_ACTIVE])->first();
        if (empty($coin))
            throw new Exception(__('Coin not found'));

        $wallet = (new WalletRepository())->walletInfo($userId, $coin);
        if (empty($wallet))
            throw new Exception(__('Wallet not found'));

        $amount = $request->amount ?: 0;
        $address = $request->address ?: 'address';

        $isInternalAddress = $this->isInternalAddress($address);

        $fees = $isInternalAddress ? 0
            : check_withdrawal_fees($amount, $coin->withdrawal_fees, $coin->withdrawal_fees_type);

        $result = [
            'coin_type' => $coin->coin_type,
            'fees' => $this->truncateNum($fees),
            'amount' => $this->truncateNum($amount),
            'fees_percentage' => $this->truncateNum($coin->withdrawal_fees),
            'fees_type' => $coin->withdrawal_fees_type,
            'min' => $coin->minimum_withdrawal,
            'max' => $coin->maximum_withdrawal,
        ];
        return $this->responseData(true, __('Success'), $result);
    }
}
