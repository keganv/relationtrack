<?php

namespace App\Models;

use App\Types\EmailFrequency;
use Database\Factories\UserSettingsFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * UserSettings model represents the settings for a user.
 * The default model is created when a user registers in the CreateUserSettings listener.
 *
 * @property int $user_id
 * @property bool $notifications
 * @property string $email_frequency
 */
class UserSettings extends Model
{
    /** @use HasFactory<UserSettingsFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'notifications', // User allows email notifications (boolean)
        'email_frequency', // Frequency of email notifications (string)
    ];

    protected function casts(): array
    {
        return [
            'notifications' => 'boolean',
            'email_frequency' => EmailFrequency::class,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
