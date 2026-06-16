<?php

use App\Model\WalletAddressHistory;
use Illuminate\Database\Seeder;

class WalletAddressHistoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $addresses = WalletAddressHistory::with('wallet.coin')->whereNull('user_id')->whereNull('network')->get();

        foreach ($addresses as $address) {
            $userId = $address->wallet->user_id;
            $network = $address->wallet->coin->network;

            $address->update([
                'user_id' => $userId,
                'network' => $network,
            ]);
        };
    }
}
