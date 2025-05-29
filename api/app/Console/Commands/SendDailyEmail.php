<?php

namespace App\Console\Commands;

use App\Mail\UserSummary;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Isolatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Mail;

class SendDailyEmail extends Command implements Isolatable
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:send-daily';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command compiles a list of users who have notifications enabled. It then provides
    a list of relationships that have not been updated in the last week. It also provides a quick summary of actions
    they have completed in the past day, along with any reminders they user has set. Finally, it sends an email to each
    user with this information about their relationships.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::whereHas('settings', function (Builder $query) {
            $query->where('notifications', true)
                  ->where('email_frequency', 'd');
        })->get();

        foreach ($users as $user) {
            Mail::to($user->email)->send(new UserSummary($user));
        }

        $this->info("Daily email sent to {$users->count()} users.");
    }
}
