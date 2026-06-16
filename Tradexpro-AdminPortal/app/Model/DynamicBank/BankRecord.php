<?php

namespace App\Model\DynamicBank;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BankRecord extends Model
{
    use HasFactory;
    protected $fillable = [
        "form_id",
        "user_id",
        "access",
        "bank",
        "status",
        "is_admin",
    ];

    public function bank_form(): BelongsTo
    {
        return $this->belongsTo(BankForm::class, "form_id");
    }
}
