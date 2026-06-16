<?php

namespace App\Http\Resources;

use App\Model\Coin;
use App\Traits\NumberFormatTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletResource extends JsonResource
{
    use NumberFormatTrait;
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        $coin = Coin::where('coin_type', $this->coin_type)->first();
        return [
            'id' => $this->id,
            'coin_type' => $this->coin_type,
            'balance' => $this->truncateNum($this->balance),
            'coin_icon' => @$coin->coin_icon ?  show_image_path($coin->coin_icon, 'coin/') : ''
        ];
    }
}
