<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropUniqueConstraintFromWalletNetworksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('wallet_networks', function (Blueprint $table) {
            $table->dropUnique(['wallet_id', 'network_type']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('wallet_networks', function (Blueprint $table) {
            $table->unique(['wallet_id', 'network_type']);
        });
    }
}
