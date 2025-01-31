<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents; // Ensure no model events are dispatched

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->count(2)->unverified()->create(['password' => Hash::make(env('TEST_PASSWORD'))]);

        User::factory()->create([
            'first_name' => 'Kegan',
            'last_name' => 'VanSickle',
            'username' => 'keganv',
            'email' => 'keganv@keganv.com',
            'email_verified_at' => null,
            'password' => Hash::make(env('TEST_PASSWORD')),
        ]);

        $this->call([RelationshipSeeder::class]);
    }
}
