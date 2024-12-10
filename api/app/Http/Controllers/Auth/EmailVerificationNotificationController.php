<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

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
        if ($request->user()->hasVerifiedEmail()) {
            $message = 'You have already verified your email.';
            if ($request->expectsJson()) {
                return response()->json(['message' => $message]);
            }

            return redirect()->to(config('app.frontend_url') . RouteServiceProvider::DASHBOARD)
                ->with(['message' => $message]);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'The email verification link has been sent to your inbox!']);
    }
}
