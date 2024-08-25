<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    /**
     * Updates or adds the profile image for the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function updateProfileImage(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $this->authorize('update', $user);

        $request->validate([
            'profile_image' => 'required|file|image|max:2048'
        ], [
            'profile_image.required' => 'You must provide an image.',
            'profile_image.max' => 'The file is too large.'
        ]);

        $previous = $user->profileImage()?->first(); // Check if there is a previous Profile Image
        $uploadedFile = $request->file('profile_image'); // Get the uploaded image
        $path = $uploadedFile->store("uploads/users/$user->id/profile", 'private');

        $file = new File([
            'user_id' => $user->id,
            'name' => $uploadedFile->getClientOriginalName(),
            'extension' => $uploadedFile->extension(),
            'path' => $path,
            'size' => $uploadedFile->getSize(),
        ]);

        $file->save();
        $user->profile_image_id = $file->id;
        $user->save();

        try {
            if ($previous) {
                // Remove from the files storage
                if (Storage::exists($previous->path)) {
                    Storage::delete($previous->path);
                }
                // Remove the database record
                $previous->delete();
            }
        } catch (\Exception $e) {
            return response()->json(
                ['message' => 'Failed to delete the previous profile image.'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return response()->json(['message' => 'Successfully updated your profile image!'], Response::HTTP_CREATED);
    }

    public function getProfileImage(string $userId, string $file)
    {
        /** @var User $user */
        $user = Auth::user();

        $this->authorize('view', $user);

        return $this->serveFile("uploads/users/$userId/profile/$file");
    }

    public function getPrivateFile($path)
    {
        return $this->serveFile($path);
    }

    private function serveFile($path)
    {
        $filePath = Storage::disk('private')->path($path);

        if (!Storage::disk('private')->exists($path)) {
            return response('Not found.', Response::HTTP_NOT_FOUND);
        }

        return response()->file($filePath);
    }
}
