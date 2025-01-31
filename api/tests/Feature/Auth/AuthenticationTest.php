<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    public function test_users_can_login(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => $this->user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertStatus(Response::HTTP_OK);
        $response->assertJsonStructure([
            'user' => array_keys($this->user->toArray()),
            'message',
        ]);
    }

    public function test_users_can_not_login_with_invalid_password(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => $this->user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function test_a_logged_in_user_is_authenticated(): void
    {
        Auth::login($this->user);

        $response = $this->postJson('/api/authenticated');

        $this->assertAuthenticated();
        $response->assertJson(['authenticated' => true]);
        $response->assertStatus(Response::HTTP_OK);
    }

    public function test_authentication_check_returns_false_with_no_authenticated_user(): void
    {
        $response = $this->postJson('/api/authenticated');

        $this->assertGuest();
        $response->assertJson(['authenticated' => false]);
        $response->assertStatus(Response::HTTP_OK);
    }
}
