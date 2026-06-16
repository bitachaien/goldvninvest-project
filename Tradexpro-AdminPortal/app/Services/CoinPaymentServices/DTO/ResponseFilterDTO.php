<?php

namespace App\Services\CoinPaymentServices\DTO;

use Psr\Http\Message\ResponseInterface;

class ResponseFilterDTO
{
    /**
     * Check This Filter Pass Or Fail
     * @var bool $pass
     */
    private $pass = false;

    /**
     * Return Value As Response
     * @var mixed
     */
    private mixed $returnResponse = null;

    public function __construct(
        /**
         * Guzzle Http Request Return Intense
         * @var ResponseInterface
         */
        public ResponseInterface $response,

        /**
         * Expected Return Type Of Response
         * @var mixed
         */
        public mixed $returnTypePayload
    ){}

    /**
     * Mark This Filter As Passed
     * @return void
     */
    public function passed(): void
    {
        $this->pass = true;
    }

    /**
     * Return This Filter Passed Or Failed
     * @return void
     */
    public function is_passed(): bool
    {
        return $this->pass;
    }

    /**
     * Set Return Value As Response
     * @param mixed $response
     * @return void
     */
    public function setReturnResponse(mixed $response): void
    {
        $this->returnResponse = $response;
    }

    /**
     * Get Return Response
     * @return mixed
     */
    public function getResponse(): mixed
    {
        return $this->returnResponse;
    }
}