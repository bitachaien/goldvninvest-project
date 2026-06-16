<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class WalletAddressHistory extends Model
{
    const ACTIVE = 1;
    const INACTIVE = 2;
    const EXPIRE = 99;

    const STATUS_TEXT = [
        self::ACTIVE => 'Active',
        self::INACTIVE => 'Inactive',
        self::EXPIRE => 'Expired',
    ];

    protected $fillable = ['wallet_id', 'user_id', 'network', 'address', 'coin_type', 'wallet_key', 'public_key', 'memo', 'status', 'coin_payment_wallet_id','rented_till'];

    public function wallet()
    {
        return $this->hasOne(Wallet::class, 'id', 'wallet_id');
    }
}
