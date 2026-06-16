<?php

namespace App\Traits;

use Carbon\Carbon;

trait DateFormatTrait
{
    public function dateFormat($date)
    {
        if (empty($date)) {
            return '';
        }
        return Carbon::parse($date)->format('d M Y g:i:s A');
    }
}
