<?php

namespace App\Http\Services;

use Exception;
use App\Model\Coin;
use DateTimeImmutable;
use App\Model\WalletAddressHistory;
use App\Traits\ResponseFormatTrait;
use App\Enums\CoinPaymentActiveVersion;
use App\Http\Repositories\CoinSettingRepository;

class WalletAddressHistoryService
{
    use ResponseFormatTrait;

    public $repository;
    public $bitgoService;

    public function __construct()
    {
        // $this->repository = new WalletRepository();
        // $this->bitgoService = new BitgoWalletService();
    }

    public function getUserWalletAddress(int $userId, Coin $coin, int $walletId): array
    {
        $walletAddressDB = WalletAddressHistory::where([
            'wallet_id' => $walletId,
            'network' => $coin->network
        ])->where('status', '!=', WalletAddressHistory::EXPIRE)->first();

        if (empty(@$walletAddressDB->address)) {
            $addressResponse = $this->generateWalletAddress($coin->coin_type, $coin->network)['data'];

            if (empty($addressResponse['address']))
                throw new Exception("Failed to generate wallet address");

            $wallet_key = $addressResponse['wallet_key'] ? STRONG_KEY . $addressResponse['address'] . $addressResponse['wallet_key'] : '';

            $walletAddress = $this->addWalletAddressHistory(
                $userId,
                $coin->network,
                $walletId,
                $addressResponse['address'],
                $coin->coin_type,
                $wallet_key,
                $addressResponse['public_key'],
                $addressResponse['memo'],
                $addressResponse['wallet_id'],
                $addressResponse['rented_till']
            )['data'];
        } else
            $walletAddress = $walletAddressDB;

        return $this->responseData(true, __('success'),  $walletAddress);
    }

    public function generateWalletAddress(string $coin_type, int $network): array
    {
        $address = '';
        $data = [
            'wallet_key' => '',
            'public_key' => '',
            'memo' => '',
            "wallet_id" => null,
            "rented_till" => null,
        ];

        if ($network == COIN_PAYMENT) {
            $addressInfo = $this->getCoinPaymentWalletAddress($coin_type);
            if (is_success(($addressInfo))) {
                $addressInfo = $addressInfo['data'];
                $address = $addressInfo['address'];
                $data['memo'] = $addressInfo['memo'];
                $data['wallet_id'] = $addressInfo['wallet_id'];
                $data['rented_till'] = $addressInfo['rented_till'];
            }
        } elseif ($network == BITCOIN_API){
            $result = $this->getBitCoinWalletAddress($coin_type)['data'];
            if ($result['address'] ?? '') {
                $address = $result['address'];
            }
        }elseif ($network == BITGO_API){
            $result = $this->getBitGoWalletAddress($coin_type)['data'];
            if ($result['address'] ?? '') {
                $address = $result['address'];
            }
        }elseif (in_array($network, [ERC20_TOKEN, BEP20_TOKEN, TRC20_TOKEN, MATIC_TOKEN])) {
            $result = $this->getErc20WalletAddress($coin_type, $network)['data'];
            if ($result) {
                $address = $result->address;
                $data['wallet_key'] = $result->privateKey;
                $data['public_key'] = @$result->publicKey;
            }
        }
        $data['address'] = $address;

        return $this->responseData(true, __('success'), $data);
    }

    public function coinPaymentNetworks(string $coin_type, int $network): array
    {
        if ($coin_type != COIN_USDT && $network != COIN_PAYMENT)
            throw new Exception("Only USDT wallet networks are supported for this operation");

        $networks = [];
        foreach (usdtWalletNetwork() as $key => $val) {
            array_push($networks, [
                'network_type' => $key,
                'network_name' => $val,
            ]);
        }
        return $this->responseData(true, __('success'), $networks);
    }

    /**
     * Get CoinPayment Wallet Address
     * @param string $payment_type
     * @return array{data: mixed, message: string, success: bool}
     */
    public function getCoinPaymentWalletAddress(string $payment_type): array
    {
        $ipnUrl = url('api/coin-payment-notifier');
        $coinPaymentVersion = CoinPaymentActiveVersion::tryFrom(settings('COIN_PAYMENT_VERSION') ?? 0);
        if(!$coinPaymentVersion) {
            storeException('Coin payment version invalid ', 'on deposit adderss generate');
            return failed(__("Failed"));
        }

        $coinPaymentService = $coinPaymentVersion->getService();
        $address = match($coinPaymentVersion){
            CoinPaymentActiveVersion::LEGACY => $coinPaymentService->GetCallbackAddress($payment_type, $ipnUrl),
            CoinPaymentActiveVersion::COIN_PAYMENT_V2 => $coinPaymentService->getWalletAddress($payment_type)
        };

        if (isset($address['error']) && ($address['error'] != 'ok'))
            return failed($address['error'] ?? __("CoinPayment address generation failed"));

        $data['memo'] = "";
        $data['address'] = $address['result']['address'];
        $data['wallet_id'] = $address['result']['wallet_id'] ?? null;
        $data['rented_till'] = $address['result']['rented_till'] ?? null;

        if (isset($address['result']['dest_tag']))
            $data['memo'] = $address['result']['dest_tag'];

        return $this->responseData(true, __('success'), $data);
    }

    public function getBitCoinWalletAddress(string $coin_type)
    {
        $coin = (new CoinSettingRepository())->getCoinSettingData($coin_type, BITCOIN_API);
        if (empty($coin))
            throw new Exception(__('Coin not found'));

        $bitCoinApi = new BitCoinApiService($coin->coin_api_user, decryptId($coin->coin_api_pass), $coin->coin_api_host, $coin->coin_api_port);
        $data['address'] = $bitCoinApi->getNewAddress();

        if (empty($data['address']))
            throw new Exception(__('Failed to bitcoin address generate'));

        return $this->responseData(true, __('success'), $data);
    }

    public function getBitGoWalletAddress(string $coin_type): array
    {
        $coin = (new CoinSettingRepository())->getCoinSettingData($coin_type, BITGO_API);
        if (empty($coin))
            throw new Exception(__('Coin not found'));

        if (empty($coin->bitgo_wallet_id))
            throw new Exception(__('Bitgo wallet not found'));

        $bitgoApi = new BitgoWalletService();
        $address = $bitgoApi->createBitgoWalletAddress($coin->coin_type, $coin->bitgo_wallet_id, $coin->chain);

        if ($address['success'] == false)
            throw new Exception($address['message']);

        $data['address'] = $address['data']['address'];

        return $this->responseData(true, __('success'), $data);
    }

    public function getErc20WalletAddress(string $coin_type, int $network): array
    {
        $coin = (new CoinSettingRepository())->getCoinSettingData($coin_type, $network);
        if (empty($coin))
            throw new Exception(__('Coin not found'));

        if (empty($coin->chain_link))
            throw new Exception(__(":coin_type RPC node url not found", ["coin_type" => $coin_type]));

        $api = new ERC20TokenApi($coin);
        $address = $api->createNewWallet();

        if ($address['success'] == false)
            throw new Exception($address['message']);

        return $this->responseData(true, __('success'), $address['data']);
    }

    public function addWalletAddressHistory(
        int $user_id,
        int $network,
        int $wallet_id,
        string $address,
        string $coin_type,
        string $wallet_key,
        ?string $public_key = null,
        ?string $memo = null,
        string|int|null $c_wallet_id = null,
        ?DateTimeImmutable $rented_till = null
    ): array {
        $result =   WalletAddressHistory::updateOrCreate(
            [
                'user_id' => $user_id,
                'network' => $network,
                'wallet_id' => $wallet_id,
                'coin_type' => $coin_type
            ],
            [
                'address' => $address,
                'wallet_key' => $wallet_key,
                'public_key' => $public_key ?? '',
                'memo' => $memo ?? '',
                "coin_payment_wallet_id" => $c_wallet_id,
                'rented_till' => $rented_till,
                'status' => WalletAddressHistory::ACTIVE
            ]
        );
        return $this->responseData(true, __('Wallet address add successfully'), $result);
    }
}
