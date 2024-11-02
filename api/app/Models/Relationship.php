<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Relationship extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    public $incrementing = false;

    protected $fillable = [
        'type_id',
        'name',
        'title',
        'birthday',
        'description',
        'health',
        'primary_image'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function type()
    {
        return $this->belongsTo(RelationshipType::class, 'type_id');
    }

    public function primaryImage()
    {
        return $this->belongsTo(File::class, 'primary_image_id');
    }

    public function files()
    {
        return $this->hasMany(File::class, 'relationship_id');
    }

    public function actionItems()
    {
        return $this->hasMany(ActionItem::class, 'relationship_id');
    }
}
