<?php

namespace Database\Seeders;

use App\Models\Relationship;
use App\Models\RelationshipType;
use App\Models\User;
use Illuminate\Database\Seeder;

class RelationshipSeeder extends Seeder
{
    public function run(): void
    {
        Relationship::factory()->create([
            'user_id' => User::firstWhere('email', 'keganv@keganv.com'),
            'type_id' => RelationshipType::firstWhere('type', 'Child'),
            'name' => 'Rider',
            'title' => 'Son',
            'birthday' => new \DateTime('2007/07/01'),
            'description' => 'My firstborn child. He is also my best friend.',
            'health' => 10,
        ]);
    }
}
