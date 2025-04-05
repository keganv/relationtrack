<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PrivateFileController extends Controller
{
    /**
     * @route '/files/users/{user}/{path}'
     *
     * @return StreamedResponse|JsonResponse
     */
    public function __invoke(Request $request, User $user, string $path)
    {
        // Auth guard the files
        if (Auth::id() !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $file = null;
        $s3 = Storage::disk('s3');
        $fullpath = '/files/users/'.$user->id.'/'.$path;

        if ($s3->exists($fullpath)) {
            // Check if the user has the 'remember me' token and if it is
            // valid and matches the database remember_token (same browser/device).
            $rememberCookie = array_filter(
                Cookie::get(),
                fn ($key) => strpos($key, 'remember_web') === 0,
                ARRAY_FILTER_USE_KEY
            );
            $useRememberCache = false;

            if ($rememberCookie) {
                $rememberToken = explode('|', reset($rememberCookie))[1];
                $useRememberCache = hash_equals($rememberToken, $user->getRememberToken());
            }

            // Check if the user has the 'remember me' token and set the cache
            // to 1 month or use the default session lifetime configuration.
            $cacheDuration = $useRememberCache ? 2592000 : config('session.lifetime') * 60;
            $mimeType = $s3->mimeType($fullpath);
            $file = $s3->response($fullpath, null, [
                // cache for 1 month
                'Cache-Control' => 'private, max-age='.$cacheDuration.', immutable',
                'Content-Type' => $mimeType
            ]);

            return $file;
        }

        // If the file does not exist, return a 404 response
        return response()->json(['message' => 'File not found'], Response::HTTP_NOT_FOUND);
    }
}
