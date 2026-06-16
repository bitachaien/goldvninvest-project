<?php
namespace App\Http\Services;


use App\Facades\ResponseFacade;
use App\Model\Bank;
use App\Http\Repositories\BankRepository;
use App\Model\DynamicBank\BankRecord;

class BankService extends BaseService
{
    public $model = Bank::class;
    public $repository = BankRepository::class;

    public function __construct()
    {
        parent::__construct($this->model,$this->repository);
    }

    public function getBanks()
    {
        return $this->object->getBanksData();
    }

    public function saveBank($request)
    {
        try{
            $data = [
                'account_holder_name' => $request->account_holder_name,
                'account_holder_address' => $request->account_holder_address,
                'bank_name' => $request->bank_name,
                'bank_address' => $request->bank_address,
                'country' => $request->country_code,
                'swift_code' => $request->swift_code,
                'iban' => $request->iban,
                'note' => $request->note,
                'status' => isset($request->status) ? true : false,
            ];

            if(isset($request->id)){
                
                $data['id'] =  $request->id;
                $this->object->saveBank($data);
                $response = ['success' => true, 'message' => __('Bank updated successfully!')];

            }else{
                $this->object->saveBank($data);
                $response = ['success' => true, 'message' => __('Bank created successfully!')];
            }
            
        } catch (\Exception $e) {
            $response = ['success' => false, 'message' => __('Something went wrong')];
            storeException("saveBank",$e->getMessage());
        }

        return $response;
    }

    public function statusChange($request)
    {
        try{

            $data = [
                'bank_id' => $request->bank_id
            ];

            $status = $this->object->statusChange($data);

            if($status)
            {
                $response = ['success' => true, 'message' => __('Bank status updated successfully!')];
            }else {
                $response = ['success' => false, 'message' => __('Bank status is not updated!')];
            }
            
        } catch (\Exception $e) {
            $response = ['success' => false, 'message' => __('Something went wrong')];
            storeException("statusChange",$e->getMessage());
        }

        return $response;
    }

    public function deleteBank($id)
    {
        try{
            $bank = BankRecord::find($id);
            if(! $bank) return failed("Bank record not found");

            $update = $bank->delete();
            if($update) return success(__("Bank deleted successfully"), $bank);
            return failed(__("Bank failed to delete"));
        } catch (\Exception $e) {
            storeException("deleteBank",$e->getMessage());
            return failed(__("Failed to delete bank"));
        }
    }

    public function getBank($id)
    {  
        try{
            $bank = BankRecord::with("bank_form","bank_form.fields")->find($id);
            if($bank) return success(__("Bank found successfully"), $bank);
            return failed(__("Bank not found"));
        } catch (\Exception $e) {
            storeException("getBank",$e->getMessage());
            return failed(__("Failed to find bank"));
        }
    }
}
