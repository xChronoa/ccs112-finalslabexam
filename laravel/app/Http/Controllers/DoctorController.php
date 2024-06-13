<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DoctorController extends Controller
{
    public function view(Request $request)
    {
        // Fetch all doctors
        $doctors = Doctor::all();
        return response()->json(['status' => 200, 'data' => $doctors]);
    }

    public function add(Request $request)
    {
        // Define validation rules
        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'license_number' => 'required|string|max:255|unique:doctors,license_number',
            'phone' => 'required|string|max:15',
            'email' => 'required|email|max:255|unique:doctors,email',
        ];

        // Validate the incoming request data
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        try {
            // Create a new doctor entry
            $doctor = Doctor::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'specialization' => $request->specialization,
                'license_number' => $request->license_number,
                'phone' => $request->phone,
                'email' => $request->email,
            ]);

            return response()->json(['status' => 'success', 'message' => 'Successfully created doctor', 'doctor' => $doctor], 201);
        } catch (ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $e->errors()], 400);
        } catch (QueryException $e) {
            if ($e->errorInfo[1] == 1062) {
                return response()->json(['status' => 'error', 'message' => 'Duplicate entry for email or license number'], 400);
            }
            return response()->json(['status' => 'error', 'message' => 'Failed to add doctor', 'error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed to add doctor', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        // Define validation rules
        $rules = [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'specialization' => 'sometimes|required|string|max:255',
            'license_number' => 'sometimes|required|string|max:255|unique:doctors,license_number,' . $id,
            'phone' => 'sometimes|required|string|max:15',
            'email' => 'sometimes|required|email|max:255|unique:doctors,email,' . $id,
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
            // Find the doctor in the database by ID
            $doctor = Doctor::findOrFail($id);

            // Retrieve current doctor's information for user update comparison
            $currentDoctor = $doctor->toArray();

            // Update doctor information
            $doctor->update($request->all());

            // Check if first_name or last_name or email has been updated
            $nameUpdated = false;
            $emailUpdated = false;

            if ($request->filled('first_name') || $request->filled('last_name')) {
                // Combine first_name and last_name into name
                $name = trim($request->input('first_name') . ' ' . $request->input('last_name'));
                if ($currentDoctor['first_name'] !== $request->input('first_name') || $currentDoctor['last_name'] !== $request->input('last_name')) {
                    $nameUpdated = true;
                }
            } else {
                $name = $currentDoctor['first_name'] . ' ' . $currentDoctor['last_name'];
            }

            if ($request->filled('email') && $currentDoctor['email'] !== $request->input('email')) {
                $emailUpdated = true;
            }

            // If name or email has been updated, update corresponding User record
            if ($nameUpdated || $emailUpdated) {
                $user = User::where('email', $currentDoctor['email'])->firstOrFail();

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

            return response()->json(['status' => 'success', 'message' => 'Doctor updated successfully', 'doctor' => $doctor], 200);
        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();

            return response()->json(['status' => 'error', 'message' => 'Failed to update doctor', 'error' => $e->getMessage()], 500);
        }
    }

    // Removes doctor from the system.
    public function delete($id)
    {
        try {
            // Fetch the user from the database
            $doctor = Doctor::find($id);

            if (!$doctor) {
                // User not found, return appropriate response (e.g., 404 Not Found)
                return response()->json(['message' => 'Doctor not found'], 404);
            }

            // Begin a database transaction
            DB::beginTransaction();

            $user = User::where('email', $doctor->email)->first();

            if ($user) {
                $user->delete();
            }

            // Delete directly from User table for Receptionist and Admin roles
            $doctor->delete();

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
