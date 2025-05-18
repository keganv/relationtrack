<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\User;
use App\Models\UserSettings;
use App\Types\EmailFrequency;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
use Illuminate\Testing\Fluent\AssertableJson;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private static array $newValues;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        UserSettings::factory()->withUser($this->user->id)->create();

        // Create the values to update each test once to avoid overhead
        if (!isset(self::$newValues)) {
            self::initNewValues($this->user);
        }
    }

    public function test_user_update_passes_with_all_values(): void
    {
        // First see if the User has a related UserSettings
        $this->assertDatabaseHas('user_settings', ['user_id' => $this->user->id]);

        $this->actingAs($this->user);
        $response = $this->patchJson('/api/users/' . $this->user->id, [
            'id' => $this->user->id,
            ...self::$newValues
        ]);

        $response->assertJson(fn (AssertableJson $json) =>
            $json->where('id', $this->user->id)
                ->where('first_name', self::$newValues['first_name'])
                ->where('last_name', self::$newValues['last_name'])
                ->where('email', self::$newValues['email'])
                ->where('username', self::$newValues['username'])
                ->has('settings', fn (AssertableJson $json) =>
                    $json->where('notifications', self::$newValues['notifications'])
                        ->where('email_frequency', self::$newValues['email_frequency'])
                        ->etc()
                )
                ->missing('password')
                ->etc()
        );

        $response->assertStatus(Response::HTTP_OK);
    }

    public function test_update_user_email_only()
    {
        $this->actingAs($this->user);
        $response = $this->patchJson('/api/users/' . $this->user->id, [
            'id' => $this->user->id,
            'email' => self::$newValues['email']
        ]);

        $response->assertJson(fn (AssertableJson $json) =>
            $json->where('id', $this->user->id)
                ->where('first_name', $this->user->first_name)
                ->where('last_name', $this->user->last_name)
                ->where('email', self::$newValues['email'])
                ->where('username', $this->user->username)
                ->has('settings', fn (AssertableJson $json) =>
                $json->where('notifications', $this->user->settings->notifications)
                    ->where('email_frequency', $this->user->settings->email_frequency)
                    ->etc()
                )
                ->missing('password')
                ->etc()
            );

        $response->assertStatus(Response::HTTP_OK);
    }

    private static function initNewValues(User $user): void
    {
        self::$newValues = [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->firstName(),
            'email' => fake()->email(),
            'username' => fake()->userName(),
            'notifications' => !$user->settings->notifications,
            'email_frequency' => Arr::random(EmailFrequency::cases()),
        ];
    }
}
