<?php

namespace App\Http\Requests\Api\User;

use App\Facades\ResponseFacade;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class UpdateProfileImageRequest extends FormRequest
{
    private int $file_size;
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $this->file_size = ($GLOBALS['ADMIN_SETTINGS_ARRAY']['upload_max_size'] ?? 2) * 1024;
        return $this->user()->role == USER_ROLE_USER;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        $rules['photo'] = "required|image|mimes:jpg,png,jpeg,JPG,PNG,webp|max:$this->file_size";
        return $rules;
    }

    /**
     * Return validation error custom message
     * @return array<string, mixed>
     */
    public function messages(): array
    {
        return [
            "photo.required" => __("Profile image is required"),
            "photo.image" => __("Profile image is invalid"),
            "photo.mimes" => __("Profile image support jpg,png,jpeg,JPG,PNG,webp"),
            "photo.max"   => __("Profile image maximum size is :file_size",[ "file_size" => $this->file_size]),
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        $error = $validator->errors()->all()[0];
        ResponseFacade::failed($error)->throw();
    }
}
