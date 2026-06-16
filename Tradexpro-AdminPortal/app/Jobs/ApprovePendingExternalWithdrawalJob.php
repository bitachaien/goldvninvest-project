<?php

namespace App\Jobs;

use App\Http\Services\TransactionService;
use App\Http\Services\TransService;
use App\Traits\ResponseHandlerTrait;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;

class ApprovePendingExternalWithdrawalJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, ResponseHandlerTrait;

    public $timeout = 900; // 15 minutes
    public $transaction;
    public $adminId;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($transaction, $adminId)
    {
        $this->transaction = $transaction;
        $this->adminId = $adminId;
    }

    public function handle(): array
    {
        return $this->handlerGeneralResponse(function () {
            return (new TransService())->acceptPendingExternalWithdrawal($this->transaction, $this->adminId);
        });
    }
}
