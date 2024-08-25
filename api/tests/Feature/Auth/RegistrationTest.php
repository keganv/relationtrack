<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'username' => 'test',
            'email' => 'test@example.com',
            'password' => 'password12',
            'password_confirmation' => 'password12',
            'terms' => true
        ]);

        $this->assertAuthenticated();
        $response->assertNoContent();
    }
}
