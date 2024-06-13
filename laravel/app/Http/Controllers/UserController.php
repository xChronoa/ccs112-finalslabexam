<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

use App\Models\User;
use App\Models\Patient;
use App\Models\Doctor;

class UserController extends Controller
{
    public function view(Request $request)
    {
        $role = $request->input('role'); // Get the role from the request parameters

        // Query users based on the role if provided
        if ($role) {
            $users = User::where('role', $role)->get();
        } else {
            // If no role is specified, return all users
            $users = User::all();
        }

        return response()->json(['status' => 200, 'data' => $users]);
    }

    // Adds user to the cart.
    public function add(Request $request)
    {
        // Define validation rules
        $rules = [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users,email', // Ensure email is unique
            'password' => 'required|string|min:8',
            'role' => 'required|string',
        ];

        // Validate the incoming request data
        $validator = Validator::make($request->all(), $rules);

        // If validation fails, return the validation errors
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Combine first_name and last_name into a single name field
        $name = $request->input('first_name') . ' ' . $request->input('last_name');
        $email = $request->input('email');
        $password = $request->input('password');
        $role = $request->input('role');

        try {
            // Attempt to find the user by email
            $existingUser = User::where('email', $email)->first();

            // If the user exists, return a specific error response
            if ($existingUser) {
                return response()->json(['status' => 409, 'message' => 'User already exists'], 409);
            }

            // If the user doesn't exist, create a new entry
            $user = new User();
            $user->name = $name; // Assign the combined name
            $user->email = $email;
            $user->password = Hash::make($password);
            $user->role = $role;
            $user->save();

            return response()->json(['status' => 201, 'message' => 'Successfully created user'], 201);
        } catch (QueryException $e) {
            // Check if the error is a duplicate entry error
            if ($e->getCode() == 23000) { // 23000 is the SQLSTATE code for integrity constraint violation
                return response()->json(['status' => 409, 'message' => 'User already exists'], 409);
            }

            // Return a generic error message
            return response()->json(['status' => 500, 'message' => 'Internal Server Error'], 500);
        } catch (\Exception $e) {
            // Return a generic error message
            return response()->json(['status' => 500, 'message' => 'Internal Server Error'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id, // Ensure email is unique, ignore current user
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:Doctor,Patient', // Only allow Doctor or Patient roles
        ]);

        // Hash the password
        $hashedPassword = Hash::make($validatedData['password']);

        // Combine first_name and last_name into a single name field
        $name = $validatedData['first_name'] . ' ' . $validatedData['last_name'];

        try {
            // Attempt to find the user in the database by ID
            $user = User::findOrFail($id);

            // Update the user with validated data
            $user->name = $name;
            $user->email = $validatedData['email'];
            $user->password = $hashedPassword;
            $user->role = $validatedData['role'];
            $user->save();

            // Check if the role is Doctor or Patient to update corresponding table
            if ($validatedData['role'] === 'Doctor') {
                $doctor = Doctor::where('email', $validatedData['email'])->first();
                if ($doctor) {
                    $doctor->first_name = $validatedData['first_name'];
                    $doctor->last_name = $validatedData['last_name'];
                    $doctor->save();
                }
            } elseif ($validatedData['role'] === 'Patient') {
                $patient = Patient::where('email', $validatedData['email'])->first();
                if ($patient) {
                    $patient->first_name = $validatedData['first_name'];
                    $patient->last_name = $validatedData['last_name'];
                    $patient->save();
                }
            }

            return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'User not found'], 404);
        } catch (QueryException $e) {
            // Check if the error is a duplicate entry error
            if ($e->getCode() == 23000) { // 23000 is the SQLSTATE code for integrity constraint violation
                return response()->json(['status' => 409, 'message' => 'User with this email already exists'], 409);
            }

            // Return a generic error message
            return response()->json(['status' => 500, 'message' => 'Internal Server Error'], 500);
        } catch (\Exception $e) {
            // Return a generic error message
            return response()->json(['status' => 500, 'message' => 'Internal Server Error'], 500);
        }
    }

    // Removes user from the system.
    public function delete($id)
    {
        try {
            // Fetch the user from the database
            $user = User::find($id);

            if (!$user) {
                // User not found, return appropriate response (e.g., 404 Not Found)
                return response()->json(['message' => 'User not found'], 404);
            }

            // Determine role to handle deletion accordingly
            $role = $user->role;

            // Begin a database transaction
            DB::beginTransaction();

            // Delete the user based on role
            if ($role === 'Patient' || $role === 'Doctor') {
                // For Patient and Doctor, handle deletion of associated records
                if ($role === 'Patient') {
                    $patient = Patient::where('email', $user->email)->first();
                    if ($patient) {
                        $patient->delete();
                    }
                } elseif ($role === 'Doctor') {
                    $doctor = Doctor::where('email', $user->email)->first();
                    if ($doctor) {
                        $doctor->delete();
                    }
                }
            }

            // Delete directly from User table for Receptionist and Admin roles
            $user->delete();

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

    public function register(Request $request)
    {
        try {
            $request->validate([
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'email' => 'required|email|unique:users,email', // Ensure email is unique
                'password' => 'required|string|min:8',
            ]);

            $user = User::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'Patient',
            ]);

            return response()->json(['message' => 'Registration successful', 'user' => $user], 201);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->validator->errors()->first()], 422);
        } catch (\Exception $e) {
            // Log error message
            logger()->error('User registration failed: ' . $e->getMessage());

            // Return error response
            return response()->json(['message' => 'Registration failed: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // Generate token manually
            $user = $request->user();
            $token = $user->createToken('auth_token')->plainTextToken;

            // Fetch associated doctor if the user role is Doctor
            if ($user->role === 'Doctor') {
                $doctor = Doctor::where('email', $user->email)->first();
                // Append doctor information to user object
                $user->doctor = $doctor;
            }

            // Fetch associated patient if the user role is Patient
            if ($user->role === 'Patient') {
                $patient = Patient::where('email', $user->email)->first();
                // Append patient information to user object
                $user->patient = $patient;
            }

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
            ], 200);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout successful'], 200);
    }
}
