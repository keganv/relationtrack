<?php

namespace database\factories;

use App\Models\File;
use App\Models\User;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\File>
 */
class FileFactory extends Factory
{

    protected $model = File::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'size' => $this->faker->numberBetween(1000, 5000000),
            'extension' => $this->faker->fileExtension(),
            'path' => $this->faker->filePath(),
            'user_id' => User::factory(),
        ];
    }
}
