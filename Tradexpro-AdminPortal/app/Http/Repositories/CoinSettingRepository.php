<?php

namespace App\Http\Repositories;

use App\Contracts\Repositories\CoinSettingRepositoryInterface;
use App\Model\Coin;
use App\Model\CoinSetting;

class CoinSettingRepository extends CommonRepository implements CoinSettingRepositoryInterface
{

    public $model;

    public function __construct($model = null)
    {
        $this->model = $model ?: app(CoinSetting::class);
    }

    public function getCoinSettingData(int|string|Coin $coin, int $network)
    {
        $coinInfo = match (true) {
            !empty($coin->id) => $coin,
            is_numeric($coin) => Coin::find($coin),
            is_string($coin) => Coin::where('coin_type', $coin)->first(),
            default => Coin::find($coin),
        };
        if (empty($coinInfo))
            return null;

        $this->createCoinSetting($coinInfo->id, $network);

        return $this->model::join('coins', 'coins.id', '=', 'coin_settings.coin_id')
            ->select('coins.*', 'coin_settings.*', 'coins.id as id', 'coin_settings.id as coin_setting_id')
            ->where([
                'coin_settings.coin_id' => $coinInfo->id,
                'coin_settings.network' => $network
            ])
            ->first();
    }

    public function createCoinSetting(int $coinId, int $network): CoinSetting
    {
        return $this->model::firstOrCreate(['coin_id' => $coinId, 'network' => $network], []);
    }

    public function getContractAddressFromWalletAddress(string $address): ?string
    {
        $contractAddress = $this->model::join('coins', 'coin_settings.network', '=', 'coins.id')
            ->join('wallet_address_histories', 'wallet_address_histories.coin_type', '=', 'coins.coin_type')
            ->where('wallet_address_histories.address', $address)
            ->select('coin_settings.contract_address')->first();

        return $contractAddress ? $contractAddress->contract_address : null;
    }

    public function getNetworkFromContractAddress(string $contractAddress): ?int
    {
        $coinSetting = $this->model::join('coins', 'coin_settings.coin_id', '=', 'coins.id')
            ->where('coin_settings.contract_address', $contractAddress)
            ->select('coins.network')
            ->first();

        return $coinSetting ? $coinSetting->network : null;
    }

    public function getNetworkName(int $coinId, int $network): ?string
    {
        $coinSetting = $this->model::where(['coin_id' => $coinId, 'network' => $network])->select('network_name')->first();

        return @$coinSetting->network_name;
    }
}
