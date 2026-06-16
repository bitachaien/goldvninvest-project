<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\User;

class StakingInvestmentPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid',
        'user_id',
        'staking_investment_id',
        'wallet_id',
        'coin_type',
        'is_auto_renew',
        'total_investment',
        'total_bonus',
        'total_amount',
        'investment_status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
