<?php

namespace App\Models;

use App\Types\EmailFrequency;
use Database\Factories\UserSettingsFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSettings extends Model
{
    /** @use HasFactory<UserSettingsFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'notifications', // User allows email notifications (boolean)
        'frequency', // Frequency of email notifications (string)
    ];

    protected function casts(): array
    {
        return [
            'notifications' => 'boolean',
            'frequency' => EmailFrequency::class,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
