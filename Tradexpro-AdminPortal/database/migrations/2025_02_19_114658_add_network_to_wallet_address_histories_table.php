<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNetworkToWalletAddressHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('wallet_address_histories', function (Blueprint $table) {
            $table->bigInteger('user_id')->nullable()->after('wallet_id');
            $table->bigInteger('network')->nullable()->after('user_id');
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
            $table->dropColumn("user_id");
            $table->dropColumn('network');
        });
    }
}
