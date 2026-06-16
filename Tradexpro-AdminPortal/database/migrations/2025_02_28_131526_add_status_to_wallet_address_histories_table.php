<?php

use App\Model\WalletAddressHistory;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToWalletAddressHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('wallet_address_histories', function (Blueprint $table) {
            $table->bigInteger('status')->default(WalletAddressHistory::ACTIVE)->after('public_key');
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
            $table->dropColumn('status');
        });
    }
}
