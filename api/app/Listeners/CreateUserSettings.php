<?php

namespace App\Listeners;

use App\Models\UserSettings;
use App\Types\EmailFrequency;
use Illuminate\Auth\Events\Registered;

class CreateUserSettings
{
    public function __invoke(Registered $event): void
    {
        // Create default user settings for the newly registered user
        UserSettings::create([
            'user_id' => $event->user->id,
            'notifications' => false, // Default to false
            'email_frequency' => EmailFrequency::Never, // Default to never
        ]);
    }
}
