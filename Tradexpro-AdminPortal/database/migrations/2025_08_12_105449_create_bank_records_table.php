<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBankRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bank_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('form_id')->index();
            $table->unsignedBigInteger('user_id');
            $table->longText("bank");
            $table->string('access')->nullable();
            $table->boolean('status')->default(1);
            $table->boolean('is_admin')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bank_records');
    }
}
