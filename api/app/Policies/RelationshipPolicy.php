<?php

namespace App\Policies;

use App\Models\Relationship;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RelationshipPolicy
{
    /**
     * Determine whether the user can view the Relationship.
     */
    public function view(User $user, Relationship $relationship): bool
    {
        return $user->id === $relationship->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // TODO IMPLEMENT $user->can('create', Relationship::class);
        return true;
    }

    /**
     * Determine whether the user can update the Relationship.
     */
    public function update(User $user, Relationship $relationship): Response
    {
        return $user->id === $relationship->user_id
            ? Response::allow()
            : Response::deny('You are not authorized to update this relationship.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Relationship $relationship): bool
    {
        return $user->id === $relationship->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Relationship $relationship): bool
    {
        return $user->id === $relationship->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Relationship $relationship): bool
    {
        return $user->id === $relationship->user_id;
    }
}
