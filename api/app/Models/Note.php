<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'relationship',
        'content',
        'action_item',
    ];

    public function user()
    {
        $this->belongsTo(User::class, 'user_id');
    }

    public function relationship()
    {
        $this->belongsTo(Relationship::class);
    }

    public function actionItem()
    {
        $this->belongsTo(ActionItem::class, 'action_item_id');
    }
}
