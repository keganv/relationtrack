<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\User;
use App\Services\FileService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function __construct(private FileService $fileService)
    {
    }

    /**
     * Updates or adds the profile image for the authenticated user.
     *
     * @throws AuthorizationException
     */
    public function updateProfileImage(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $this->authorize('update', $user);

        $request->validate([
            'profile_image' => 'required|file|image|max:2048',
        ], [
            'profile_image.required' => 'You must provide an image.',
            'profile_image.max' => 'The file is too large.',
        ]);

        /** @var File $previous */
        $previous = $user->profileImage()?->first(); // Check if there is a previous Profile Image
        $uploadedFile = $request->file('profile_image'); // Get the uploaded image

        try {
            $path = $this->fileService->storeFileToStorage($user, $uploadedFile);
            $uploadedFileName = $uploadedFile->getClientOriginalName();

            // If there was no previous profile image, update it
            if ($previous) {
                // First remove the old File from storage to keep things clean
                $this->fileService->removeFilesFromStorage([$previous]);

                // Update the existing profile image File
                $data = [
                    'name' => $uploadedFileName,
                    'extension' => $uploadedFile->extension(),
                    'path' => $path,
                    'size' => $uploadedFile->getSize(),
                ];
                $this->fileService->updateFile($previous, $data);
            } else {
                // If there was no previous profile image, create a new File model
                $file = $this->fileService->createNewFile($user, $uploadedFile, $path);
                $user->profile_image_id = $file->id;
                $user->save();
            }

            return response()->json(['message' => 'Successfully updated your profile image!'], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), $e->getCode());
        }
    }
}
