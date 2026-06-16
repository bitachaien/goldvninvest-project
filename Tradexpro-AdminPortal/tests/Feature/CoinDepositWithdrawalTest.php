<?php

namespace Tests\Feature;

use App\Model\Coin;
use Tests\TestCase;
use App\Model\CoinSetting;
use App\Model\AdminSetting;
use Illuminate\Http\Request;
use App\Http\Services\CoinService;
use App\Model\DepositeTransaction;
use Illuminate\Support\Facades\DB;
use App\Model\WalletAddressHistory;
use Illuminate\Console\OutputStyle;
use App\Http\Services\WalletService;
use Illuminate\Support\Facades\Artisan;
use App\Http\Services\CoinSettingService;
use Illuminate\Foundation\Testing\WithFaker;
use App\Http\Repositories\CustomTokenRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Test Some Feature Together
 * 
 * Use This Command With New Empty Database
 * Run Command: php artisan test --filter CoinDepositWithdrawalTest
 * 
 * Change Those Property To Test For Your Use Case
 */
class CoinDepositWithdrawalTest extends TestCase
{
    // use RefreshDatabase;
    private static string $coin_type = "USDC";
    private static int $coin_network = ERC20_TOKEN; // ERC20_TOKEN , BEP20_TOKEN , TRC20_TOKEN
    private static int $coin_decimal = 6;
    private static string $coin_contract_address = "0x1291070C5f838DCCDddc56312893d3EfE9B372a8";
    private static string $rpc_url = "https://sepolia.infura.io/v3/5fc639a817c642a09dd3978d5e38c864";
    private static string $systemWalletAddress = "0x5167B2A247102137413D58c1d8E23D6D011988b3";
    private static string $systemWalletKey = "ee8efa50b3df9bb480db6aa9a35089a6b327c348bd3a90bafcc62a881f7c1d3f";
    private static ?string $userWalletAddress = "0x5167B2A247102137413D58c1d8E23D6D011988b3";

    private static Coin $coin;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_coin_coinSetting_deposit_withdrawal(): void
    {
        echo "All Database Dropping".PHP_EOL;
        Artisan::call('migrate:fresh --seed');
        echo "All Database Dropped Success".PHP_EOL;

        $this->setup_ERC20_Api_Setting();
        $this->create_coin();
        $this->create_coin_setting();
        $this->generateUserAddress();
        $this->receiveTokenToAdminFromUser();
    }

    public function create_coin(): void
    {
        // DB::beginTransaction();
        // Coin::truncate();
        // Artisan::call('db:seed --class=CoinSeeder');
        $newCoinRequest = new Request([
            "name"      => self::$coin_type,
            "coin_type" => self::$coin_type,
            "coin_price"=>  1,
            "network"   => self::$coin_network,
            "get_price_api" => 0,
            "currency_type" => 1,
        ]);

        $coinService = new CoinService();
        $newCoin = $coinService->addNewCoin($newCoinRequest);

        $this->assertEquals(
            "New coin added successfully",
            $newCoin['message'] ?? "",
            "Coin Failed To Create"
        );

        self::$coin = Coin::where("coin_type", self::$coin_type)->first();
        echo "New Crypto Coin Added Success".PHP_EOL;
    }

    public function create_coin_setting(): void
    {
        $coin = self::$coin;

        $coinSettingRequest = new Request([
            "coin_id" => encrypt($coin->id),
            "contract_coin_name" => "DKFT Coin",
            "chain_link" => self::$rpc_url,
            "contract_address" => self::$coin_contract_address,
            "contract_decimal" => self::$coin_decimal,
            "gas_limit" => 999999,
            "network_name" => "Binance Testnet",
        ]);

        $coinSettingService = new CoinSettingService();
        $response = $coinSettingService->updateCoinSetting($coinSettingRequest);

        $addSystemWalletToCoin = CoinSetting::where(["coin_id" => $coin->id, "network" => $coin->network])->first()->update([
            'wallet_address' => self::$systemWalletAddress,
            'wallet_key' => encrypt(self::$systemWalletKey)
        ]);

        $this->assertEquals(
            "Coin api setting updated successfully",
            $response["message"] ??"",
            "Coin Setting Update Failed"
        );

        $this->assertEquals(
            true,
            $addSystemWalletToCoin,
            "System Wallet Failed To Add"
        );

        echo "Coin Setting Update".PHP_EOL;
        echo "System Wallet Update At Coin Setting".PHP_EOL;
    }

    public function setup_ERC20_Api_Setting():void
    {
        AdminSetting::updateOrCreate(["slug" => "erc20_app_url" ], ["value" => "http://localhost:3041/"]);
        AdminSetting::updateOrCreate(["slug" => "erc20_app_key" ], ["value" => "aksldmlkamslkdmalksdmlaksmd"]);
        AdminSetting::updateOrCreate(["slug" => "erc20_app_port"], ["value" => "3041"]);
        echo "Node Api Setting SetUp Success".PHP_EOL;
    }

    public function generateUserAddress(): void
    {
        $coin = self::$coin;

        $walletService = new WalletService();
        $response = $walletService->userWalletDeposit(userId: 2, coinType: $coin->coin_type ?: "");
        $jsonResponse = json_encode($response);

        $this->assertEquals(
            "Success", 
            $response["message"] ??"",
            "Address Generate Failed , Response Message Not Success"
        );

        $this->assertStringContainsString(
            "address", 
            $jsonResponse,
            "Address Generate Failed. Address Not Found In Response"
        );

        $this->assertMatchesRegularExpression(
            "/^[A-Za-z0-9].*$/",
            $response["data"]["address"] ?? "",
            "Address not generate!"
        );

        self::$userWalletAddress = self::$userWalletAddress ? self::$userWalletAddress : $response["data"]["address"];

        WalletAddressHistory::where([
            "user_id" => 2,
            "coin_type" => self::$coin_type,
            "address" => $response["data"]["address"],
        ])->first()?->update([
            "address" => self::$userWalletAddress,
            "wallet_key" => STRONG_KEY . self::$userWalletAddress . self::$systemWalletKey
        ]);

        echo "User Address Generated Success".PHP_EOL;
    }

    public function receiveTokenToAdminFromUser(): void
    {
        $pendingTokenData = [
            "address" => self::$userWalletAddress, // "0x5cae7401041191E2ee7E4E240946B3bbB38C1302",  // self::$systemWalletAddress,
            "from_address" => "doNotCare",
            "receiver_wallet_id" => 5,
            "address_type" => 1,
            "coin_type" => self::$coin_type,
            "amount" => 1,
            "status" => 1,
            "network" => self::$coin_network,
        ];

        $depositTransaction = DepositeTransaction::create($pendingTokenData);
        echo "New Pending Deposit Added For User".PHP_EOL;

        $this->assertEquals(
            true,
            $depositTransaction instanceof DepositeTransaction,
            "Pending Deposit Failed To Create"
        );

        $response = (new CustomTokenRepository())->tokenReceiveManuallyByAdminProcess($depositTransaction, 1);
        $this->assertEquals(
            "Admin token received successfully",
            $response["message"] ??"",
            "Receive User Token To System Wallet Failed, Response Message Not Success"
        );

        echo "Admin Received Token From User Deposited Address".PHP_EOL;
    }
}
