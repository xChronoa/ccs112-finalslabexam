import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { usePatient } from '../../../hooks/usePatient';

const UpdateRecordForm = ({ record, update, onClose }) => {
    const { id, patient_id, visit_date, diagnosis, treatment, notes } = record;
    const { patients } = usePatient();

    const [formData, setFormData] = useState({ id, patient_id, visit_date, diagnosis, treatment, notes });
    const [formError, setFormError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const isUpdated = await update(id, formData);
            if (isUpdated) {
                onClose();
            } else {
                setFormError('Failed to update record.');
            }
        } catch (error) {
            setFormError(error.message || 'An error occurred while updating the record.');
            toast.error('Failed to update record.');
        }
    };

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
                    disabled
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
                    disabled
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
            <button type="submit" className="btn btn-primary">Update Patient</button>
            {formError && <p className="text-danger mt-2">Error: {formError}</p>}
        </form>
    );
};

export default UpdateRecordForm;