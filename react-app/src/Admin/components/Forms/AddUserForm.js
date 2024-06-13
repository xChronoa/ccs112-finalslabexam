import React, { useState } from "react";

const AddUserForm = (props) => {
    // Stores form data inputted by the user.
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: '',
        // Patient specific fields
        date_of_birth: '',
        gender: '',
        address: '',
        phone: '',
        emergency_contact: '',
        medical_history: '',
        // Doctor specific fields
        specialization: '',
        license_number: '',
    });

    // Stores form error.
    const [formError, setFormError] = useState(null);

    // Checks for onChange events for the input fields and sets the variables' value.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function that handles form submission.
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error before submission
        setFormError(null);

        try {
            // Check if the operation is successful, if not then don't close the modal.
            if (await props.addUser(formData)) {
                if (formData.role === "Patient") {
                    await props.addPatient(formData);
                } else if (formData.role === "Doctor") {
                    await props.addDoctor(formData);
                }
                props.onClose();
            }
        } catch (error) {
            setFormError(
                error.message || "An error occurred while adding the user."
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-3 m-auto">
            <div className="mb-3">
                <label htmlFor="first_name" className="form-label">
                    First Name:
                </label>
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="last_name" className="form-label">
                    Last Name:
                </label>
                <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email:
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                    Password:
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="role" className="form-label">
                    Role:
                </label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-control"
                    required
                >
                    <option value="" hidden>
                        Select Role
                    </option>
                    <option value="Admin">Admin</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Patient">Patient</option>
                </select>
            </div>
            {formData.role === "Doctor" && (
                <>
                    <div className="mb-3">
                        <label htmlFor="specialization" className="form-label">
                            Specialization:
                        </label>
                        <input
                            type="text"
                            id="specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="license_number" className="form-label">
                            License Number:
                        </label>
                        <input
                            type="text"
                            id="license_number"
                            name="license_number"
                            value={formData.license_number}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                            Phone:
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                </>
            )}
            {formData.role === "Patient" && (
                <>
                    <div className="mb-3">
                        <label htmlFor="date_of_birth" className="form-label">
                            Date of Birth:
                        </label>
                        <input
                            type="date"
                            id="date_of_birth"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">
                            Gender:
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="" hidden>
                                Select Gender
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">
                            Address:
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                            Phone:
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="emergency_contact"
                            className="form-label"
                        >
                            Emergency Contact:
                        </label>
                        <input
                            type="text"
                            id="emergency_contact"
                            name="emergency_contact"
                            value={formData.emergency_contact}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="medical_history" className="form-label">
                            Medical History:
                        </label>
                        <textarea
                            id="medical_history"
                            name="medical_history"
                            value={formData.medical_history}
                            onChange={handleChange}
                            className="form-control"
                            rows="3"
                            required
                        ></textarea>
                    </div>
                </>
            )}
            <button type="submit" className="btn btn-primary">
                Create User
            </button>
            {formError && (
                <p className="text-danger mt-2">Error: {formError}</p>
            )}
        </form>
    );
};

export default AddUserForm;
