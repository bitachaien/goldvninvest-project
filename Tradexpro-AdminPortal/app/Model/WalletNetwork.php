<?php

namespace App\Model;

use App\Model\Coin;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WalletNetwork extends Model
{
    use HasFactory;

    const ACTIVE = 1;
    const INACTIVE = 2;
    const EXPIRE = 99;

    protected $fillable = [
        'wallet_id',
        'coin_id',
        'address',
        'network_type',
        'status',
        'coin_payment_wallet_id',
        'rented_till'
    ];
    public function wallet()
    {
        return $this->hasOne(Wallet::class, 'id', 'wallet_id');
    }

    public function coin()
    {
        return $this->belongsTo(Coin::class,'coin_id');
    }
}
