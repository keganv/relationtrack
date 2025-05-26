<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Isolatable;

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
        //
    }
}
