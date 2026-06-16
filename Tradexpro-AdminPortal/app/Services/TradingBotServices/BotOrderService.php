<?php

namespace App\Services\TradingBotServices;

use App\Model\AdminSetting;
use Carbon\Carbon;
use App\Jobs\BotOrderJob;
use App\Cache\BotCoinPairCache;
use App\Http\Services\CacheService;
use Illuminate\Support\Facades\Queue;
use Google\Service\Looker\AdminSettings;
use App\Contracts\Repositories\BotCoinPairRepositoryInterface;

class BotOrderService
{
    public function __construct(
        private BotCoinPairRepositoryInterface $coinPairRepository,
        private CacheService $cacheService,
        private BotCoinPairCache $botCoinPairCache
    ) {}

    public function getCoinPairsAndProcess(int $adminId)
    {
        while (true) {
            $bot_enable_status = settings('enable_bot_trade') ?? 0;
            if (!$bot_enable_status) {
                sleep(30);
                continue;
            }

            $coinPairs = $this->botCoinPairCache->getBotStatusActivePairs();
            $intervalInSec = intval(settings('trading_bot_buy_interval') ?? 5);

            foreach ($coinPairs as $coinPair) {
                $startTime = $this->cacheService->get('bot_order_place_time_for_coin_pair_'.$coinPair->id);

                if ($startTime && ! $this->checkBotOrderPlacingInterval($startTime, $intervalInSec)) {
                    continue;
                }

                if (! $this->cacheService->get('bot_order_status_'.$coinPair->id)) {
                    $this->cacheService->setWithTimeOut('bot_order_status_'.$coinPair->id, 'processing', 60);
                    BotOrderJob::dispatch($coinPair, $adminId)->onQueue('bot-order');
                }
            }
            sleep(1);
        }

    }

    private function checkBotOrderPlacingInterval(Carbon $start, int $intervalInSec): bool
    {
        $end = Carbon::now();
        $differenceInSeconds = $end->diffInSeconds($start);

        return $differenceInSeconds >= $intervalInSec;
    }
}
