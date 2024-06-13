import React, { useState, useEffect } from 'react';
import { usePatient } from "../../../hooks/usePatient"; // Adjust the path to where your usePatient hook is located
import Loading from '../../../Default/components/Loading';

const AddRecordForm = (props) => {
    // Initialize the usePatient hook
    const { patients, loading } = usePatient();

    // State to store form data
    const [formData, setFormData] = useState({
        patient_id: '',
        visit_date: '',
        diagnosis: '',
        treatment: '',
        notes: ''
    });

    // State to store form error
    const [formError, setFormError] = useState(null);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset error before submission
        setFormError(null);

        try {
            // Check if the operation is successful, if not then don't close the modal.
            const isAdded = await props.add(formData);
            if (isAdded) {
                props.onClose();
            } else {
                setFormError('Failed to add patient.'); // Set form error if add fails
            }
        } catch (error) {
            setFormError(error.message || 'An error occurred while adding the patient.');
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-3 m-auto">
            <div className="mb-3">
                <label htmlFor="patient_id" className="form-label">Patient ID:</label>
                <select
                    id="patient_id"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    className="form-control"
                    required
                >
                    <option value="" disabled>Select Patient ID</option>
                    {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="visit_date" className="form-label">Visit Date:</label>
                <input
                    type="date"
                    id="visit_date"
                    name="visit_date"
                    value={formData.visit_date}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="diagnosis" className="form-label">Diagnosis:</label>
                <input
                    type="text"
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="treatment" className="form-label">Treatment:</label>
                <input
                    type="text"
                    id="treatment"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes:</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="form-control"
                    required
                ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary">Create Record</button>
            {formError && <p className="text-danger mt-2">Error: {formError}</p>}
        </form>
    );
};

export default AddRecordForm;
