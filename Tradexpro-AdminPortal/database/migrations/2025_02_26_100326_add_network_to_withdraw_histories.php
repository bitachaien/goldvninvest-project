<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNetworkToWithdrawHistories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('withdraw_histories', function (Blueprint $table) {
            $table->bigInteger('network')->nullable()->after('updated_by');
            $table->text('reject_note')->nullable()->after('message');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('withdraw_histories', function (Blueprint $table) {
            $table->dropColumn('network');
            $table->dropColumn('reject_note');
        });
    }
}
