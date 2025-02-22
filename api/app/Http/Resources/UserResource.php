<?php

namespace App\Http\Resources;

use App\Models\Relationship;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 * @property Relationship[] $relationships
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // ...parent::toArray($request),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at->format('Y-m-d H:i:s'),
            'first_name' => $this->first_name,
            'full_name' => $this->full_name,
            'id' => $this->id,
            'last_name' => $this->last_name,
            'profile_image' => $this->whenLoaded('profileImage'),
            'relationships' => RelationshipResource::collection($this->whenLoaded('relationships')),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'username' => $this->username,
            'relationship_count' => $this->whenCounted('relationships')
        ];
    }
}
