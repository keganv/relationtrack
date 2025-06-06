<?php

namespace App\Listeners;

use App\Models\User;
use App\Models\UserSettings;
use App\Types\EmailFrequency;
use Illuminate\Auth\Events\Registered;

class CreateUserSettings
{
    /**
     * Create default user settings for the newly registered user
    */
    public function __invoke(Registered $event): void
    {
        /** @var User $user */
        $user = $event->user;
        UserSettings::create([
            'user_id' => $user->id,
            'notifications' => false, // Default to false
            'email_frequency' => EmailFrequency::Never, // Default to never
        ]);
    }
}
