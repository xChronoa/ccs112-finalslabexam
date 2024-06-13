<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;

// User
Route::prefix("/user")->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('view', [UserController::class, 'view']);
        Route::post("/add", [UserController::class, 'add']);
        Route::put("/update/{id}", [UserController::class, 'update']);
        Route::delete("/remove/{id}", [UserController::class, 'delete']);
        Route::post('logout', [UserController::class, 'logout']);
    });
    Route::post('register', [UserController::class, 'register']);
    Route::post('login', [UserController::class, 'login']);
});

// Patient
Route::prefix("/patient")->group(function () {
    Route::get('/view', [PatientController::class, 'view']);
    Route::post("/add", [PatientController::class, 'add']);
    Route::put("/update/{id}", [PatientController::class, 'update']);
    Route::delete("/remove/{id}", [PatientController::class, 'delete']);
});

// Doctor
Route::prefix("/doctor")->group(function () {
    Route::get('/view', [DoctorController::class, 'view']);
    Route::post("/add", [DoctorController::class, 'add']);
    Route::put("/update/{id}", [DoctorController::class, 'update']);
    Route::delete("/remove/{id}", [DoctorController::class, 'delete']);
});

// Medical Controller
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/medical-records', [MedicalRecordController::class, 'index']);
    Route::post('/medical-records/store', [MedicalRecordController::class, 'store']);
    Route::get('/medical-records/{id}', [MedicalRecordController::class, 'show']);
    Route::put('/medical-records/update/{id}', [MedicalRecordController::class, 'update']);
});

// Appointment Controller
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments/store', [AppointmentController::class, 'store']);
    Route::get('/appointments/show/{id}', [AppointmentController::class, 'show']);
    Route::put('/appointments/update/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/cancel/{id}', [AppointmentController::class, 'cancelAppointment']);
});