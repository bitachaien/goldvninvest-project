<?php

namespace App\Services\AppServices;

use App\Model\Buy;
use App\Model\Sell;
use App\Model\CoinPair;
use App\Model\StopLimit;
use App\Model\UserWallet;
use App\Model\CoinSetting;
use App\Model\AdminSetting;
use Illuminate\Http\Response;
use App\Http\Services\Paginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Http\RedirectResponse;
use App\Http\Services\DashboardService;
use App\Exceptions\HttpResponseException;
use App\Providers\HorizonServiceProvider;
use App\Services\BankService\BankService;
use App\Services\BankService\IBankService;
use App\Providers\TelescopeServiceProvider;
use App\Http\Repositories\BuyOrderRepository;
use App\Http\Repositories\CoinPairRepository;
use App\Http\Repositories\TradeFeeRepository;
use App\Http\Repositories\SellOrderRepository;
use App\Http\Repositories\StopLimitRepository;
use App\Http\Repositories\UserWalletRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Http\Repositories\BotCoinPairRepository;
use App\Http\Repositories\CoinSettingRepository;
use App\Http\Repositories\TransactionRepository;
use Illuminate\Contracts\Foundation\Application;
use App\Http\Repositories\Trade\WalletRepository;
use App\Http\Repositories\OrderCoinPairRepository;
use App\Http\Repositories\TradeFeeFinderRepositoy;
use App\Services\ResponseServices\ResponseService;
use App\Contracts\Repositories\FindableByUserIdAndCoinId;
use App\Http\Repositories\WalletAddressHistoryRepository;
use App\Services\ResponseServices\ResponseServiceContract;
use App\Contracts\Repositories\BuyOrderRepositoryInterface;
use App\Contracts\Repositories\TradeFeeRepositoryInterface;
use App\Http\Repositories\Factories\OrderRepositoryFactory;
use App\Http\Repositories\MarketOverviewCoinPairRepository;
use App\Http\Repositories\Trade\TradeTransactionRepository;
use App\Contracts\Repositories\SellOrderRepositoryInterface;
use App\Contracts\Repositories\StopLimitRepositoryInterface;
use App\Contracts\Repositories\BotCoinPairRepositoryInterface;
use App\Contracts\Repositories\CoinSettingRepositoryInterface;
use App\Http\Services\TradeServices\FeeCheckerAndRefundService;
use App\Contracts\Repositories\OrderCoinPairRepositoryInterface;
use App\Contracts\Repositories\TradeFeeFinderRepositoryInterface;
use App\Contracts\Repositories\TradeTransactionRepositoryInterface;
use App\Services\TradingBotServices\ProcessedBotOrderRemoverService;
use App\Contracts\Repositories\WalletAddressHistoryRepositoryInterface;
use App\Contracts\Repositories\Factories\OrderRepositoryFactoryInterface;
use App\Contracts\Repositories\MarketOverViewCoinPairRepositoryInterface;
use Laravel\Telescope\TelescopeServiceProvider as LaravelTelescopeServiceProvider;

class AppService implements AppServiceContract
{
    public function __construct(){}

    public static function load_service_providers(Application $app)
    {
        $app->registerDeferredProvider(HorizonServiceProvider::class);

        if (env('TELESCOPE_ENABLED')) {
            $app->register(LaravelTelescopeServiceProvider::class);
            $app->registerDeferredProvider(TelescopeServiceProvider::class);
        }
    }

    /**
     * This method will set dependence on application container
     * @param \Illuminate\Contracts\Foundation\Application $app
     * @return void
     */
    public static function set_dependence(Application $app): void
    {
        $app->bind(
            BuyOrderRepositoryInterface::class,
            function (Application $app) {
                return new BuyOrderRepository(Buy::class);
            }
        );

        $app->bind(
            SellOrderRepositoryInterface::class,
            function (Application $app) {
                return new SellOrderRepository(Sell::class);
            }
        );

        $app->bind(
            StopLimitRepositoryInterface::class,
            function (Application $app) {
                return new StopLimitRepository(new StopLimit);
            }
        );

        $app->bind(
            OrderRepositoryFactoryInterface::class,
            OrderRepositoryFactory::class
        );

        $app->bind(
            CoinSettingRepositoryInterface::class,
            function (Application $app) {
                return new CoinSettingRepository(new CoinSetting);
            }
        );

        $app->bind(
            WalletAddressHistoryRepositoryInterface::class,
            WalletAddressHistoryRepository::class
        );

        $app->when(FeeCheckerAndRefundService::class)
            ->needs(FindableByUserIdAndCoinId::class)
            ->give(function () {
                return new WalletRepository(new UserWallet);
            });

        $app->bind(UserWalletRepository::class, function () {
            return new UserWalletRepository(new UserWallet);
        });

        $app->bind(
            TradeTransactionRepositoryInterface::class,
            TradeTransactionRepository::class
        );

        $app->bind(
            BotCoinPairRepositoryInterface::class,
            BotCoinPairRepository::class
        );

        $app->when(ProcessedBotOrderRemoverService::class)
            ->needs(TransactionRepository::class)
            ->give(function () {
                return new TransactionRepository(new \App\Model\Transaction);
            });

        $app->bind(
            OrderCoinPairRepositoryInterface::class,
            OrderCoinPairRepository::class
        );

        $app->bind(
            TradeFeeRepositoryInterface::class,
            TradeFeeRepository::class
        );

        $app->bind(CoinPairRepository::class, function () {
            return new CoinPairRepository(new CoinPair);
        });

        $app->bind(
            TradeFeeFinderRepositoryInterface::class,
            TradeFeeFinderRepositoy::class
        );

        $app->bind(
            MarketOverViewCoinPairRepositoryInterface::class,
            MarketOverviewCoinPairRepository::class
        );

        // Response Service Added To Application
        $app->bind(
            ResponseServiceContract::class,
            ResponseService::class
        );

        // Dashboard Service Added To Application
        $app->bind( DashboardService::class );

        // Dashboard Service Added To Application
        $app->bind( IBankService::class, BankService::class );
    }

    /**
     * This method will set macros on application
     * @return void
     */
    public static function set_macros(): void
    {
        // Throw Response Macro
        $throwResponse = function(string $message): void {
            throw new HttpResponseException($message, $this);
        };
        Response::macro("throwHttpResponse", $throwResponse);
        JsonResponse::macro("throwHttpResponse", $throwResponse);
        RedirectResponse::macro("throwHttpResponse", $throwResponse);

        // Pagination added to collection
        Collection::macro('paginate', function ($perPage, $total = null, $page = null, $pageName = 'page') {
            $page = $page ?: LengthAwarePaginator::resolveCurrentPage($pageName);

            return new Paginator(
                $this->forPage($page, $perPage),
                $total ?: $this->count(),
                $perPage,
                $page,
                [
                    'path' => Paginator::resolveCurrentPath(),
                    'pageName' => $pageName,
                ]
            );
        });
    }

    /**
     * This method will Cache and load all admin settings data
     * @return array
     */
    public static function load_admin_settings(): array
    {
        if(isset($GLOBALS['ADMIN_SETTINGS_LOADED'])){
            $now = time();
            $diff = $now - $GLOBALS['ADMIN_SETTINGS_LOADED'];
            if ($diff < 10) return $GLOBALS['ADMIN_SETTINGS_ARRAY'] ?? [];
        }

        $admin_settings = AdminSetting::select('value', 'slug')->get() ?? collect();
        if (!isset($GLOBALS['ADMIN_SETTINGS']) || PROCESS_RUN_BY_ARTISAN) {
            $GLOBALS['ADMIN_SETTINGS_LOADED'] = time();
            $GLOBALS['ADMIN_SETTINGS'] = $admin_settings;
        }

        $admin_settings = $admin_settings?->pluck("value", "slug")->toArray() ?? [];
        if (!isset($GLOBALS['ADMIN_SETTINGS_ARRAY']) || PROCESS_RUN_BY_ARTISAN) {
            $GLOBALS['ADMIN_SETTINGS_ARRAY'] = $admin_settings;
        }

        return $admin_settings;
    }
}
