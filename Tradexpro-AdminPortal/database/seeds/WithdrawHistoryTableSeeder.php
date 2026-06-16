<?php

use App\Model\DepositeTransaction;
use App\Model\WithdrawHistory;
use Illuminate\Database\Seeder;

class WithdrawHistoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $withdraws = WithdrawHistory::with('coin')->whereNull('network')->get();

        foreach ($withdraws as $withdraw) {
            $withdraw?->coin?->network && $withdraw->update([
                'network' => $withdraw?->coin?->network,
            ]);
        };
    }
}
