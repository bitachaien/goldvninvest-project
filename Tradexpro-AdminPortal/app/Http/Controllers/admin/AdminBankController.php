<?php

namespace App\Http\Controllers\admin;

use App\Model\DynamicBank\BankRecord;
use Illuminate\Http\Request;
use App\Facades\ResponseFacade;
use App\Http\Services\BankService;
use App\Model\DynamicBank\BankForm;
use App\Http\Controllers\Controller;
use App\Http\Services\CountryService;
use App\Model\DynamicBank\BankFormField;
use App\Http\Requests\Admin\AdminBankRequest;
use App\Http\Requests\BankFormCompletionRequest;
use App\Services\BankService\BankService as BankRecordService;

class AdminBankController extends Controller
{
    private $bankService;

    public function __construct()
    {
        $this->bankService = new BankService();
        $this->countryService = new CountryService();
    }


    public function bankList()
    {
        try {
            if(IS_API_CALL){
                $banks = BankRecord::with(["bank_form",])->where('is_admin', STATUS_ACTIVE);
                return datatables()->of($banks)
                ->addColumn("bank_title", function($bank){
                    return $bank->bank_form->title;
                })
                ->editColumn("country", function($bank){
                    return isset($bank->getCountry) ? $bank->getCountry->value :'N/A';
                })
                ->editColumn("status", function($bank){
                    $field = $bank;
                    return view('admin.bank_form.partials.switch', compact('field'))->render();
                })
                ->editColumn("action", function($bank){
                    return view('admin.admin-bank.include.action', compact('bank'))->render();
                })
                ->rawColumns(["status", "action"])
                ->make();
            }
            $data['title'] = __('Bank List');
            return view('admin.admin-bank.list', $data);

        } catch (\Exception $e) {
            storeException("adminBankList", $e->getMessage());
        }
    }

    public function bankAdd()
    {
        $data['title'] = __('Add New Bank');
        $data['button_title'] = __('Save');
        $data['forms'] = BankForm::whereStatus(STATUS_ACTIVE)->get();

        if ($data["forms"]->isEmpty())
            return ResponseFacade::failed(__("Bank forms not found"))->send();

        $data['fields'] = BankFormField::where('form_id', $data['forms'][0]->id)->get();
        $data['countries'] = $this->countryService->getActiveCountries();

        return view('admin.admin-bank.addEdit', $data);
    }

    public function bankSave(BankFormCompletionRequest $request)
    {
        $service = new BankRecordService();
        $response = $service->saveBank($request);

        if ($response['success'] == true) {
            return redirect()->route('adminBankList')->with(['success' => $response['message']]);
        } else {
            return redirect()->back()->with(['dismiss' => $response['message']]);
        }
    }


    public function bankEdit($id)
    {
        $data['title'] = __('Update Bank');

        $response = $this->bankService->getBank($id);
        if ($response['success'] == true) {
            $bank   = $response['data'];
            $fields = $bank?->bank_form?->fields ?? [];
            $bankDetails = json_decode($bank->bank, true);
            $fields->map(function($field) use($bankDetails){
                $field->value = $bankDetails[$field->slug]["value"] ?? "N/A";
            });
            $data["item"] = $bank;
            $data["fields"] = $fields;

            return view('admin.admin-bank.addEdit', $data);
        } else {
            return redirect()->back()->with("dismiss", __('Bank not found!'));
        }

    }

    public function bankDelete($id)
    {
        $response = $this->bankService->deleteBank($id);
        return ResponseFacade::result($response)->send();
    }

    public function bankStatusChange(Request $request)
    {
        $service = new BankRecordService();
        $response = $service->bankStatusChange($request->bank_id ?? 0);

        return response()->json($response);
    }

    public function bankFormChange(Request $request)
    {
        $form = BankForm::find($request->id ?? 0);
        if (!$form)
            return response()->json(failed(__("Form not found")));

        $fields = BankFormField::where('form_id', $form->id)->get();

        if ($fields->isEmpty())
            return response()->json(failed(__("Form has no field")));

        $data['html'] = view("admin.admin-bank.include.field", compact("fields"))->render();

        return response()->json(success(__("Form fields render successfully"), $data));
    }
}
