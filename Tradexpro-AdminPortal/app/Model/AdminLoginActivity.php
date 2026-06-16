<?php

namespace App\Model;

use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdminLoginActivity extends Model
{
    use HasFactory;
    protected $fillable = [
        'admin_id',
        'ip_address',
        'device',
        'browser',
        'os',
        'login_at',
        'user_agent',
        'location',
    ];

    protected $casts = [
        'login_at' => 'datetime',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
