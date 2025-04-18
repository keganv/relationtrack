<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        // Future use of displaying paginated users, SuperAdmin permission
    }

    /**
     * This method returns the authenticated user's information:
     * Profile image, and user's relationships with their ActionItems, primary image, Files and Types.
     *
     * @return JsonResponse
     */
    public function getUser()
    {
        $user = Auth::user()->load([
            'profileImage',
            'relationships.actionItems',
            'relationships.primaryImage',
            'relationships.files',
            'relationships.relationshipType'
        ])->loadCount('relationships');

        return response()->json(new UserResource($user), Response::HTTP_OK);
    }

    /**
     * This method returns a specific user's information.
     * Not yet used in the application. Future administration feature.
     *
     * @param User $user
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        $user->load([
            'profileImage', 'relationships.actionItems', 'relationships.primaryImage', 'relationships.relationshipType'
        ])->loadCount('relationships');

        return response()->json(new UserResource($user), Response::HTTP_OK);
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        $validated = $request->validated();

        $user->fill($validated);

        $user->load([
            'profileImage', 'relationships.actionItems', 'relationships.primaryImage', 'relationships.relationshipType'
        ])->loadCount('relationships');

        return response()->json(new UserResource($user), Response::HTTP_OK);
    }

    public function destroy(string $id)
    {
        //
    }
}
