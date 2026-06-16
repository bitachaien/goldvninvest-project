<?php

namespace App\Http\Requests\Admin;

use App\Facades\ResponseFacade;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class BankFormFieldRequest extends FormRequest
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
     * @return string[]
     */
    public function rules(): array
    {
        return [
            'title' => 'required_without:id|string|max:80',
            'data_type' => 'required|string',
            'status' => 'required|integer|in:0,1',
            'form_id' => 'required|integer',
            'id' => 'nullable|integer',
        ];
    }

    /**
     * Return validation error custom message
     * @return array<string, mixed>
     */
    public function messages(): array
    {
        return [
            'data_type.required' => __("Field data type is required"),
            'data_type.string'   => __("Field data type is invalid"),

            'title.required_without' => __("Field title is required"),
            'title.string'   => __("Field title is invalid"),
            'title.max'      => __("Field title max length 80"),

            'form_id.required' => __("Form status is required"),
            'form_id.integer'  => __("Form status is invalid"),

            'status.required' => __("Form status is required"),
            'status.integer'  => __("Form status is invalid"),
            'status.in'       => __("Form status is invalid"),

            'id.integer'  => __("Form id is invalid"),
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        $error = $validator->errors()->all()[0];
        ResponseFacade::failed($error)->throw();
    }
}
