<?php

namespace App\Console\Commands;

use App\Mail\UserSummary;
use App\Models\User;
use App\Services\UserService;
use App\Types\EmailFrequency;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Isolatable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class UserSummaryEmail extends Command implements Isolatable
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:user-summary
                            {frequency : EmailFrequency must be "d", "w", or "m"}';

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
        $frequency = EmailFrequency::tryFrom($this->argument('frequency'));

        if (!$frequency) {
            Log::error("User Summary Email Failed!", [
                'reason' => "Invalid frequency of {$this->argument('frequency')} provided."
            ]);
            $this->fail('Invalid frequency provided.');
        }

        // Data to hold user summaries that will be sent in the email
        $data = [];

        // Gather users who have notifications enabled and the specified email frequency
        $users = User::select(['id', 'first_name', 'last_name', 'email'])
            ->notifiable()
            ->withEmailFrequency($frequency)
            ->get();

        foreach ($users as $user) {
            $data[] = [
                'frequency' => $frequency,
                'user' => $user->toArray(),
                ...UserService::gatherUserRelationshipSummaryData($user, $frequency->days()),
            ];
        }

        $count = count($data);

        foreach ($data as $datum) {
            Mail::to($datum['user']['email'])->send(new UserSummary($datum));
        }

        $this->info("{$frequency->name} email sent to $count users.");

        return Command::SUCCESS;
    }
}
