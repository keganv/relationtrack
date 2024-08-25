<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = ['due_date', 'relationship', 'title', 'description'];

    public function user()
    {
        $this->belongsTo(User::class);
    }

    public function relationship()
    {
        $this->belongsTo(Relationship::class);
    }
}
