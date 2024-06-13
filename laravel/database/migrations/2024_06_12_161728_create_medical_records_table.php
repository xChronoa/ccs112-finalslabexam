<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id'); // Reference to the patient
            $table->unsignedBigInteger('doctor_id'); // Reference to the doctor
            $table->date('visit_date'); // Date of the patient's visit
            $table->string('diagnosis'); // Diagnosis made by the doctor
            $table->string('treatment'); // Treatment prescribed to the patient
            $table->text('notes')->nullable(); // Additional notes by the doctor
            $table->timestamps(); // created_at and updated_at timestamps

            // Foreign key constraints
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('doctor_id')->references('id')->on('doctors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
