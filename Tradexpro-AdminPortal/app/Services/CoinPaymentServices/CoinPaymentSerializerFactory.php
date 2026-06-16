<?php

namespace App\Services\CoinPaymentServices;

use JMS\Serializer\SerializerBuilder;
use JMS\Serializer\Handler\HandlerRegistry;
use App\Services\CoinPaymentServices\Serializers\TimestampHandler;
use App\Services\CoinPaymentServices\Serializers\WalletsSerializer;
use App\Services\CoinPaymentServices\Serializers\EmptyStringSerializer;

class CoinPaymentSerializerFactory
{
    public function build()
    {
        $builder = SerializerBuilder::create()
            ->addDefaultHandlers()
            ->configureHandlers(function(HandlerRegistry $registry) {
                $registry->registerSubscribingHandler(new WalletsSerializer());
                $registry->registerSubscribingHandler(new TimestampHandler());
                $registry->registerSubscribingHandler(new EmptyStringSerializer());
            });
        return $builder->build();
    }
}