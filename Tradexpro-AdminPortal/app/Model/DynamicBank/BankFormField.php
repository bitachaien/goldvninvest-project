<?php

namespace App\Model\DynamicBank;

use Illuminate\Database\Eloquent\Model;
use App\Services\BankService\Enums\BankFormFieldType;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BankFormField extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'data_type',
        'status',
        'required',
        'form_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'data_type' => BankFormFieldType::class,
    ];
}
