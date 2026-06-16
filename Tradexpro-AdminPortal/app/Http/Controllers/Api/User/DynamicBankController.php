<?php

namespace App\Http\Controllers\Api\User;

use Illuminate\Http\Request;
use App\Facades\ResponseFacade;
use App\Http\Controllers\Controller;
use App\Services\BankService\IBankService;

class DynamicBankController extends Controller
{
    public function __construct(
        private IBankService $bankService
    ){}

    public function getUserBankForm()
    {
        $response = $this->bankService->getUserForms();
        return ResponseFacade::result($response)->send();
    }

    public function getBankFormFields(int $id)
    {
        $response = $this->bankService->getFormFields($id);
        return ResponseFacade::result($response)->send();
    }
}
