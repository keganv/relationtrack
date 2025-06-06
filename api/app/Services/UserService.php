<?php

namespace App\Services;

use App\Models\Relationship;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class UserService
{
    public static function gatherUserRelationshipSummaryData(User $user, int $days): array
    {
        return [
            'updated_within' => self::getRelationshipsUpdatedWithinDays($user, $days),
            'updated_beyond' => self::getRelationshipsUpdatedBeyondDays($user, $days),
        ];
    }

    public static function getRelationshipsUpdatedWithinDays(User $user, int $days): array
    {
        // 'type_id' is needed to eager load the BelongsTo relationship for relationshipType RelationshipType
        // 'primary_image_id' is needed to eager load the BelongsTo relationship for primaryImage File
        return Relationship::select(['id', 'name', 'updated_at', 'type_id', 'primary_image_id'])
            ->byUser($user->id)
            ->updatedWithinDays($days)
            ->with([
                'actionItems' => function (HasMany $query) {
                    $query->latest('updated_at');
                },
                'primaryImage'
            ])
            ->get()
            ->toArray();
    }

    public static function getRelationshipsUpdatedBeyondDays(User $user, int $days, int $limit = 10)
    {
        // 'type_id' is needed to eager load the BelongsTo relationship for relationshipType RelationshipType
        // 'primary_image_id' is needed to eager load the BelongsTo relationship for primaryImage File
        return Relationship::select(['id', 'name', 'updated_at', 'type_id', 'primary_image_id'])
            ->byUser($user->id)
            ->updatedBeyondDays($days)
            ->with('primaryImage')
            ->limit($limit)
            ->orderBy('updated_at', 'asc')
            ->get()
            ->toArray();
    }
}
