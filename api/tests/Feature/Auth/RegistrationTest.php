<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'firstName' => 'Test',
            'lastName' => 'User',
            'username' => 'test',
            'email' => 'test@example.com',
            'password' => env('TEST_PASSWORD'),
            'password_confirmation' => env('TEST_PASSWORD'),
            'terms' => true
        ]);

        $this->assertAuthenticated();
        $response
            ->assertStatus(Response::HTTP_CREATED)
            ->assertJson(['message' => 'Successfully registered! Check your inbox to finish signing up!']);
    }
}
