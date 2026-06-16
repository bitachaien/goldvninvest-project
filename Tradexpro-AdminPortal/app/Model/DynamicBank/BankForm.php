<?php

namespace App\Model\DynamicBank;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BankForm extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'access', 'status'];

    public function fields(): HasMany
    {
        return $this->hasMany(BankFormField::class, "form_id");
    }
}
