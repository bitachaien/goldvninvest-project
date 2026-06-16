<?php

namespace App\Http\Requests\Admin;

use App\Facades\ResponseFacade;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class BankFormRequest extends FormRequest
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
     * @return array<string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:80',
            'status' => 'required|integer|in:0,1',
            'id' => 'nullable|integer'
        ];
    }

    /**
     * Return validation error custom message
     * @return array<string, mixed>
     */
    public function messages(): array
    {
        return [
            'title.required' => __("Form title is required"),
            'title.string'   => __("Form title is invalid"),
            'title.max'      => __("Form title max length 80"),

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
