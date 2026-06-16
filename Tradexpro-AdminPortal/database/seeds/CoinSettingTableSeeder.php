<?php

use App\Model\Coin;
use App\Model\CoinSetting;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CoinSettingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $coins = Coin::all();

        foreach ($coins as $coin) {
            CoinSetting::where('coin_id', $coin->id)
                ->whereNull('network')
                ->update(['network' => $coin->network]);
        };
        Coin::whereIn('network', [BEP20_TOKEN, MATIC_TOKEN])
            ->update(['network' => ERC20_TOKEN]);

        CoinSetting::whereIn('network', [BEP20_TOKEN, MATIC_TOKEN])
            ->update(['network' => ERC20_TOKEN]);
    }
}
