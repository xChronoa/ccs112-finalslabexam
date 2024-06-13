import React, { useState } from 'react';
import { toast } from 'react-toastify';

const UpdateAppointmentForm = ({ appointment, updateAppointment, onClose }) => {
    const { id, appointment_date, reason } = appointment;

    const [formData, setFormData] = useState({ appointment_date, reason });

    const [formError, setFormError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (await updateAppointment(id, formData)) {
                onClose();
            }
        } catch (error) {
            setFormError(error.message || 'An error occurred while updating the appointment.');
            toast.error('Failed to update appointment.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-3 m-auto">
            <div className="mb-3">
                <label htmlFor="appointment_date" className="form-label">Appointment Date:</label>
                <input
                    type="date"
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
            
            <button type="submit" className="btn btn-primary">Reschedule Appointment</button>
            {formError && <p className="text-danger mt-2">Error: {formError}</p>}
        </form>
    );
};

export default UpdateAppointmentForm;
