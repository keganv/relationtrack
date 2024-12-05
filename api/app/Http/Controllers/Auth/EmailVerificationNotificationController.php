<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     *
     * @param Request $request
     * @return JsonResponse|RedirectResponse
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $email = $request->has('email') ? $request->get('email') : null;
        $user = $request->user() ?? User::firstWhere(['email' => $email]);

        if (!$user) {
            $email_msg = 'A registered user with that email could not be found.';
            $error = [
                'message' => $email_msg,
                'errors' => [
                    'email' => [$email_msg]
                ]
            ];

            return response()->json($error, Response::HTTP_NOT_FOUND);
        }

        if ($user->hasVerifiedEmail()) {
            if ($request->expectsJson()) {
                return response()->json();
            }

            return redirect()->intended(RouteServiceProvider::HOME);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'The email verification link has been sent to your inbox!']);
    }
}
