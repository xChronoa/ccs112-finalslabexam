<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Patient;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    public function view(Request $request)
    {
        $role = $request->input('role'); // Get the role from the request parameters

        // Query patients based on the role if provided
        if ($role) {
            $patients = Patient::where('role', $role)->get();
        } else {
            // If no role is specified, return all patients
            $patients = Patient::all();
        }

        return response()->json(['status' => 200, 'data' => $patients]);
    }

    public function add(Request $request)
    {
        // Define validation rules
        $rules = [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'date_of_birth' => 'required|date_format:Y-m-d',
            'gender' => 'required|in:Male,Female,Other',
            'address' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email|unique:patients,email', // Ensure email is unique
            'emergency_contact' => 'required|string',
            'medical_history' => 'nullable|string',
        ];

        // Validate the incoming request data
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        try {
            // Convert date format from mm/dd/yyyy to yyyy-mm-dd
            $dateOfBirth = Carbon::createFromFormat('Y-m-d', $request->date_of_birth)->format('Y-m-d');

            // Create a new patient entry
            $patient = Patient::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'date_of_birth' => $dateOfBirth,
                'gender' => $request->gender,
                'address' => $request->address,
                'phone' => $request->phone,
                'email' => $request->email,
                'emergency_contact' => $request->emergency_contact,
                'medical_history' => $request->medical_history,
            ]);

            return response()->json(['status' => 'success', 'message' => 'Successfully created patient', 'patient' => $patient], 201);
        } catch (ValidationException $e) {
            // If a validation exception occurs, return the validation error messages
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $e->errors()], 400);
        } catch (QueryException $e) {
            // If a query exception occurs (e.g., unique constraint violation), return a specific error message
            if ($e->errorInfo[1] == 1062) {
                return response()->json(['status' => 'error', 'message' => 'Duplicate entry for email'], 400);
            }
            return response()->json(['status' => 'error', 'message' => 'Failed to add patient', 'error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            // If an unexpected exception occurs, return a generic error message
            return response()->json(['status' => 'error', 'message' => 'Failed to add patient', 'error' => $e->getMessage()], 500);
        }
    }


    public function update(Request $request, $id)
{
    // Define validation rules
    $rules = [
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'date_of_birth' => 'required|date_format:Y-m-d',
        'gender' => 'required|in:Male,Female,Other',
        'address' => 'required|string',
        'phone' => 'required|string',
        'email' => 'required|email|unique:patients,email,' . $id, // Ensure email is unique (excluding the current patient)
        'emergency_contact' => 'required|string',
        'medical_history' => 'nullable|string',
    ];

    // Validate the incoming request data
    $validator = Validator::make($request->all(), $rules);

    // Check if validation fails
    if ($validator->fails()) {
        return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $validator->errors()], 400);
    }

    // Begin transaction to ensure data consistency
    DB::beginTransaction();

    try {
        // Convert date format from mm/dd/yyyy to yyyy-mm-dd
        $dateOfBirth = Carbon::createFromFormat('Y-m-d', $request->date_of_birth)->format('Y-m-d');

        // Find the patient in the database by ID
        $patient = Patient::findOrFail($id);

        // Retrieve current patient's information for user update comparison
        $currentPatient = $patient->toArray();

        // Update patient information
        $patient->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'date_of_birth' => $dateOfBirth,
            'gender' => $request->gender,
            'address' => $request->address,
            'phone' => $request->phone,
            'email' => $request->email,
            'emergency_contact' => $request->emergency_contact,
            'medical_history' => $request->medical_history,
        ]);

        // Check if first_name or last_name or email has been updated
        $nameUpdated = false;
        $emailUpdated = false;

        if ($request->filled('first_name') || $request->filled('last_name')) {
            // Combine first_name and last_name into name
            $name = trim($request->input('first_name') . ' ' . $request->input('last_name'));
            if ($currentPatient['first_name'] !== $request->input('first_name') || $currentPatient['last_name'] !== $request->input('last_name')) {
                $nameUpdated = true;
            }
        } else {
            $name = $currentPatient['first_name'] . ' ' . $currentPatient['last_name'];
        }

        if ($request->filled('email') && $currentPatient['email'] !== $request->input('email')) {
            $emailUpdated = true;
        }

        // If name or email has been updated, update corresponding User record
        if ($nameUpdated || $emailUpdated) {
            $user = User::where('email', $currentPatient['email'])->firstOrFail();

            if ($nameUpdated) {
                $user->name = $name;
            }

            if ($emailUpdated) {
                $user->email = $request->input('email');
            }

            $user->save();
        }

        // Commit transaction
        DB::commit();

        return response()->json(['status' => 'success', 'message' => 'Patient updated successfully', 'patient' => $patient], 200);
    } catch (\Exception $e) {
        // Rollback transaction on error
        DB::rollBack();

        // Return detailed error message
        return response()->json(['status' => 'error', 'message' => 'Failed to update patient', 'error' => $e->getMessage()], 500);
    }
}

    // Removes doctor from the system.
    public function delete($id)
    {
        try {
            // Fetch the user from the database
            $patient = Patient::find($id);

            if (!$patient) {
                // User not found, return appropriate response (e.g., 404 Not Found)
                return response()->json(['message' => 'Patient not found'], 404);
            }

            // Begin a database transaction
            DB::beginTransaction();

            $user = User::where('email', $patient->email)->first();

            if ($user) {
                $user->delete();
            }

            // Delete directly from User table for Receptionist and Admin roles
            $patient->delete();

            // Commit the transaction
            DB::commit();

            // Return a success response
            return response()->json(['message' => 'User and associated records removed successfully']);
        } catch (ModelNotFoundException $e) {
            // User or associated record not found
            DB::rollBack();
            return response()->json(['message' => 'User or associated record not found'], 404);
        } catch (QueryException $e) {
            // Database query exception
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            // Other unexpected errors
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
