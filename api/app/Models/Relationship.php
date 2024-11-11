<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Relationship extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    public $incrementing = false;

    protected $fillable = [
        'type',
        'name',
        'title',
        'birthday',
        'description',
        'health',
        'primary_image_id'
    ];

    protected $appends = ['type'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function relationshipType(): BelongsTo
    {
        return $this->belongsTo(RelationshipType::class, 'type_id');
    }

    public function primaryImage(): BelongsTo
    {
        return $this->belongsTo(File::class, 'primary_image_id');
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class, 'relationship_id');
    }

    public function actionItems(): HasMany
    {
        return $this->hasMany(ActionItem::class, 'relationship_id');
    }

    protected function type(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => $this->relationshipType()->getResults(),
            set: fn ($value) => ['type_id' => $value],
        );
    }
}
