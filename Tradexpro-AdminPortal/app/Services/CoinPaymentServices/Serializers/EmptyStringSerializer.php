<?php

namespace App\Services\CoinPaymentServices\Serializers;

use JMS\Serializer\Context;
use JMS\Serializer\GraphNavigatorInterface;
use JMS\Serializer\JsonDeserializationVisitor;
use JMS\Serializer\Handler\SubscribingHandlerInterface;
use App\Services\CoinPaymentServices\Responses\WithdrawalResponse\WithdrawalConfirmationResponse;

class EmptyStringSerializer implements SubscribingHandlerInterface
{
    public static function getSubscribingMethods()
    {
        return [
            [
                'direction' => GraphNavigatorInterface::DIRECTION_DESERIALIZATION,
                'format' => 'json',
                'type' => 'empty_string',
                'method' => 'deserialize',
            ],
        ];
    }

    public function deserialize(JsonDeserializationVisitor $visitor, $data, array $type, Context $context): WithdrawalConfirmationResponse
    {
        return new WithdrawalConfirmationResponse();
    }
}