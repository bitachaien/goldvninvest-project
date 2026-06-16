<?php

namespace App\Jobs;

use App\Http\Services\TransService;
use App\Traits\ResponseHandlerTrait;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class WithdrawalProcessJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, ResponseHandlerTrait;

    public $data;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    public function handle(): array
    {
        return $this->handlerGeneralResponse(function () {
            return (new TransService())->startWithdrawalProcess($this->data);
        });
    }
}
