<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class RelationshipType extends Model
{
    public function relationships()
    {
        return $this->hasMany(Relationship::class);
    }

    public function types(): Collection
    {
        return $this->all();
    }
}
