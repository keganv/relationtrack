<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Stringable;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


/*
|--------------------------------------------------------------------------
| Scheduled Cron Jobs
|--------------------------------------------------------------------------
*/

// Daily User Relationship Emails
Schedule::command('mail:user-summary', ['d'])
    ->dailyAt('00:00')
    ->onFailure(function (Stringable $output) {
        Mail::html("<p>$output</p>", function ($message) {
            $message->to('keganv@keganv.com')
                ->subject('RelationTrack Daily User Summary Email Failure');
        });
    });

// Weekly User Relationship Emails
Schedule::command('mail:user-summary', ['w'])
    ->weekly()
    ->fridays()
    ->at('15:50');

// Weekly User Relationship Emails
Schedule::command('mail:user-summary', ['m'])
    ->monthly()
    ->at('00:00');
