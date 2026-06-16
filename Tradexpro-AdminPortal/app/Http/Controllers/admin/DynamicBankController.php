<?php

namespace App\Http\Controllers\admin;

use Exception;
use Illuminate\Http\Request;
use App\Facades\ResponseFacade;
use Illuminate\Http\JsonResponse;
use App\Model\DynamicBank\BankForm;
use App\Http\Controllers\Controller;
use App\Model\DynamicBank\BankRecord;
use App\Model\DynamicBank\BankFormField;
use Yajra\DataTables\Facades\DataTables;
use App\Services\BankService\IBankService;
use App\Http\Requests\Admin\BankFormRequest;
use App\Http\Requests\BankFormCompletionRequest;
use App\Http\Requests\Admin\BankFormFieldRequest;
use _PHPStan_d81cb77c9\OndraM\CiDetector\TrinaryLogic;
use App\Services\BankService\Enums\BankFormAccessType;
use App\Http\Requests\Admin\BankFormFieldStatusRequest;

class DynamicBankController extends Controller
{
    public function __construct(private IBankService $bankService){}

    /**
     * Summary of bankFormListPage
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function bankFormListPage(Request $request): mixed
    {
        if(IS_API_CALL){
            $query = BankForm::query();

            return DataTables::of($query)
                ->addColumn('status', function ($form) {
                    return $form->status ? 'Active' : 'Inactive';
                })
                ->editColumn('access', function ($form) {
                    $access = explode(",", $form->access ?? '');
                    $access = array_filter($access);
                    $access = array_map(fn($value) => BankFormAccessType::tryFrom($value)?->label() ?? '', $access);
                    $access = implode(", ", $access);
                    return $access;
                })
                ->addColumn('action', function ($form) {
                    return view('admin.bank_form.partials.actions', compact('form'))->render();
                })
                ->rawColumns(['action'])
                ->make(true);
        }
        $title = 'Bank Forms';
        return view('admin.bank_form.list', compact('title'));
    }

    /**
     * Summary of bankFormAddEditPage
     * @param string $id
     * @return JsonResponse
     */
    public function bankFormAddEditPage(string $id = null): JsonResponse
    {
        $form = BankForm::find($id ?? 0);
        if($form ) return response()->json(success($form));
        return response()->json(failed(__("Form not found")));
    }

    public function bankFormDelete(string $id = null): JsonResponse
    {
        BankForm::destroy($id ?? 0);
        return response()->json(['success' => true]);
    }

    public function bankFormFieldStatus(BankFormFieldStatusRequest $request): JsonResponse
    {
        $field = BankFormField::find($request->id ?? 0);
        if(!$field) return response()->json(failed(__("Field not found")));

        $update = $field->update(["status" => !!$request->status]);

        if($update)return response()->json(success(__("Status updated successfully")));
        return response()->json(failed(__("Status updated successfully")));
    }

    public function bankFormSubmit(BankFormRequest $request): JsonResponse
    {
        $access = is_array($request->access ?? '') ? implode(",", $request->access) : NULL;
        BankForm::updateOrCreate(
            ['id' => $request->id],
            [
                'title' => $request->title,
                'status' => $request->status,
                'access' => $access
            ]
        );

        return response()->json(success());
    }

    public function bankFormFieldList(string $form_id = null): mixed
    {
        if(!$form = BankForm::find($form_id ?? 0))
            return ResponseFacade::failed(__("Form not found"))->send();

        if(IS_API_CALL){
            $query = BankFormField::where('form_id', $form->id);

            return DataTables::of($query)
                ->addColumn('required', function($field){
                    return $field->required ? 'Yes' : 'No';
                })
                ->editColumn('status', function($field){
                    return view('admin.bank_form.partials.field-switch', compact('field'))->render();
                })
                ->addColumn('action', function($field){
                    return view('admin.bank_form.partials.field-actions', compact('field'))->render();
                })
                ->rawColumns(['status','action']) 
                ->make(true);
        }

        $title = $form->title;
        return view('admin.bank_form.fields', compact('title', 'form'));
    }

    /**
     * Summary of bankFormAddEditPage
     * @param string $id
     * @return JsonResponse
     */
    public function bankFormFieldAddEdit(string $id = null): JsonResponse
    {
        $formField = BankFormField::find($id ?? 0);
        if($formField) return response()->json(success($formField));
        return response()->json(failed(__("Field not found")));
    }

    public function bankFormFieldSubmit(BankFormFieldRequest $request): JsonResponse
    {
        try{
            $newData = [];
            $fieldId = $request->id ?? 0;
            $form = BankForm::find($request->form_id);
            if(!$form) return response()->json(failed(__("Bank form not found")));

            $slug = make_unique_slug($request->title);
            if(!$fieldId) $newData = [
                "slug"    => $slug,
                "title" => $request->title,
            ];

            $existRecord = BankFormField::where([
                "form_id"  => $request->form_id,
                "slug"     => $slug,
            ])->exists();
            if($existRecord) return response()->json(failed(__("Bank field already exist")));

            $field = BankFormField::updateOrCreate([
                "form_id" => $request->form_id,
                "id"      => $fieldId
            ],[
                ...$newData,
                "data_type" => $request->data_type,
                "status" => $request->status,
                "required" => !!($request->required ?? false)
            ]);
            return response()->json(success(__("Bank form field created successfully"), $field));
        } catch (Exception $e){
            logger($e->getMessage());
            return response()->json(failed(__("Bank form field creation failed")));
        }
    }
    public function bankFormFieldDelete(string $id): JsonResponse
    {
        $field = BankFormField::find($id);
        if(!$field) return response()->json(failed(__("Field not found")));

        if($field->delete())return response()->json(success(__("Field deleted successfully")));
        return response()->json(failed(__("Failed to delete")));
    }

    public function bankRecordListPage(): mixed
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

        } catch (Exception $e) {
            storeException("adminBankList", $e->getMessage());
            return ResponseFacade::failed(__("Something went wrong"))->send();
        }
    }
    public function bankRecordAdd(): mixed
    {
        $data['title'] = __('Add New Bank');
        $data['button_title'] = __('Save');
        $data['forms'] = BankForm::where("access", "LIKE", "%" . BankFormAccessType::ADMIN->value . "%")->whereStatus(STATUS_ACTIVE)->get();

        if ($data["forms"]->isEmpty())
            return ResponseFacade::failed(__("Bank forms not found"))->send();

        $data['fields'] = BankFormField::where('form_id', $data['forms'][0]->id)->get();
        return view('admin.admin-bank.addEdit', $data);
    }

    public function bankRecordEdit(string $id)
    {
        $data['title'] = __('Update Bank');

        $response = $this->bankService->getBank($id);
        if ($response['success'] == true) {
            $bank   = $response['data'];
            $fields = $bank?->bank_form?->fields ?? collect();
            $data["item"] = $bank;
            $data["fields"] = $fields;

            return view('admin.admin-bank.addEdit', $data);
        } else {
            return redirect()->back()->with("dismiss", __('Bank not found!'));
        }
    }
    public function bankRecordSave(BankFormCompletionRequest $request): mixed
    {
        $response = $this->bankService->saveBank($request);
        return ResponseFacade::result($response)->redirect_next("bank.form.record.list.page")->send();
    }

    public function bankRecordDelete($id)
    {
        $response = $this->bankService->deleteBank($id);
        return ResponseFacade::result($response)->send();
    }

    public function bankRecordStatus(Request $request): mixed
    {
        $response = $this->bankService->bankStatusChange($request->bank_id ?? 0);
        return ResponseFacade::result($response)->send();
    }

    public function bankFormChange(Request $request)
    {
        $form = BankForm::find($request->id ?? 0);
        if (!$form) return response()->json(failed(__("Form not found")));

        $fields = BankFormField::where('form_id', $form->id)->get();
        if ($fields->isEmpty()) return response()->json(failed(__("Form has no field")));

        $data['html'] = view("admin.admin-bank.include.field", compact("fields"))->render();
        return response()->json(success(__("Form fields render successfully"), $data));
    }
}
