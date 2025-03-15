<?php

namespace App\Http\Resources;

use App\Models\Relationship;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Relationship
 */
class RelationshipResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'action_items' => $this->whenLoaded('actionItems'),
            'birthday' => $this->birthday->format('Y-d-m'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'deleted_at' => $this->deleted_at?->format('Y-m-d H:i:s'),
            'description' => $this->description,
            'files' => $this->whenLoaded('files'),
            'health' => $this->health,
            'id' => $this->id,
            'name' => $this->name,
            'primary_image' => $this->whenLoaded('primaryImage'),
            'type' => $this->whenLoaded('relationshipType'),
            'title' => $this->title,
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'user_id' => $this->user_id
        ];
    }
}
