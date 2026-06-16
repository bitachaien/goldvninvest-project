<?php

namespace App\Http\Requests\Admin;

use App\Facades\ResponseFacade;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class CoinPaymentVersionUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()?->role == USER_ROLE_ADMIN;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "version" => "required",
            "password"=> "required",
            "code"    => adminGoogleAuthEnabled() ? "required" : "string",
        ];
    }

        /**
     * Return validation error custom message
     * @return array<string, mixed>
     */
    public function messages(): array
    {
        return [
            "version.required" => __("Password is required"),
            "password.required" => __("Password is required"),
            "code.required" => __("Google authentication code is required"),
            "code.string" => __("Google authentication code is invalid"),
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        $error = $validator->errors()->all()[0];
        ResponseFacade::failed($error)->throw();
    }
}
