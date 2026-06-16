<?php

use Illuminate\Support\Facades\Route;

Route::group(['group' => 'admin_bank'], function () {
    // Admin Bank
    Route::get('admin-bank-list','AdminBankController@bankList')->name('adminBankList');
    Route::get('admin-bank-add','AdminBankController@bankAdd')->name('adminBankAdd');
    Route::get('admin-bank-edit-{id}', 'AdminBankController@bankEdit')->name('adminBankEdit');
    Route::post('admin-bank-save','AdminBankController@bankSave')->name('adminBankSave');
    Route::get('admin-bank-delete-{id?}', 'AdminBankController@bankDelete')->name('adminBankDelete');
    Route::post('admin-bank-status-change', 'AdminBankController@bankStatusChange')->name('adminBankStatusChange');
    Route::get('admin-bank-form-change', 'AdminBankController@bankFormChange')->name('adminBankFormChange');

});
