<?php

Route::post('/coin-payment-notifier', 'Api\WalletNotifier@coinPaymentNotifier')->name('coinPaymentNotifier');
Route::post('/coin-payment-v2/notifier', 'Api\WalletNotifier@coinPaymentV2Notifier')->name('coinPaymentV2Notifier');
Route::post('bitgo-wallet-webhook','Api\WalletNotifier@bitgoWalletWebhook')->name('bitgoWalletWebhook');

Route::group(['namespace'=>'Api', 'middleware' => 'wallet_notify'], function (){
    Route::post('wallet-notifier','WalletNotifier@walletNotify');
    Route::post('wallet-notifier-confirm','WalletNotifier@notifyConfirm');
});