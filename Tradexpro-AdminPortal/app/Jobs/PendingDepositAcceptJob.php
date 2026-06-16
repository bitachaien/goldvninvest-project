<?php

namespace App\Jobs;

use App\Http\Repositories\CustomTokenRepository;
use App\Model\DepositeTransaction;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Throwable;

class PendingDepositAcceptJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public $timeout = 0;
    private $transaction;
    private $adminId;
    public function __construct($transaction, $adminId)
    {
        $this->transaction =  $transaction;
        $this->adminId =  $adminId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            (new CustomTokenRepository())->tokenReceiveManuallyByAdminProcess($this->transaction, $this->adminId);
        } catch (Throwable $e) {
            $this->transaction->update([
                'is_admin_receive' => DepositeTransaction::PENDING,
                'reject_note' => $e->getMessage(),
            ]);
            storeLog(processExceptionMsg($e), 'error');
        }
    }

    /**
     * Handle a job failure.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    public function failed(Throwable $exception)
    {
        storeException('PendingDepositAcceptJob', json_encode($exception));
        // Send user notification of failure, etc...
    }
}
