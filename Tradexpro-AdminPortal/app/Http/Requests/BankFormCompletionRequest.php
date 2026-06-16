<?php

namespace App\Http\Requests;

use App\Facades\ResponseFacade;
use App\Enums\FormFieldStatusEnum;
use App\Services\BankService\Enums\BankFormAccessType;
use Illuminate\Support\Collection;
use App\Model\DynamicBank\BankForm;
use App\Model\DynamicBank\BankFormField;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use App\Services\BankService\Enums\BankFormFieldType;

class BankFormCompletionRequest extends FormRequest
{
    public ?BankForm $form;
    public Collection $fields;
    private array $message = [];
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
        if(! IS_API_CALL) $this->flash();
        $form_id    = $this->form_id ?? 0;
        $this->form = BankForm::find($form_id);
        if(!$this->form) ResponseFacade::failed(__("Form not found"))->safeThrow();

        $accessType = $this->access_type ?? 0;
        $this->accessType = BankFormAccessType::tryFrom($accessType);
        if(! $accessType) ResponseFacade::failed(__("Bank access type is invalid"))->safeThrow();

        /** @var Collection $fields */
        $this->fields  = BankFormField::where("form_id", $this->form->id)->whereStatus(FormFieldStatusEnum::Active->value)->get();
        if($this->fields->isEmpty()) ResponseFacade::failed(__("Form Fields not found"))->safeThrow();

        $rules = [];
        foreach($this->fields as $field){
            $rule = "";
            if($field->required) {
                $rule .= "required ";
                $this->message["$field->slug.required"] = __(":title field is required", ["title" => $field->title]);
            }

            $_rule = match($field->data_type){
                BankFormFieldType::TEXT => "string",
                BankFormFieldType::NUMBER => "numeric",
                BankFormFieldType::EMAIL => "email",
                BankFormFieldType::TEXTAREA => "string",
                BankFormFieldType::DATE => "date",
                default => ""
            };

            $rule .= "$_rule nullable";
            $this->message["$field->slug.$_rule"] = __(":title field is invalid", ["title" => $field->title]);
            $rules[$field->slug] = str_replace(" ","|",$rule);
        }
        return $rules;
    }

    /**
     * Return validation error custom message
     * @return array<string, mixed>
     */
    public function messages(): array
    {
        return $this->message;
    }

    protected function failedValidation(Validator $validator)
    {
        $error = $validator->errors()->all()[0];
        ResponseFacade::failed($error)->throw();
    }
}
