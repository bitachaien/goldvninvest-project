<?php

namespace App\Http\Requests\Admin\Settings;

use App\Facades\ResponseFacade;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class CoinPaymentV2Request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->role == USER_ROLE_ADMIN;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'COIN_PAYMENT_V2_CLIENT_ID' => 'required',
            'COIN_PAYMENT_V2_SECRET_ID' => 'required',
        ];
    }

        /**
     * Return validation error custom message
     * @return array<string, mixed>
     */
    public function messages(): array
    {
        return [
            'COIN_PAYMENT_V2_CLIENT_ID.required' => __("Coin payment client id field is required"),
            'COIN_PAYMENT_V2_SECRET_ID.required' => __("Coin payment secret id field is required"),
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        $error = $validator->errors()->all()[0];
        ResponseFacade::failed($error)->throw();
    }
}
