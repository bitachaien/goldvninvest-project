<?php

namespace App\Exceptions;

use Exception;

class ParallelSocketCreateException extends Exception
{
    protected $message = __("Parallel Socket Not Created");
}
