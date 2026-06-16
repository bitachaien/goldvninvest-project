<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepositRequest extends FormRequest
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
        $rules = [
            'coin_id' => 'required|exists:coins,id',
            'network_id' => 'required|numeric',
            'trx_id' => 'required',
            'type' => 'required|numeric'
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'coin_id.required' => __('Coin is required'),
            'coin_id.exists' => __('Coin not found'),
            'network_id.required' => __('Network is required'),
            'network_id.numeric' => __('Network is invalid'),
            'trx_id.required' => __('Transaction Id is required'),
        ];
    }
}
