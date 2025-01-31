<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('action_items', function (Blueprint $table) {
            $table->dropForeign(['relationship_id']);
            $table->uuid('relationship_id')->nullable(false)->change();
            $table->foreign('relationship_id')->references('id')->on('relationships')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('action_items', function (Blueprint $table) {
            $table->dropForeign(['relationship_id']);
            $table->uuid('relationship_id')->nullable()->change();
            $table->foreign('relationship_id')->references('id')->on('relationships')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }
};
