<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Exceptions\HttpResponseException as Exception;

class HttpResponseException extends Exception
{
    /**
     * Create a new HTTP response exception instance.
     *
     * @param  mixed  $response
     * @return void
     */
    // v\Symfony\Component\HttpFoundation\Response
    public function __construct(string $message, Response $response)
    {
        $actualFileIndex = match(true){
            $response instanceof RedirectResponse => 3,
            $response instanceof JsonResponse     => 2,
            default => 2
        };

        $traceDetails = $this->getTrace()[$actualFileIndex] ?? [];
        $file = $traceDetails['file'] ?? "";
        $line = $traceDetails['line'] ?? 0 ;

        storeLog("$file -> $line -> $message", 'error');
        parent::__construct($response);
    }
}
