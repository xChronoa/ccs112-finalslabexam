import React, { useState } from 'react';

const AddDoctorForm = (props) => {
    // Stores form data inputted by the user.
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'Doctor',
        phone: '',
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
            await props.addUser(formData);
            const isAdded = await props.addDoctor(formData);
            if (isAdded) {
                props.onClose();
            } else {
                setFormError('Failed to add doctor.'); // Set form error if add fails
            }
        } catch (error) {
            setFormError(error.message || 'An error occurred while adding the doctor.');
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
                    disabled
                >
                    <option value="Doctor">Doctor</option>
                </select>
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
                <label htmlFor="specialization" className="form-label">Specialization:</label>
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
                <label htmlFor="license_number" className="form-label">License Number:</label>
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
            <button type="submit" className="btn btn-primary">Create Doctor</button>

            {formError && <p className="text-danger mt-2">Error: {formError}</p>}
        </form>
    );
};

export default AddDoctorForm;
