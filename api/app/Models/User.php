<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @property \DateTime $email_verified_at
 * @property string $full_name
 */
class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory;
    use HasUuids;
    use Notifiable;

    // UUID does not auto-increment
    public $incrementing = false;

    // UUID primary key
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
        'profile_image',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     * Hide sensitive data from serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Attributes that should be added to serialization.
     *
     * @var string[]
     */
    protected $appends = ['full_name'];

    /**
     * Get the user's full name.
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                return ucfirst($attributes['first_name'] ?? '').' '.ucfirst($attributes['last_name'] ?? '');
            }
        );
    }

    public function relationships()
    {
        return $this->hasMany(Relationship::class, 'user_id');
    }

    public function files()
    {
        return $this->hasMany(File::class, 'user_id');
    }

    public function actionItems()
    {
        return $this->hasMany(ActionItem::class, 'user_id');
    }

    public function profileImage()
    {
        return $this->belongsTo(File::class, 'profile_image_id');
    }
}
