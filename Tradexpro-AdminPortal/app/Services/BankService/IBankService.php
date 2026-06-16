<?php

namespace App\Services\BankService;

use App\Http\Requests\BankFormCompletionRequest;

interface IBankService
{
    /**
     * Summary of getForms
     * @return array{data: mixed, message: string, success: bool}
     */
    public function getUserForms(): array;

    /**
     * Summary of getFormFields
     * @param int $formId
     * @return array{data: mixed, message: string, success: bool}
     */
    public function getFormFields(int $formId): array;

    /**
     * Summary of getBank
     * @param mixed $id
     * @return array{data: mixed, message: string, success: bool}
     */
    public function getBank($id): array;

    /**
     * Summary of saveBank
     * @param \App\Http\Requests\BankFormCompletionRequest $request
     * @return array{data: mixed, message: string, success: bool}
     */
    public function saveBank(BankFormCompletionRequest $request): array;

    /**
     * Summary of bankStatusChange
     * @param string $id
     * @return array{data: mixed, message: string, success: bool}
     */
    public function bankStatusChange(string $id): array;

    /**
     * Summary of deleteBank
     * @param mixed $id
     * @return array{data: mixed, message: string, success: bool}
     */
    public function deleteBank($id): array;

    /**
     * Summary of getUserBankList
     * @return array{data: mixed, message: string, success: bool}
     */
    public function getUserBankList(): array;

    /**
     * Summary of adminBankList
     * @return array{data: mixed, message: string, success: bool}
     */
    public function adminBankList(): array;

    /**
     * Summary of getForms
     * @param int $access
     * @return array{data: mixed, message: string, success: bool}
     */
    public function getFormsByAccess(int $access): array;
}