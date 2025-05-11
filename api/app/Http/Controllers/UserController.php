<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\FileService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function __construct(private FileService $fileService)
    {
    }

    public function index()
    {
        // Future use of displaying paginated users, SuperAdmin permission
    }

    /**
     * This method returns a specific user's information:
     * Profile image, and user's relationships with their ActionItems, primary image, Files and Types.
     * TODO: Future admin role privileges
     *
     * @param User $user
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        $userModel = $user->load([
            'profileImage',
            'relationships.actionItems',
            'relationships.primaryImage',
            'relationships.files',
            'relationships.relationshipType'
        ])->loadCount('relationships');

        return response()->json(new UserResource($userModel), Response::HTTP_OK);
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        $validated = $request->validated();
        $previousFile = null;

        if ($upload = $validated['profile_image'] ?? false) {
            $previousFile = $user->profileImage;
            $path = $this->fileService->uploadFileToStorage($upload, '/files/users/'.$user->id);
            $file = $this->fileService->createNewFile($user, $upload, $path);
            $user->profile_image_id = $file->id; // Update the user's profile image ID
        }

        $userFields = collect($validated)->except(['profile_image', 'notifications', 'email_frequency'])->toArray();
        $settingsFields = collect($validated)->only(['notifications', 'email_frequency'])->toArray();

        $user->fill($userFields);
        $user->settings->update($settingsFields);

        $user->save();

        if ($previousFile) {
            $this->fileService->removeFileFromStorage($previousFile);
        }

        $user->load([
            'profileImage',
            'relationships.actionItems',
            'relationships.files',
            'relationships.primaryImage',
            'relationships.relationshipType',
            'settings'
        ])->loadCount('relationships');

        return response()->json(new UserResource($user), Response::HTTP_OK);
    }

    public function destroy(string $id)
    {
        //
    }
}
