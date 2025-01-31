<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property User $user
 * @property Relationship $relationship
 * @property string $action
 * @property bool $complete
 */
class ActionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'relationship',
        'complete',
    ];

    protected function casts(): array
    {
        return [
            'complete' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function relationship()
    {
        return $this->belongsTo(Relationship::class);
    }
}
