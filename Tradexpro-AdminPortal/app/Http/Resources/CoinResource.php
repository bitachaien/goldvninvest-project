<?php

namespace App\Http\Resources;

use App\Model\Coin;
use App\Traits\NumberFormatTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class CoinResource extends JsonResource
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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'coin_type' => $this->coin_type,
            'coin_icon' => $this->coin_icon ?  show_image_path($this->coin_icon, 'coin/') : '',
            'network' => $this->network,
            'network_name' => api_settings_new($this->network),
            'coin_price' => $this->truncateNum($this->coin_price),
        ];
    }
}
