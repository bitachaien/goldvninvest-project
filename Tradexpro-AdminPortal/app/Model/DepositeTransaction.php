<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class DepositeTransaction extends Model
{
    const PENDING = 0;
    const PROCESSING = 5;
    const SUCCESS = 1;
    const REJECTED = 2;
    const FAILED = 3;
    const EXPIRE = 99;

    const STATUS_TEXT = [
        self::PENDING => 'Pending',
        self::PROCESSING => 'Processing',
        self::SUCCESS => 'Success',
        self::REJECTED => 'Rejected',
        self::FAILED => 'Failed',
    ];

    protected $fillable = [
        'address',
        'fees',
        'sender_wallet_id',
        'receiver_wallet_id',
        'address_type',
        'coin_type',
        'amount',
        'btc',
        'doller',
        'transaction_id',
        'status',
        'confirmations',
        'from_address',
        'updated_by',
        'network',
        'network_type',
        'is_admin_receive',
        'received_amount',
        'reject_note'
    ];

    public function coin()
    {
        return $this->belongsTo(Coin::class, 'coin_type', 'coin_type');
    }
    public function senderWallet()
    {
        return $this->belongsTo(Wallet::class, 'sender_wallet_id', 'id');
    }
    public function receiverWallet()
    {
        return $this->belongsTo(Wallet::class, 'receiver_wallet_id', 'id');
    }
}
