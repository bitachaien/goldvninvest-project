<?php

namespace App\Services\CoinPaymentServices\Enums;

enum HttpRequestPayloadType: string
{
    case JSON  = 'json';
    case QUERY = 'query';
    case FORM = 'form_params';
    case BODY = 'body';

    public function createPayload(array $parameters): string
    {
        return match($this){
            self::JSON => json_encode($parameters),
            self::QUERY, self::FORM , self::BODY => http_build_query($parameters)
        };
    }

    public function getHttpOptionPayload(array $parameters)
    {
        $params = match($this){
            self::BODY => json_encode($parameters),
            default    => $parameters
        };

        return [$this->value => $params];
    }
}