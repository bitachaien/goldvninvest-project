<?php

namespace App\Http\Requests\Admin;

use App\Facades\ResponseFacade;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class BankFormFieldStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "id"     => "required",
            "status" => "required",
        ];
    }

        /**
     * Return validation error custom message
     * @return array<string, mixed>
     */
    public function messages(): array
    {
        return [
            "id.required" => __("Field id is required"),
            "status.required" => __("Field status is required"),
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        $error = $validator->errors()->all()[0];
        ResponseFacade::failed($error)->throw();
    }
}
