<?php

namespace Tests\Feature\Auth;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_can_register(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/register', [
            'firstName' => 'Test',
            'lastName' => 'User',
            'username' => 'test',
            'email' => 'test@example.com',
            'password' => env('TEST_PASSWORD'),
            'password_confirmation' => env('TEST_PASSWORD'),
            'terms' => true,
        ]);

        $this->assertAuthenticated();
        $response
            ->assertStatus(Response::HTTP_CREATED)
            ->assertJson(['message' => 'Successfully registered! Check your inbox to finish signing up!']);
        Notification::assertSentTimes(VerifyEmail::class, 1);
    }
}
