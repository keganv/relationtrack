<?php

namespace app\Services;

use App\Models\Relationship;
use App\Models\User;
use App\Types\EmailFrequency;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class EmailService
{
    private array $data = [];

    private int $days = 1;

    public function __construct(public EmailFrequency $frequency)
    {

    }

    public function gatherUserSummaryData()
    {
        $users = User::select(['id', 'first_name', 'last_name', 'email'])
                    ->notifiable()
                    ->withEmailFrequency($this->frequency)
                    ->get();

        foreach ($users as $user) {
            $this->data[] = [
                'frequency' => $this->frequency,
                'user' => $user->toArray(),
                'updated_within' => $this->getUpdatedWithinDays($user),
                'updated_beyond' => $this->getUpdatedBeyond($user),
            ];
        }

        return $this->data;
    }

    /**
     * @param User $user
     * @return array
     */
    private function getUpdatedWithinDays(User $user): array
    {
        return Relationship::select(['id', 'name', 'updated_at', 'type_id'])
            ->byUser($user->id)
            ->updatedWithinDays($this->frequency->days())
            ->with(['actionItems' => function (HasMany $query) {
                $query->latest('updated_at');
            }])
            ->get()
            ->toArray();
    }

    private function getUpdatedBeyond(User $user)
    {
        return Relationship::select(['name', 'updated_at', 'type_id'])
            ->byUser($user->id)
            ->updatedBeyondDays($this->frequency->days())
            ->limit(10)
            ->orderBy('updated_at', 'desc')
            ->get()
            ->toArray();
    }
}
