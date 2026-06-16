<?php

use App\Http\Controllers\admin\DynamicBankController;

Route::group(['as' => 'bank.form.'], function (){
    // Bank Form
    Route::group(['group' => 'bank_form'], function () {
        Route::get('bank-form-list', [DynamicBankController::class, "bankFormListPage"])->name("list.page");
        Route::get('bank-form-add-edit/{id?}', [DynamicBankController::class, "bankFormAddEditPage"])->name("add.edit.page");
        Route::group(['middleware' => 'check_demo'], function () {
            Route::get('bank-form-delete-{id}', [DynamicBankController::class, "bankFormDelete"])->name("delete");
            Route::post('bank-form-submit', [DynamicBankController::class, "bankFormSubmit"])->name("submit");
            Route::post('bank-form-status', [DynamicBankController::class, "bankFormStatus"])->name("status");
        });
    });

    // Bank Form Field
    Route::group(['group' => 'bank_form_field'], function () {
        Route::get("bank-form-fields-{id}", action: [ DynamicBankController::class, "bankFormFieldList" ])->name("field.list");
        Route::get('bank-form-field-add-edit/{id?}', [DynamicBankController::class, "bankFormFieldAddEdit"])->name("field.add.edit.page");
        Route::group(['middleware' => 'check_demo'], function () {
            Route::post('bank-form-field-submit', [DynamicBankController::class, "bankFormFieldSubmit"])->name("field.save");
            Route::post('bank-form-field-status', [DynamicBankController::class, "bankFormFieldStatus"])->name("field.status");
            Route::get('bank-form-field-delete-{id?}', [DynamicBankController::class, "bankFormFieldDelete"])->name("field.delete");
        });
    });

    // Bank Records
    Route::group(['group' => 'admin_bank'], function () {
        Route::get('bank-record-list', [DynamicBankController::class, "bankRecordListPage"])->name("record.list.page");
        Route::get('bank-record', [DynamicBankController::class, "bankRecordAdd"])->name("record.add");
        Route::get('bank-record-edit-{id}', [DynamicBankController::class, "bankRecordEdit"])->name("record.edit");
        Route::group(['middleware' => 'check_demo'], function () {
            Route::post('bank-record-save', [DynamicBankController::class, "bankRecordSave"])->name("record.save");
            Route::get('bank-record-delete-{id?}', [DynamicBankController::class, "bankRecordDelete"])->name("record.delete");
            Route::post('bank-record-status', [DynamicBankController::class, "bankRecordStatus"])->name("record.status");
            Route::get('bank-form-change', [DynamicBankController::class, "bankFormChange"])->name("change");
        });
    });
});
