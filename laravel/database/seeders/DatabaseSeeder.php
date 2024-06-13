<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\MedicalRecord;
use App\Models\Appointment;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12341234'),
            'role' => 'Admin'
        ]);
        
        // Seed Users
        for ($i = 1; $i <= 5; $i++) {
            User::create([
                'name' => "Doctor User $i",
                'email' => "doctor$i@example.com",
                'password' => Hash::make('password'),
                'role' => 'Doctor'
            ]);

            User::create([
                'name' => "Patient User $i",
                'email' => "patient$i@example.com",
                'password' => Hash::make('password'),
                'role' => 'Patient'
            ]);

            User::create([
                'name' => "Receptionist User $i",
                'email' => "receptionist$i@example.com",
                'password' => Hash::make('password'),
                'role' => 'Receptionist'
            ]);
        }

        // Seed Patients
        for ($i = 1; $i <= 5; $i++) {
            Patient::create([
                'first_name' => "John $i",
                'last_name' => "Doe $i",
                'date_of_birth' => '1990-01-01',
                'gender' => 'Male',
                'address' => "123 Main St Apt $i",
                'phone' => "123-456-789$i",
                'email' => "patient$i@example.com",
                'emergency_contact' => "Jane Doe: 987-654-321$i",
                'medical_history' => 'No significant medical history.'
            ]);
        }

        // Seed Doctors
        for ($i = 1; $i <= 5; $i++) {
            Doctor::create([
                'first_name' => "Alice $i",
                'last_name' => "Smith $i",
                'specialization' => "Cardiology $i",
                'license_number' => "DOC12345$i",
                'phone' => "555-123$i",
                'email' => "doctor$i@example.com"
            ]);
        }

        // Seed Medical Records
        for ($i = 1; $i <= 5; $i++) {
            MedicalRecord::create([
                'patient_id' => $i,
                'doctor_id' => $i,
                'visit_date' => '2024-01-10',
                'diagnosis' => 'Hypertension',
                'treatment' => 'Medication and lifestyle changes',
                'notes' => 'Patient needs to follow up in 3 months.'
            ]);
        }

        // Seed Appointments
        for ($i = 1; $i <= 5; $i++) {
            Appointment::create([
                'patient_id' => $i,
                'doctor_id' => $i,
                'appointment_date' => now()->addDays($i),
                'status' => 'Scheduled',
                'reason' => 'Routine check-up'
            ]);
        }
    }
}
