<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('relation_types', function (Blueprint $table) {
            $table->id();
            $table->string('type')->unique();
        });

        $relations = ['God', 'Spouse', 'Child', 'Parent', 'Sibling', 'Friend', 'Relative', 'Pet'];
        foreach ($relations as $relation) {
            DB::table('relation_types')->insert([
                'type' => $relation,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('relation_types');
    }
};
