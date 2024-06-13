<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the appointments.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role == 'Admin' || $user->role == 'Receptionist') {
            // Retrieve all appointments excluding completed or cancelled ones
            $appointments = Appointment::whereNotIn('status', ['completed', 'cancelled'])->get();
        } elseif ($user->role == 'Doctor') {
            // Get the doctor record based on the authenticated user's email
            $doctor = Doctor::where('email', $user->email)->first();

            if (!$doctor) {
                return response()->json(['error' => 'Doctor not found'], 404);
            }

            // Retrieve appointments associated with the doctor's ID, excluding completed or cancelled ones
            $appointments = Appointment::where('doctor_id', $doctor->id)
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->get();
        } elseif ($user->role == 'Patient') {
            // Get the patient record based on the authenticated user's email
            $patient = Patient::where('email', $user->email)->first();

            if (!$patient) {
                return response()->json(['error' => 'Patient not found'], 404);
            }

            // Retrieve appointments associated with the patient's ID, excluding completed or cancelled ones
            $appointments = Appointment::where('patient_id', $patient->id)
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->get();
        } else {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role != 'Patient' && $user->role != 'Receptionist') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($user->role == 'Receptionist') {
            $request->validate([
                'patient_id' => 'required|exists:patients,id',
                'doctor_id' => 'required|exists:doctors,id',
                'appointment_date' => 'required|date',
                'reason' => 'required|string',
            ]);

            $patient_id = $request->patient_id;
        } else {
            $request->validate([
                'doctor_id' => 'required|exists:doctors,id',
                'appointment_date' => 'required|date',
                'reason' => 'required|string',
            ]);

            // Get the patient record based on the authenticated user's email
            $patient = Patient::where('email', $user->email)->first();
            if (!$patient) {
                return response()->json(['error' => 'Patient not found'], 404);
            }

            $patient_id = $patient->id;
        }

        $appointment = Appointment::create([
            'patient_id' => $patient_id,
            'doctor_id' => $request->doctor_id,
            'appointment_date' => $request->appointment_date,
            'status' => 'scheduled', // Default status
            'reason' => $request->reason,
        ]);

        return response()->json(['message' => 'Appointment booked successfully', 'appointment' => $appointment], 201);
    }


    /**
     * Display the specified appointment.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['error' => 'Not Found'], 404);
        }

        $user = Auth::user();

        // Get the doctor and patient records based on the authenticated user's email
        $doctor = Doctor::where('email', $user->email)->first();
        $patient = Patient::where('email', $user->email)->first();

        if (
            $user->role == 'Admin' ||
            ($user->role == 'Doctor' && $doctor && $doctor->id == $appointment->doctor_id) ||
            ($user->role == 'Patient' && $patient && $patient->id == $appointment->patient_id) ||
            $user->role == 'Receptionist'
        ) {
            return response()->json($appointment);
        } else {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    }

    /**
     * Update the specified appointment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['error' => 'Not Found'], 404);
        }

        $user = Auth::user();

        // Get the patient record based on the authenticated user's email
        $patient = Patient::where('email', $user->email)->first();

        if (($user->role != 'Patient' || !$patient || $patient->id != $appointment->patient_id) && $user->role != 'Receptionist') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'appointment_date' => 'sometimes|required|date',
            'reason' => 'sometimes|required|string',
        ]);

        try {
            // Update the appointment with the validated data
            $appointment->update($request->all());

            return response()->json(['status' => 'success', 'message' => 'Appointment updated successfully', 'appointment' => $appointment], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed to update appointment', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Cancel the specified appointment.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function cancelAppointment($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['error' => 'Not Found'], 404);
        }

        $user = Auth::user();

        // Get the patient record based on the authenticated user's email
        $patient = Patient::where('email', $user->email)->first();

        if (($user->role != 'Patient' || !$patient || $patient->id != $appointment->patient_id) && $user->role != 'Receptionist') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            // Cancel the appointment
            $appointment->update(['status' => 'cancelled']);

            return response()->json(['status' => 'success', 'message' => 'Appointment cancelled successfully', 'appointment' => $appointment], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed to cancel appointment', 'error' => $e->getMessage()], 500);
        }
    }
}
