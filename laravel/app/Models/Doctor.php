<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'specialization',
        'license_number',
        'phone',
        'email',
    ];

    /**
     * Define a relationship to the User model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        // Assuming 'email' is the foreign key in the users table
        return $this->belongsTo(User::class, 'email', 'email');
    }
}
