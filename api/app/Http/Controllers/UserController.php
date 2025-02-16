<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function index()
    {
        // Future use of displaying paginated users, SuperAdmin permission
    }

    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        $user->load([
            'profileImage', 'relationships.actionItems', 'relationships.primaryImage', 'relationships.relationshipType'
        ])->loadCount('relationships');

        return response()->json(new UserResource($user), Response::HTTP_OK);
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
