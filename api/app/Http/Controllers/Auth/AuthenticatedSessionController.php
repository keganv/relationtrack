<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request. If the user must have a verified email, and has not verified their
     * email, they are authenticated and logged in, but sent back an error message. The application is off-limits
     * to users with unverified email addresses.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        if ($request->user() instanceof MustVerifyEmail && ! $request->user()->hasVerifiedEmail()) {
            $errorArray = [
                'errors' => [
                    'email_verified_at' => false,
                ],
                'message' => 'Your email address is not verified.'
            ];

            return response()->json($errorArray, Response::HTTP_CONFLICT);
        }

        return response()->json([
            'user' => $request->user()->toArray(),
            'message' => 'Successfully logged in.'
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }

    /**
     * The API "api/authentication" route must send back the `authenticated` key with a boolean value
     * for the React SPA AuthProvider authentication checks to work properly, do not change.
     */
    public function check(): JsonResponse
    {
        return response()->json(['authenticated' => Auth::check()], Response::HTTP_OK);
    }
}
