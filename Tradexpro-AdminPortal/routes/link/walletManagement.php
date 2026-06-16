<?php

use Illuminate\Support\Facades\Route;

Route::group(['group' => 'transaction_all'], function () {
    Route::get('transaction-export', 'TransactionController@adminTransactionHistoryExport')->name('adminTransactionHistoryExport');
    Route::get('transaction-history', 'TransactionController@adminTransactionHistory')->name('adminTransactionHistory');
    Route::get('deposit-history', 'TransactionController@adminDepositHistory')->name('adminDepositHistory');
    Route::get('deposit-details-{id}', 'TransactionController@adminDepositDetails')->name('adminDepositDetails');
    Route::get('withdrawal-history', 'TransactionController@adminWithdrawalHistory')->name('adminWithdrawalHistory');

    Route::get('currency-transaction-history', 'TransactionController@adminTransactionHistoryCurrency')->name('adminTransactionHistoryCurrency');
    Route::get('currency-withdrawal-history', 'TransactionController@adminWithdrawalHistoryCurrency')->name('adminWithdrawalHistoryCurrency');
});
Route::group(['group' => 'transaction_withdrawal'], function () {
    Route::get('pending-withdrawal', 'TransactionController@adminPendingWithdrawal')->name('adminPendingWithdrawal');
    Route::get('failed-withdrawal', 'TransactionController@adminFailedWithdrawal')->name('adminFailedWithdrawal');
    Route::get('accept-pending-withdrawal-{id}', 'TransactionController@adminAcceptPendingWithdrawal')->name('adminAcceptPendingWithdrawal');
    Route::post('make-as-withdrawal-success', 'TransactionController@adminMakeAsWithdrawalSuccess')->name('adminMakeAsWithdrawalSuccess');
    Route::post('reject-pending-withdrawal', 'TransactionController@adminRejectPendingWithdrawal')->name('adminRejectPendingWithdrawal')->middleware('check_demo');
    Route::get('withdrawal-details-{id}', 'TransactionController@adminWithdrawalDetails')->name('adminWithdrawalDetails');
    Route::get('withdrawal-referral-history', 'TransactionController@adminWithdrawalReferralHistory')->name('adminWithdrawalReferralHistory');

    Route::get('currency-pending-withdrawal', 'TransactionController@adminPendingWithdrawalCurrency')->name('adminPendingWithdrawalCurrency');
    Route::get('currency-rejected-withdrawal', 'TransactionController@adminRejectedWithdrawalCurrency')->name('adminRejectedWithdrawalCurrency');
    Route::get('currency-active-withdrawal', 'TransactionController@adminActiveWithdrawalCurrency')->name('adminActiveWithdrawalCurrency');
    Route::get('currency-reject-pending-withdrawal-{id}', 'TransactionController@adminRejectPendingWithdrawalCurrency')->name('adminRejectPendingWithdrawalCurrency')->middleware('check_demo');
    Route::post('currency-accept-pending-withdrawal', 'TransactionController@adminAcceptPendingWithdrawalCurrency')->name('adminAcceptPendingWithdrawalCurrency');
    Route::get('currency-withdrawal-referral-history', 'TransactionController@adminWithdrawalReferralHistoryCurrency')->name('adminWithdrawalReferralHistoryCurrency');
});
Route::group(['group' => 'transaction_deposit'], function () {
    Route::get('pending-deposit', 'TransactionController@adminPendingDeposit')->name('adminPendingDeposit');
    Route::get('accept-pending-deposit-{id}', 'TransactionController@adminPendingDepositAcceptProcess')->name('adminPendingDepositAcceptProcess')->middleware('check_demo');

    Route::get('pending-currency-deposit', 'TransactionController@adminPendingCurrencyDeposit')->name('adminPendingCurrencyDeposit');
    Route::get('accept-pending-currency-deposit-{id}', 'TransactionController@adminPendingCurrencyDepositAcceptProcess')->name('adminPendingCurrencyDepositAcceptProcess')->middleware('check_demo');
    Route::post('reject-pending-currency-deposit', 'TransactionController@adminPendingCurrencyDepositRejectProcess')->name('adminPendingCurrencyDepositRejectProcess')->middleware('check_demo');
    Route::get('download-pending-bank-deposit-{id}', 'TransactionController@downloadCurrencyDeposit')->name('downloadCurrencyDeposit')->middleware('check_demo');
});


Route::group(['group' => 'check_deposit'], function () {
    Route::get('check-deposit', 'DepositController@adminCheckDeposit')->name('adminCheckDeposit');
    Route::get('submit-check-deposit', 'DepositController@submitCheckDeposit')->name('submitCheckDeposit');
});

// pending deposit report and action
Route::group(['group' => 'pending_token_deposit'], function () {
    Route::get('pending-token-deposit-history', 'DepositController@adminPendingDepositHistory')->name('adminPendingDepositHistory');
    Route::get('pending-token-deposit-accept-{id}', 'DepositController@adminPendingDepositAccept')->name('adminPendingDepositAccept')->middleware('check_demo');
    Route::get('pending-token-deposit-reject-{id}', 'DepositController@adminPendingDepositReject')->name('adminPendingDepositReject')->middleware('check_demo');

    Route::get('ico-token-buy-list-accept', 'DepositController@icoTokenBuyListAccept')->name('icoTokenBuyListAccept');
    Route::get('admin-ico-token-receive-process/{id}', 'DepositController@adminReceiveBuyTokenAmount')->name('adminReceiveBuyTokenAmount');
});
Route::group(['group' => 'token_gas'], function () {
    Route::get('gas-send-history', 'DepositController@adminGasSendHistory')->name('adminGasSendHistory');
});
Route::group(['group' => 'token_receive_history'], function () {
    Route::get('token-receive-history', 'DepositController@adminTokenReceiveHistory')->name('adminTokenReceiveHistory');
});
