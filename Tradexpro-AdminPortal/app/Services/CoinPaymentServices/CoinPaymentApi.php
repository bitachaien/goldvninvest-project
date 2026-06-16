<?php

namespace App\Services\CoinPaymentServices;

use GuzzleHttp\Client as HttpClient;
use App\Services\CoinPaymentServices\Enums\HttpMethod;
use App\Services\CoinPaymentServices\CoinPaymentClient;
use App\Services\CoinPaymentServices\CoinPaymentSerializerFactory;
use App\Services\CoinPaymentServices\Enums\HttpRequestPayloadType;
use App\Services\CoinPaymentServices\Responses\WalletCreatedResponse;
use App\Services\CoinPaymentServices\Responses\RateResponse\RateResponse;
use App\Services\CoinPaymentServices\Exceptions\CoinPaymentApiErrorException;
use App\Services\CoinPaymentServices\Responses\WalletAddressGeneratedResponse;
use App\Services\CoinPaymentServices\Responses\WalletResponse\GetWalletResponse;
use App\Services\CoinPaymentServices\Responses\WithdrawalResponse\WithdrawalRequestResponse;
use App\Services\CoinPaymentServices\Responses\WithdrawalResponse\WithdrawalConfirmationResponse;

abstract class CoinPaymentApi
{
    /**
     * Coin Payment Client Service
     * @var CoinPaymentClient $client
     */
    private CoinPaymentClient $client;
    public function __construct()
    {
        $this->client = new CoinPaymentClient(
            client_id : settings('COIN_PAYMENT_V2_CLIENT_ID') ?? '',
            secret_key: settings('COIN_PAYMENT_V2_SECRET_ID') ?? '',
            client    : new HttpClient(),
            serializer: (new CoinPaymentSerializerFactory())->build(),
        );
    }

    /**
     * Get Coins Rate Details
     * 
     * @param string $from coin symbol or coin id
     * @param string $to   coin symbol or coin id
     * @return RateResponse
     * 
     * @throws \GuzzleHttp\Exception\GuzzleException | CoinPaymentApiErrorException
     */
    public function getRates(string $from, string $to): RateResponse
    {
        $params = [
            "from" => $from,
            "to"   => $to
        ];
        return $this->client->request(
            endpoint: "rates",
            responsePayload: RateResponse::class,
            parameters: $params,
            requestMethod: HttpMethod::GET
        );
    }

    /**
     * Get All Wallets Of CoinPayment Account
     * 
     * @param array $params
     * @return GetWalletResponse
     * 
     * @throws \GuzzleHttp\Exception\GuzzleException | CoinPaymentApiErrorException
     */
    public function getWallets(): GetWalletResponse
    {
        return $this->client->request(
            endpoint: "merchant/wallets",
            responsePayload: GetWalletResponse::class,
            requestMethod: HttpMethod::GET,
            payloadType: HttpRequestPayloadType::QUERY
        );
    }

    /**
     * Create Wallet For Coins
     * 
     * @param array $params
     * @return WalletCreatedResponse
     * 
     * @throws \GuzzleHttp\Exception\GuzzleException | CoinPaymentApiErrorException
     */
    public function createWallet(array $params): WalletCreatedResponse
    {
        return $this->client->request(
            endpoint: "merchant/wallets",
            responsePayload: WalletCreatedResponse::class,
            parameters: $params,
            payloadType: HttpRequestPayloadType::JSON
        );
    }

    /**
     * Generate Wallet Address For Existing Wallet
     * @param string $walletIdStr
     * @return WalletAddressGeneratedResponse
     * 
     * @throws \GuzzleHttp\Exception\GuzzleException | CoinPaymentApiErrorException
     */
    public function getAddress(string $walletIdStr): WalletAddressGeneratedResponse
    {
        $params = [
            // "label" => "Testnet LTC Wallet",
            "notificationUrl" => route('coinPaymentV2Notifier')
        ];
        return $this->client->request(
            endpoint: "merchant/wallets/$walletIdStr/addresses",
            parameters: $params,
            responsePayload: WalletAddressGeneratedResponse::class,
            payloadType: HttpRequestPayloadType::JSON
        );
    }

    /**
     * Create spend request V2 ( Withdrawal Request )
     * 
     * @param string $walletIdStr
     * @return WithdrawalRequestResponse
     * 
     * @throws \GuzzleHttp\Exception\GuzzleException | CoinPaymentApiErrorException
     */
    public function makeSpendRequest(string $walletIdStr, string $amount, string $currency, string $address, string $memo = ""): WithdrawalRequestResponse
    {
        $params = [
            "toAddress" => $address,
            "toCurrency" => $currency,
            "amount" => $amount,
            "memo" => $memo,
            "receiverPaysFee" => false,
            // "amountCurrency" => "5057, 4:0xdac17f958d2ee523a2206206994597c13d831ec7",
        ];

        return $this->client->request(
            endpoint: "merchant/wallets/$walletIdStr/spend/request",
            responsePayload: WithdrawalRequestResponse::class,
            parameters: $params,
            payloadType: HttpRequestPayloadType::JSON
        );
    }

    /**
     * Confirm spend ( Withdrawal )
     * 
     * @param string $walletIdStr
     * @param string $spendRequestId
     * @return WithdrawalConfirmationResponse
     * 
     * @throws \GuzzleHttp\Exception\GuzzleException | CoinPaymentApiErrorException
     */
    public function confirmSpendRequest(string $walletIdStr, string $spendRequestId): WithdrawalConfirmationResponse
    {
        $params = [ "spendRequestId" => $spendRequestId ];
        return $this->client->request(
            endpoint: "merchant/wallets/$walletIdStr/spend/confirmation",
            responsePayload: WithdrawalConfirmationResponse::class,
            parameters: $params,
            payloadType: HttpRequestPayloadType::JSON
        );
    }
}