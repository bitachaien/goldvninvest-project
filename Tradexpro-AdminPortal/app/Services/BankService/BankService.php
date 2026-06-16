<?php

namespace App\Services\BankService;

use App\Facades\ResponseFacade;
use App\Model\DynamicBank\BankForm;
use App\Model\DynamicBank\BankRecord;
use App\Model\DynamicBank\BankFormField;
use App\Http\Requests\BankFormCompletionRequest;
use App\Services\BankService\Enums\BankFormAccessType;

class BankService implements IBankService
{
    /**
     * Summary of getForms
     * @return array{data: mixed, message: string, success: bool}
     */
    public function getUserForms(): array
    {
        try{
            $forms = BankForm::with(["fields" => function($query){
                    return $query->whereStatus(STATUS_ACTIVE);
                }])
                ->whereHas("fields")
                ->where("access", "LIKE", "%" . BankFormAccessType::USER->value . "%")
                ->whereStatus(STATUS_ACTIVE)->get();

            return success(__("Forms found successfully"), $forms);
        } catch (\Exception $e) {
            storeException("BankService getForms",$e->getMessage());
            return failed(__("Failed to find forms"));
        }
    }

    /**
     * Summary of getFormFields
     * @param int $formId
     * @return array{data: mixed, message: string, success: bool}
     */
    public function getFormFields(int $formId): array
    {
        try{
            $fields = BankFormField::where("form_id", $formId)->get();
            return success(__("Fields found successfully"), $fields);
        } catch (\Exception $e) {
            storeException("BankService getFormFields",$e->getMessage());
            return failed(__("Failed to find fields"));
        }
    }

    /**
     * Summary of getBank
     * @param mixed $id
     * @return array{data: mixed, message: string, success: bool}
     */
    public function getBank($id): array
    {  
        try{
            $bank = BankRecord::with("bank_form","bank_form.fields")
                ->where(function($query){
                    if(auth()->user()?->role == USER_ROLE_ADMIN)
                        return $query->where("is_admin", 1);

                    return $query->where("user_id", auth()->user()->id);
                })->find($id);
            if(! $bank) return failed(__("Bank not found"));

            $bankDetails = json_decode($bank->bank, true);

            if (
                json_last_error() !== JSON_ERROR_NONE 
                || !is_array($bankDetails)
            )   $bankDetails = [];

            $bank->bank = collect($bankDetails);
            $bank?->bank_form?->fields?->map(function($field) use($bankDetails){
                $field->value = $bankDetails[$field->slug]["value"] ?? "N/A";
            });

            return success(__("Bank found successfully"), $bank);
        } catch (\Exception $e) {
            storeException("getBank",$e->getMessage());
            return failed(__("Failed to find bank"));
        }
    }

    /**
     * Summary of saveBank
     * @param \App\Http\Requests\BankFormCompletionRequest $request
     * @return array{data: mixed, message: string, success: bool}
     */
    public function saveBank(BankFormCompletionRequest $request): array
    {
        $fieldData = [];
        $request->fields->map(function($field) use(&$fieldData, $request){
            $fieldData[$field->slug] = [
                "title" => $field->title,
                "value" => $request->{$field->slug}
            ];
        });

        if(!isset($request->id)){
            $existRecord = BankRecord::where([
                "form_id"  => $request->form_id,
                "user_id"  => $request->user()->id,
                'access'   => $request->accessType->value
            ])->exists();
            if($existRecord) return failed(__("Already a bank exist"));
        }

        $save = BankRecord::updateOrCreate([
            "form_id"  => $request->form_id,
            "user_id"  => $request->user()->id,
        ],[
            "bank"     => json_encode($fieldData),
            "is_admin" => $request->user()->role == USER_ROLE_ADMIN,
            'access'   => $request->accessType->value
        ]);

        if($save) return success(__("Bank saved successfully"));
        return failed(__("Bank failed to save"));
    }

    /**
     * Summary of bankStatusChange
     * @param string $id
     * @return array{data: mixed, message: string, success: bool}
     */
    public function bankStatusChange(string $id): array
    {
        $bank = BankRecord::find($id);

        if (!$bank) return failed(__("Bank not found"));

        $bank->status = !$bank->status;
        $status = $bank->save();
        if($status) return success(__("Status updated successfully"));
        return failed(__("Status failed to update"));
    }

    /**
     * Summary of deleteBank
     * @param mixed $id
     * @return array{data: mixed, message: string, success: bool}
     */
    public function deleteBank($id): array
    {
        try{
            $bank = BankRecord::where(function($query){
                if(auth()->user()?->role == USER_ROLE_ADMIN)
                        return $query->where("is_admin", 1);
                return $query->where("user_id", auth()->user()?->id ?? 0);
            })->find($id);
            if(! $bank) return failed("Bank record not found");

            $update = $bank->delete();
            if($update) return success(__("Bank deleted successfully"));
            return failed(__("Bank failed to delete"));
        } catch (\Exception $e) {
            storeException("deleteBank",$e->getMessage());
            return failed(__("Failed to delete bank"));
        }
    }

    /**
     * Summary of getUserBankList
     * @return array{data: mixed, message: string, success: bool}
     */
    public function getUserBankList(): array
    {
        try{
            $id = auth()->id() ?? auth()->guard("api")->id() ?? 0;
            $banks = BankRecord::with("bank_form","bank_form.fields")
                ->where("user_id", $id)
                ->where("access", "LIKE", "%" . BankFormAccessType::USER->value . "%")
                ->get();

            $banks?->map(function ($bank) {
                $bankDetails = json_decode($bank->bank, true);

                if (
                    json_last_error() !== JSON_ERROR_NONE 
                    || !is_array($bankDetails)
                )   $bankDetails = [];

                $bank->bank = collect($bankDetails);
                $bank?->bank_form?->fields?->map(function($field) use($bankDetails){
                    $field->value = $bankDetails[$field->slug]["value"] ?? "N/A";
                });
            });

            return success(__("Bank list found successfully"), $banks);
        } catch (\Exception $e) {
            storeException("getUserBankList",$e->getMessage());
            return failed(__("Failed to find bank list"));
        }
    }

    /**
     * Summary of adminBankList
     * @return array{data: mixed, message: string, success: bool}
     */
    public function adminBankList(): array
    {
        try{
            $banks = BankRecord::with("bank_form","bank_form.fields")
                ->where("is_admin", STATUS_ACTIVE)
                ->whereStatus(STATUS_ACTIVE)->get();

            $banks?->map(function ($bank) {
                $bankDetails = json_decode($bank->bank, true);

                if (
                    json_last_error() !== JSON_ERROR_NONE 
                    || !is_array($bankDetails)
                )   $bankDetails = [];

                $bank->bank = collect($bankDetails);
                $bank?->bank_form?->fields?->map(function($field) use($bankDetails){
                    $field->value = $bankDetails[$field->slug]["value"] ?? "N/A";
                });
            });

            return success(__("Bank list found successfully"), $banks);
        } catch (\Exception $e) {
            storeException("adminBankList",$e->getMessage());
            return failed(__("Failed to find bank list"));
        }
    }

    /**
     * Summary of getForms
     * @param int $access
     * @return array{data: mixed, message: string, success: bool}
     */
    public function getFormsByAccess(int $access): array
    {
        try{
            $forms = BankForm::with(["fields" => function($query){
                    return $query->whereStatus(STATUS_ACTIVE);
                }])
                ->whereHas("fields")
                ->where("access", "LIKE", "%" . $access . "%")
                ->whereStatus(STATUS_ACTIVE)->get();

            return success(__("Forms found successfully"), $forms);
        } catch (\Exception $e) {
            storeException("BankService getForms",$e->getMessage());
            return failed(__("Failed to find forms"));
        }
    }
}