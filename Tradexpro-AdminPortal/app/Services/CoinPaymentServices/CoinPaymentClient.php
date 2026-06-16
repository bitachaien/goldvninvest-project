<?php

namespace App\Services\CoinPaymentServices;

use Illuminate\Support\Carbon;
use Illuminate\Pipeline\Pipeline;
use JMS\Serializer\SerializerInterface;
use GuzzleHttp\ClientInterface as HttpClient;
use App\Services\CoinPaymentServices\Enums\HttpMethod;
use App\Services\CoinPaymentServices\DTO\ResponseFilterDTO;
use App\Services\CoinPaymentServices\Enums\HttpRequestPayloadType;
use App\Services\CoinPaymentServices\PipeLines\UnauthorizedResponse;
use App\Services\CoinPaymentServices\PipeLines\WithdrawalSuccessResponse;
use App\Services\CoinPaymentServices\Exceptions\CoinPaymentApiErrorException;

class CoinPaymentClient
{
    private const string API_URL = 'https://a-api.coinpayments.net/api';
    private const string API_VERSION = 'v2';

    /**
     * @param HttpClient $client
     * @param SerializerInterface $serializer
     */
    public function __construct(
        private string $client_id,
        private string $secret_key,
        private HttpClient $client,
        private SerializerInterface $serializer,
    ) {}

    /**
     * Build Complete URI
     * 
     * @param string $endpoint Api End Point
     * @return string
     */
    private function buildPath(string $endpoint): string
    {
        return '/' . self::API_VERSION . '/' . $endpoint;
    }

    /**
     * Build Signature To Get Authorize
     * 
     * @param string $timestamp Current Timestamp (Y-m-dT\H:s:i)
     * @param string $payload   
     * @return string
     */
    private function buildSignature(string $endpoint, HttpMethod $method, string $timestamp, string $payload = '')
    {
        $message = "\u{FEFF}$method->value" . self::API_URL . $this->buildPath($endpoint) . "$this->client_id$timestamp$payload" ;
        return base64_encode(hash_hmac('sha256', $message, $this->secret_key, true));
    }

    /**
     * Make request
     *
     * @template T of Response
     * @param string $endpoint API Endpoint
     * @param class-string<T> $responsePayload Payload Class
     * @param array $parameters Request data
     * @param HttpMethod $requestMethod Request Method to use default: POST
     * @return T
     * 
     * @throws \GuzzleHttp\Exception\GuzzleException | CoinPaymentApiErrorException
     */
    public function request(
        string $endpoint,
        string $responsePayload,
        array $parameters = [],
        HttpMethod $requestMethod = HttpMethod::POST,
        HttpRequestPayloadType $payloadType = HttpRequestPayloadType::QUERY
    ): Response {
        $timestamp = Carbon::now()->format('Y-m-d\TH:i:s');

        $headers = [
            "Content-Type"             => "application/json",
            "X-CoinPayments-Client"    => $this->client_id,
            "X-CoinPayments-Timestamp" => $timestamp,
            "X-CoinPayments-Signature" => $this->buildSignature(
                endpoint: $endpoint,
                method: $requestMethod,
                timestamp: $timestamp,
                payload: $payloadType->createPayload($parameters)
            )
        ];

        $response = null;

        try {
            $response = $this->client->request($requestMethod->value, self::API_URL . $this->buildPath($endpoint), [
                'headers' => $headers,
                'verify'  => true,
                ...$payloadType->getHttpOptionPayload($parameters),
            ]);
        } catch (\Throwable $e) {
            if(
                method_exists($e, "hasResponse")
                && $e->hasResponse()
            ){
                $response = $e->getResponse();
            }   else throw $e;
        }

        if(!$response)
            throw new CoinPaymentApiErrorException("Coin Payment Request Failed");

        /** @var ResponseFilterDTO $filterResponse */
        $filterResponse = app(Pipeline::class)
                ->send(new ResponseFilterDTO($response, $responsePayload))
                ->through([
                    UnauthorizedResponse::class,
                    WithdrawalSuccessResponse::class,
                ])
                ->thenReturn();

        if($filterResponse->is_passed()){
            $response = $filterResponse->getResponse();
            if (method_exists($response, "hasErrors") && $response->hasErrors()) {
                throw new CoinPaymentApiErrorException($response->detail ?? __("Something went wrong with CoinPayment Client"));
            }
            return $response;
        }

        $responseRawData = $response->getBody()->getContents();
        logger(json_encode($responseRawData));
        $responseObject = $this->serializer->deserialize(
            $responseRawData,
            $responsePayload,
            'json',
        );

        if ($responseObject->hasErrors()) {
            throw new CoinPaymentApiErrorException($responseObject->detail ?? __("Something went wrong with CoinPayment Client"));
        }

        return $responseObject;
    }
}