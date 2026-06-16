<?php

use App\Model\DepositeTransaction;
use Illuminate\Database\Seeder;

class DepositTransactionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $deposits = DepositeTransaction::with('coin')->whereNull('network')->get();

        foreach ($deposits as $deposit) {
            $deposit?->coin?->network && $deposit->update([
                'network' => $deposit?->coin?->network,
            ]);
        };
    }
}
