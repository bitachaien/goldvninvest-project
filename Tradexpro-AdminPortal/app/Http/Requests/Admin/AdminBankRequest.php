<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminBankRequest extends FormRequest
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
            'account_holder_name' => 'required',
            'bank_name' => 'required',
            'country_code' => 'required',
            'swift_code' => 'required',
            'iban' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'account_holder_name.required' => __('Account holder name is required'),
            'bank_name.required' => __('Bank name is required'),
            'country_code.required' => __('Country is required'),
            'swift_code.required' => __('Swift code is required'),
            'iban.required' => __('IBAN is required'),
        ];
    }
}
