<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
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
        $user = $request->user();

        if ($user instanceof MustVerifyEmail && !$user->hasVerifiedEmail()) {
            $errorArray = [
                'errors' => [
                    'email_verified_at' => false,
                ],
                'message' => 'Your email address is not verified.',
            ];

            return response()->json($errorArray, Response::HTTP_CONFLICT);
        }

        $user->load([
            'profileImage',
            'relationships.actionItems',
            'relationships.primaryImage',
            'relationships.relationshipType',
            'relationships.files'
        ])->loadCount('relationships');

        return response()->json([
            'user' => new UserResource($user),
            'message' => 'Successfully logged in.',
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate(); // DO NOT REMOVE
        $request->session()->regenerateToken(); // DO NOT REMOVE - Prevent CSRF attacks!

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

    /**
     * Returns the Authenticated user's information:
     * Profile image, and user's relationships with their ActionItems, primary image, Files and Types.
     *
     * @return JsonResponse
     */
    public function user(): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Please log in again.'], Response::HTTP_UNAUTHORIZED);
        }

        $userModel = Auth::user()->load([
            'profileImage',
            'relationships.actionItems',
            'relationships.primaryImage',
            'relationships.files',
            'relationships.relationshipType'
        ])->loadCount('relationships');

        return response()->json(new UserResource($userModel), Response::HTTP_OK);
    }
}
