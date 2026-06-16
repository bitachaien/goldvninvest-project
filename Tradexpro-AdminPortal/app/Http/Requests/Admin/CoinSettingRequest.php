<?php

namespace App\Http\Requests\Admin;

use App\Model\Coin;
use Illuminate\Foundation\Http\FormRequest;

class CoinSettingRequest extends FormRequest
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
            'coin_id' => 'required',
        ];

        if (!isset($this->coin_id)) {
            return $rules;
        }

        $coin = Coin::find(decrypt($this->coin_id));
        if (!$coin) {
            return $rules;
        }

        switch ($coin->network) {
            case BITGO_API:
                $rules += [
                    'bitgo_wallet_id' => 'required|max:255',
                    'bitgo_wallet' => 'required|max:255',
                    'chain' => 'required|integer'
                ];
                break;

            case BITCOIN_API:
                $rules += [
                    'coin_api_user' => 'required|max:255',
                    'coin_api_pass' => 'required|max:255',
                    'coin_api_host' => 'required|max:255',
                    'coin_api_port' => 'required|max:255'
                ];
                break;

            case ERC20_TOKEN:
                $rules += [
                    'network_name' => 'required|min:3|max:50',
                ];
                break;

            case TRC20_TOKEN:
                $rules += [
                    'network_name' => 'required|min:3|max:50',
                ];
                break;
        }
        return $rules;
    }
}
