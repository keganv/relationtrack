<?php

namespace App\Console\Commands;

use App\Mail\UserSummary;
use app\Services\EmailService;
use App\Types\EmailFrequency;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Isolatable;
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
        $frequency = EmailFrequency::from($this->argument('frequency'));

        if (!$frequency) {
            $this->fail('Invalid frequency provided.');
        }

        $emailService = new EmailService($frequency);
        $data = $emailService->gatherUserSummaryData();
        $count = count($data);


        foreach ($data as $datum) {
            Mail::to($datum['user']['email'])->send(new UserSummary($datum));
        }

        $this->info("Daily email sent to $count users.");
    }
}
