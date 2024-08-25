<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        return $this->relationship->primaryImage()->first()?->id === $this->id;
    }
}
