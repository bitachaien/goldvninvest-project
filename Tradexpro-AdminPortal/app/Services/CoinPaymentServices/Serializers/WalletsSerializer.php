<?php

namespace App\Services\CoinPaymentServices\Serializers;

use JMS\Serializer\Context;
use JMS\Serializer\GraphNavigatorInterface;
use JMS\Serializer\JsonDeserializationVisitor;
use JMS\Serializer\Handler\SubscribingHandlerInterface;

class WalletsSerializer implements SubscribingHandlerInterface
{
    public static function getSubscribingMethods()
    {
        return [
            [
                'direction' => GraphNavigatorInterface::DIRECTION_DESERIALIZATION,
                'format' => 'json',
                'type' => 'Wallets_type',
                'method' => 'deserialize',
            ],
        ];
    }

    public function deserialize(JsonDeserializationVisitor $visitor, $data, array $type, Context $context): array
    {
        $items = is_string($data) ? json_decode($data, true) : $data;

        if (!is_array($items)) {
            throw new \RuntimeException('Expected array data for WalletsType');
        }

        return $items;
    }
}