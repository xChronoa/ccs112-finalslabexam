<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'visit_date',
        'diagnosis',
        'treatment',
        'notes',
    ];

    /**
     * Get the patient that owns the medical record.
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the doctor that created the medical record.
     */
    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}
