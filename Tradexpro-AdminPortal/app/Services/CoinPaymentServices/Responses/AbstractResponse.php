<?php
declare(strict_types=1);

namespace App\Services\CoinPaymentServices\Responses;

use JMS\Serializer\Annotation\Type;
use App\Services\CoinPaymentServices\Response;

abstract class AbstractResponse implements Response
{
    #[Type("integer")]
    public int $status = 200;
    #[Type("string")]
    public ?string $detail = null;

    public function hasErrors(): bool
    {
        return !in_array($this->status, [200, 202]);
    }
}
