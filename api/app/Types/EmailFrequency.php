<?php

namespace App\Types;

enum EmailFrequency: string
{
    case Daily = 'd';
    case Weekly = 'w';
    case Monthly = 'm';
    case Never = 'n';

    public function label(): string
    {
        return match ($this) {
            self::Daily => 'Daily',
            self::Weekly => 'Weekly',
            self::Monthly => 'Monthly',
            self::Never => 'Never',
        };
    }
}
