import React, { useState, useEffect } from 'react';
import { usePatient } from "../../../hooks/usePatient"; // Adjust path to where your usePatient hook is located
import { useDoctor } from "../../../hooks/useDoctor"; // Adjust path to where your useDoctor hook is located
import Loading from '../../../Default/components/Loading';

const BookAppointmentForm = ({ doctor, addAppointment, onClose }) => {
    const { patients, loading: patientLoading } = usePatient();
    const { doctors, loading: doctorLoading } = useDoctor();

    const [formData, setFormData] = useState({
        patient_id: '', // This will be set automatically based on logged-in patient
        doctor_id: doctor ? doctor.id : '',
        appointment_date: '',
        reason: ''
    });

    const [formError, setFormError] = useState(null);

    useEffect(() => {
        // Assuming you have a way to get the currently logged-in patient ID
        // Set the patient_id in formData when patients are loaded
        if (patients.length > 0) {
            setFormData((prevFormData) => ({
                ...prevFormData
            }));
        }
    }, [patients]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        try {
            const isAdded = await addAppointment(formData);
            if (isAdded) {
                onClose();
            } else {
                setFormError('Failed to add appointment.');
            }
        } catch (error) {
            setFormError(error.message || 'An error occurred while adding the appointment.');
        }
    };

    if (patientLoading || doctorLoading) {
        return <Loading />;
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-3 m-auto">
            <div className="mb-3">
                <label htmlFor="patient_id" className="form-label">Patient:</label>
                <select
                    id="patient_id"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    className="form-control"
                >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="doctor_id" className="form-label">Doctor:</label>
                <select
                    id="doctor_id"
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    className="form-control"
                    required
                    disabled={!!doctor} // Disable if doctor is provided
                >
                    <option value="" disabled>Select Doctor</option>
                    {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                            {doc.first_name} {doc.last_name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="appointment_date" className="form-label">Appointment Date:</label>
                <input
                    type="datetime-local"
                    id="appointment_date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="reason" className="form-label">Reason:</label>
                <input
                    type="text"
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            
            <button type="submit" className="btn btn-primary">Book Appointment</button>
            {formError && <p className="text-danger mt-2">Error: {formError}</p>}
        </form>
    );
};

export default BookAppointmentForm;
