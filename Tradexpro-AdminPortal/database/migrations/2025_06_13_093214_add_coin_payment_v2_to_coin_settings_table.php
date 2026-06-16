<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCoinPaymentV2ToCoinSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('wallet_address_histories', function (Blueprint $table) {
            $table->timestamp("rented_till")->nullable()->before('created_at');
            $table->string("coin_payment_wallet_id", 50)->nullable();
        });
        Schema::table('wallet_networks', function (Blueprint $table) {
            $table->timestamp("rented_till")->nullable()->before('created_at');
            $table->string("coin_payment_wallet_id", 50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::table('wallet_address_histories', function (Blueprint $table) {
            $table->dropColumn('rented_till');
            $table->dropColumn('coin_payment_wallet_id');
        });
        Schema::table('wallet_networks', function (Blueprint $table) {
            $table->dropColumn('rented_till');
            $table->dropColumn('coin_payment_wallet_id');
        });
    }
}
