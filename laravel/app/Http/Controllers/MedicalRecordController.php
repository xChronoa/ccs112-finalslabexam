<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Support\Facades\Auth;

class MedicalRecordController extends Controller
{
    /**
     * Display a listing of the medical records.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role == 'Admin') {
            $medicalRecords = MedicalRecord::all();
        } elseif ($user->role == 'Doctor') {
            // Get the doctor record based on the authenticated user's email
            $doctor = Doctor::where('email', $user->email)->first();

            if (!$doctor) {
                return response()->json(['error' => 'Doctor not found'], 404);
            }

            // Retrieve medical records associated with the doctor's ID
            $medicalRecords = MedicalRecord::where('doctor_id', $doctor->id)->get();
        } elseif ($user->role == 'Patient') {
            // Get the patient record based on the authenticated user's email
            $patient = Patient::where('email', $user->email)->first();

            if (!$patient) {
                return response()->json(['error' => 'Patient not found'], 404);
            }

            // Retrieve medical records associated with the patient's ID
            $medicalRecords = MedicalRecord::where('patient_id', $patient->id)->get();
        } else {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json(['data' => $medicalRecords]);
    }

    /**
     * Store a newly created medical record in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Retrieve the authenticated user
        $user = Auth::user();

        // Ensure the authenticated user is a doctor or admin
        if ($user->role != 'Doctor' && $user->role != 'Admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Validate the incoming request data
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'visit_date' => 'required|date',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        // Retrieve the doctor's ID based on the authenticated user's email
        $doctor = Doctor::where('email', $user->email)->first();
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        // Create a new MedicalRecord instance and populate it with request data
        $medicalRecord = new MedicalRecord();
        $medicalRecord->patient_id = $request->patient_id;
        $medicalRecord->doctor_id = $doctor->id; // Assign the retrieved doctor's ID
        $medicalRecord->visit_date = $request->visit_date;
        $medicalRecord->diagnosis = $request->diagnosis;
        $medicalRecord->treatment = $request->treatment;
        $medicalRecord->notes = $request->notes;
        $medicalRecord->save();

        // Return a JSON response with the created medical record and status code 201 (Created)
        return response()->json($medicalRecord, 201);
    }

    /**
     * Display the specified medical record.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $medicalRecord = MedicalRecord::find($id);
        if (!$medicalRecord) {
            return response()->json(['error' => 'Not Found'], 404);
        }

        $user = Auth::user();
        if ($user->role == 'Admin' || $user->role == 'Doctor' && $user->id == $medicalRecord->doctor_id || $user->role == 'Patient' && $user->id == $medicalRecord->patient_id) {
            return response()->json($medicalRecord);
        } else {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    }

    /**
     * Update the specified medical record in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Find the medical record by ID
        $medicalRecord = MedicalRecord::find($id);
        if (!$medicalRecord) {
            return response()->json(['error' => 'Medical Record not found'], 404);
        }

        // Retrieve the authenticated user
        $user = Auth::user();

        // Check if the authenticated user is authorized to update the medical record
        if ($user->role != 'Doctor') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Validate the incoming request data
        $request->validate([
            'visit_date' => 'sometimes|required|date',
            'diagnosis' => 'sometimes|required|string',
            'treatment' => 'sometimes|required|string',
            'notes' => 'nullable|string',
        ]);

        try {
            // Retrieve the doctor's ID based on the authenticated user's email
            $doctor = Doctor::where('email', $user->email)->first();
            if (!$doctor) {
                return response()->json(['error' => 'Doctor not found'], 404);
            }

            // Update the medical record with the validated data
            $medicalRecord->update([
                'patient_id' => $request->patient_id,
                'doctor_id' => $doctor->id, // Assign the retrieved doctor's ID
                'visit_date' => $request->visit_date,
                'diagnosis' => $request->diagnosis,
                'treatment' => $request->treatment,
                'notes' => $request->notes,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Medical Record updated successfully',
                'medicalRecord' => $medicalRecord
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update medical record',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
