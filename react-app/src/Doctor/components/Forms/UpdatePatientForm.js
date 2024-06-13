import React, { useState } from 'react';
import { toast } from 'react-toastify';

const UpdatePatientForm = ({ patient, updatePatient, onClose }) => {
    const { id, first_name, last_name, date_of_birth, gender, address, phone, email, emergency_contact, medical_history } = patient;

    const [formData, setFormData] = useState({ first_name, last_name, date_of_birth, gender, address, phone, email, emergency_contact, medical_history });

    const [formError, setFormError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (await updatePatient(id, formData)) {
                onClose();
            }
        } catch (error) {
            setFormError(error.message || 'An error occurred while updating the patient.');
            toast.error('Failed to update patient.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-3 m-auto">
            <div className="mb-3">
                <label htmlFor="first_name" className="form-label">First Name:</label>
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
                <label htmlFor="last_name" className="form-label">Last Name:</label>
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
                <label htmlFor="date_of_birth" className="form-label">Date of Birth:</label>
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
                <label htmlFor="gender" className="form-label">Gender:</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-control"
                    required
                >
                    <option value="" hidden>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select> 
            </div>
            <div className="mb-3">
                <label htmlFor="address" className="form-label">Address:</label>
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
                <label htmlFor="phone" className="form-label">Phone:</label>
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
                <label htmlFor="email" className="form-label">Email:</label>
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
                <label htmlFor="emergency_contact" className="form-label">Emergency Contact:</label>
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
                <label htmlFor="medical_history" className="form-label">Medical History:</label>
                <input
                    type="text"
                    id="medical_history"
                    name="medical_history"
                    value={formData.medical_history}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">Update Patient</button>
            {formError && <p className="text-danger mt-2">Error: {formError}</p>}
        </form>
    );
};

export default UpdatePatientForm;
