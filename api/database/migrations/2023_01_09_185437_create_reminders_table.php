<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users');
            $table->uuid('relationship_id')->nullable();
            $table->foreign('relationship_id')->references('id')->on('relationships')->onUpdate('cascade')->onDelete('set null');
            $table->string('title')->nullable(false);
            $table->text('description')->nullable(false);
            $table->dateTime('due_date')->nullable(false);
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
        Schema::dropIfExists('reminders');
    }
};
