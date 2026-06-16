<?php

namespace App\Http\Controllers\Api\User;

use Illuminate\Http\Request;
use App\Facades\ResponseFacade;
use App\Http\Controllers\Controller;
use App\Services\BankService\IBankService;
use App\Http\Requests\BankFormCompletionRequest;
use App\Http\Services\UserBankService as userBankService;

class UserBankController
{
    protected $service ;
    public function __construct(private IBankService $bankService){
        $this->service = new userBankService();
    }

    public function UserbankGet(Request $request){
        $response = $this->service->getUserBank($request->id ?? null);
        return response()->json($response);
    }

    public function UserBankSave(Request $request){
        $response = $this->service->SaveUserBank($request);
        return response()->json($response);
    }

    public function UserBankDelete(Request $request){
        if(isset($request->id))
            $response = $this->service->DeleteUserBank($request->id);
        else
            return response()->json(['success' => false, 'message' =>__('Bank id not found')]);
        return response()->json($response);
    }

    public function getBankList(Request $request): mixed
    {
        $response = $this->bankService->getUserBankList();
        return ResponseFacade::result($response)->send();
    }

    public function userBankAddEdit(BankFormCompletionRequest $request): mixed
    {
        $response = $this->bankService->saveBank($request);
        return ResponseFacade::result($response)->send();
    }

    public function userBankDestroy(int $id): mixed
    {
        $response = $this->bankService->deleteBank($id);
        return ResponseFacade::result($response)->send();
    }
    public function getUserBank(int $id): mixed
    {
        $response = $this->bankService->getBank($id);
        return ResponseFacade::result($response)->send();
    }

    public function adminBankList(): mixed
    {
        $response = $this->bankService->adminBankList();
        return ResponseFacade::result($response)->send();
    }
}
