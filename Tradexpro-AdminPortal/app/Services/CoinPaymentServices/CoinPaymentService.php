<?php

namespace App\Services\CoinPaymentServices;

use Exception;
use App\Model\Coin;
use App\Model\Wallet;
use App\Model\WalletNetwork;
use App\Model\WalletAddressHistory;
use App\Services\CoinPaymentServices\CoinPaymentApi;
use App\Services\CoinPaymentServices\Responses\WalletCreatedResponse;
use App\Services\CoinPaymentServices\Responses\WalletAddressGeneratedResponse;
use App\Services\CoinPaymentServices\Responses\WithdrawalResponse\WithdrawalRequestResponse;
use App\Services\CoinPaymentServices\Responses\WithdrawalResponse\WithdrawalConfirmationResponse;

final class CoinPaymentService extends CoinPaymentApi
{
    public function __construct() { parent::__construct(); }

    /**
     * Generate Coin Payment Wallet And Wallet Address
     * 
     * @param string $coin
     * @return array{error: array|string|null|array{error: string, result: array{address: string, dest_tag: null, rented_till: \DateTimeImmutable|null}}}
     */
    public function getWalletAddress(string $coin_type)
    {
        $networkAddress = null;
        $coin = Coin::where("coin_type", $coin_type)->first();
        if(!$coin) {
            $networkAddress = WalletNetwork::with('coin')->where('network_type', $coin_type)->first();
            if(!$networkAddress)
                return [ "error" => __("Coin not found during coin payment address generate")];

            if(!$coin = $networkAddress->coin)
                return [ "error" => __("Coin not found during coin payment address generate")];
        }

        if(!$wallet_id = $networkAddress->coin_payment_wallet_id ?? null){
            $wallet = Wallet::where([
                "user_id" => getUserId(),
                "coin_type" => $coin->coin_type
            ])->first();

            $address = WalletAddressHistory::where('wallet_id', $wallet->id)->first();
            $wallet_id = $address->coin_payment_wallet_id ?? null;
        }

        if(!$wallet_id){
            try{
                $coinPaymentWallet = $this->createWallet([
                    'currency' => $coin_type,
                    'label'    => $coin->name
                ]);

                if(!($coinPaymentWallet instanceof WalletCreatedResponse)){
                    return [ "error" => __("Coin wallet create failed during coin payment address generate")];
                }

                $wallet_id = $coinPaymentWallet->walletId;
            } catch(Exception $e){
                return [ "error" => $e->getMessage()];
            }
        }

        if(!$wallet_id)
        return [ "error" => __("CoinPayment wallet address not found")];

        $newAddress = null;
        try{
            $newAddress = $this->getAddress($wallet_id);
        } catch (Exception $e){
            return [ "error" => $e->getMessage()];
        }

        if(!($newAddress instanceof WalletAddressGeneratedResponse)){
            return [ "error" => __("Coin payment address generate failed, response invalid")];
        }

        return [
            "error" => "ok",
            "result"=> [
                "address" => $newAddress->networkAddress,
                "dest_tag" => null,
                "wallet_id" => $wallet_id,
                "rented_till" => $newAddress->rentedTill
            ]
        ];
    }

    /**
     * Send Wallet Fund To Another Wallet Address
     * 
     * @param int $wallet_id
     * @param string $amount
     * @param string $currency
     * @param string $address
     * @param string $dest_tag
     * @return array{error: string, result: array{id: string}|array{error: string}}
     */
    public function CreateWithdrawal(int $wallet_id, string $amount, string $currency, string $address, string $dest_tag = "")
    {
        $walletIdStr = null;
        $walletAddress = WalletAddressHistory::where([
            'wallet_id' => $wallet_id,
            'coin_type' => $currency
        ])->first();
        if(!$walletAddress) {
            $walletAddress = WalletNetwork::with('coin')
                ->where('wallet_id', $wallet_id)
                ->whereNotNull("coin_payment_wallet_id")->first();

            if(!$walletAddress)
                return [ "error" => __("User wallet address not found")];
        }

        if(!$walletIdStr = $walletAddress->coin_payment_wallet_id ?? null)
            return [ "error" => __("CoinPayment wallet id not found")];

        $sendRequest = null;
        try {
            $sendRequest = $this->makeSpendRequest(
                walletIdStr: $walletIdStr,
                amount: $amount,
                currency: strtoupper($currency),
                address: $address,
                memo: $dest_tag
            );
        } catch (\Throwable $th) {
            return ["error" => $th->getMessage()];
        }

        if(!($sendRequest instanceof WithdrawalRequestResponse)){
            return ["error" => "Withdrawal spend request failed"];
        }

        $confirmWithdraw = $this->confirmSpendRequest(
            walletIdStr: $walletIdStr,
            spendRequestId: $sendRequest->spendRequestId
        );

        if(!($confirmWithdraw instanceof WithdrawalConfirmationResponse)){
            return ["error" => "Withdrawal spend request failed to confirm"];
        }

        return [
            "error" => "ok",
            "result"=> [
                "id" => $sendRequest->spendRequestId,
            ]
        ];
    }
}