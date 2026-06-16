<?php

namespace App\Http\Resources;

use App\Http\Repositories\CoinSettingRepository;
use App\Traits\NumberFormatTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class DepositTransactionResource extends JsonResource
{
    use NumberFormatTrait;

    public function toArray($request)
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'address' => $this->address,
            'fees' => $this->truncateNum($this->address),
            'sender_wallet_id' => $this->sender_wallet_id,
            'receiver_wallet_id' => $this->receiver_wallet_id,
            'address_type' => $this->address_type,
            'coin_type' => $this->coin_type,
            'network_name' => (new CoinSettingRepository())->getNetworkName($this->coin->id, $this->network),
            'network' => api_settings($this->network),
            'amount' => $this->truncateNum($this->amount),
            'txId' => $this->transaction_id,
            'status' => $this->status,
            'confirmations' => $this->confirmations,
            'from_address' => $this->from_address,
            'updated_by' => $this->updated_by,
            'network_type' => $this->network_type,
            'is_admin_receive' => $this->is_admin_receive,
            'received_amount' => $this->truncateNum($this->received_amount),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
