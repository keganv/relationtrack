<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property User $user
 * @property Relationship $relationship
 * @property string $name
 * @property string $path
 * @property string $exention
 * @property integer $size
 */
class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'extension',
        'path',
        'size',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function relationship()
    {
        return $this->belongsTo(Relationship::class, 'relationship_id');
    }

    public function isPrimaryImage(): bool
    {
        return $this->relationship->primaryImage?->id === $this->id;
    }
}
