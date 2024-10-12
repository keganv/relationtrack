<?php

namespace Database\Seeders;

use App\Models\Relationship;
use App\Models\RelationshipType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RelationshipSeeder extends Seeder
{
    public function run(): void
    {
        Relationship::factory()->create([
            'type' => RelationshipType::findByType('Child'),
            'name',
            'title',
            'birthday',
            'description',
            'health',
            'primary_image'
        ]);
    }
}
