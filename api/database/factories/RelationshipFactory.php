<?php

namespace Database\Factories;

use App\Models\Relationship;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<Relationship>
 */
class RelationshipFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => $this->faker->numberBetween(1, 8), // 1-8 are the valid relationship types (ids)
            'name' => $this->faker->name(),
            'title' => $this->faker->title(),
            'health' => $this->faker->numberBetween(1, 10),
            'birthday' => $this->faker->date('Y-m-d', new \DateTime('2020-01-01')),
        ];
    }
}
