<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNetworkToDepositeTransactions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deposite_transactions', function (Blueprint $table) {
            $table->bigInteger('network')->nullable()->after('is_admin_receive');
            $table->text('reject_note')->nullable()->after('confirmations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('deposite_transactions', function (Blueprint $table) {
            $table->dropColumn('network');
            $table->dropColumn('reject_note');
        });
    }
}
