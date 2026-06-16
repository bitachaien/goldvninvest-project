<?php
namespace Database\Seeders;

use App\Model\Coin;
use App\Model\Wallet;
use App\User;
use Illuminate\Database\Seeder;

class CoinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Coin::firstOrCreate(['coin_type' => 'BTC'],['name' => 'Bitcoin']);
        Coin::firstOrCreate(['coin_type' => 'USDT'],['name' => 'Tether USD']);
    }
}
