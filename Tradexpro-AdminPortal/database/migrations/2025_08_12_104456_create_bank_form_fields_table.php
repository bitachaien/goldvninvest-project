<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBankFormFieldsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bank_form_fields', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('form_id')->index();
            $table->string('title');
            $table->string('slug', 80);
            $table->string('data_type', 20);
            $table->tinyInteger('required')->default(0);
            $table->boolean('status')->default(1);
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
        Schema::dropIfExists('bank_form_fields');
    }
}
