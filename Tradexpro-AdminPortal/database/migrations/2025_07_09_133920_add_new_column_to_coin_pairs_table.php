<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNewColumnToCoinPairsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('coin_pairs', function (Blueprint $table) {
            $table->unsignedDecimal("bot_max_amount", 29, 18)->default(0);
            $table->unsignedDecimal("bot_min_amount", 29, 18)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('coin_pairs', function (Blueprint $table) {
            $table->dropColumn('bot_max_amount');
            $table->dropColumn('bot_min_amount');
        });
    }
}
