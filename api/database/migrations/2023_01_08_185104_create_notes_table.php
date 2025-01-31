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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('set null');
            $table->uuid('relationship_id')->nullable();
            $table->foreign('relationship_id')->references('id')->on('relationships')->onUpdate('cascade')->onDelete('set null');
            $table->unsignedBigInteger('action_item_id')->nullable();
            $table->foreign('action_item_id')->references('id')->on('action_items');
            $table->text('content')->nullable(false);
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
        Schema::dropIfExists('notes');
    }
};
