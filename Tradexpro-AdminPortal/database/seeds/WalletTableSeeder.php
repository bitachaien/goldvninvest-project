<?php
namespace Database\Seeders;

use App\Model\Coin;
use App\Model\Wallet;
use App\User;
use Illuminate\Database\Seeder;

class WalletTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $coins = Coin::select('id', 'coin_type')->get();
        User::select('id')->where([
            'status' => STATUS_ACTIVE,
            'super_admin' => STATUS_INACTIVE
        ])->chunk(100, function($users) use($coins){
            $users->map(function($user)use($coins){
                $coins->map(function($coin) use($user){
                    Wallet::firstOrCreate(['user_id' => $user->id, 'coin_id' => $coin->id],
                        ['name' =>  $coin->coin_type.' Wallet', 'coin_type' => $coin->coin_type]);
                });
            });
        });
    }
}
