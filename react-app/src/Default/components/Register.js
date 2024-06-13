import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { usePatient } from "../../hooks/usePatient";
import { ToastContainer } from "react-toastify";

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        role: 'Patient',
        date_of_birth: '',
        gender: '',
        address: '',
        phone: '',
        emergency_contact: '',
        medical_history: ''
    });

    const { register, loading, notify } = useAuth();
    const { addPatient } = usePatient();
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPasswordChange = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            notify("Passwords do not match", "error");
            return;
        }
        try {
            await register(formData);
            await addPatient(formData);
        } catch (error) {
            notify("Registration failed", "error");
        }
    };

    return (
        <div className="container min-vh-100 d-flex justify-content-center align-items-center my-5">
            <div className="row justify-content-center mt-5 w-100">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center text-uppercase mb-4">
                                Register
                            </h2>
                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="First Name"
                                        disabled={loading}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Please enter your first name.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Last Name"
                                        disabled={loading}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Please enter your last name.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Date of Birth"
                                        disabled={loading}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Please enter your date of birth.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="form-control"
                                        disabled={loading}
                                        required
                                    >
                                        <option value="" disabled>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div className="invalid-feedback">
                                        Please select your gender.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Address"
                                        disabled={loading}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Please enter your address.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Phone"
                                        disabled={loading}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Please enter your phone number.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="emergency_contact"
                                        value={formData.emergency_contact}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Emergency Contact"
                                        disabled={loading}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Please enter an emergency contact.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        name="medical_history"
                                        value={formData.medical_history}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Medical History"
                                        rows="3"
                                        disabled={loading}
                                        required
                                    ></textarea>
                                    <div className="invalid-feedback">
                                        Please enter your medical history.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Email"
                                        disabled={loading}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Please enter a valid email address.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Password"
                                        disabled={loading}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Please enter your password.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Confirm Password"
                                        disabled={loading}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Passwords must match.
                                    </div>
                                </div>
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        id="show-password"
                                        className="form-check-input"
                                        checked={showPassword}
                                        onChange={handleShowPasswordChange}
                                    />
                                    <label
                                        htmlFor="show-password"
                                        className="form-check-label"
                                    >
                                        Show Password
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary text-uppercase fw-bold w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Registering..." : "Register"}
                                </button>
                            </form>
                            <p className="mt-3">
                                Already have an account?{" "}
                                <Link to="/">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
