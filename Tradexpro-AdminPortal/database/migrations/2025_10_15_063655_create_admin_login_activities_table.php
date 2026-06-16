<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminLoginActivitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_login_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->string('device')->nullable();
            $table->string('browser')->nullable();
            $table->string('os')->nullable();
            $table->string('location')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('login_at')->useCurrent();
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
        Schema::dropIfExists('admin_login_activities');
    }
}
