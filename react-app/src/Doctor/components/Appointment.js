import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useAppointment } from "../../hooks/useAppointment"; // Adjust path to useAppointment hook
import Loading from "../../Default/components/Loading";
import AppointmentInformation from "./AppointmentInformation";

const Appointment = () => {
    const { loading, appointments } = useAppointment();

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container-md mt-5 mb-5 min-vh-100">
            <ToastContainer />
            <header className="d-flex justify-content-between mb-3">
                <h2>Scheduled Appointments</h2>
            </header>

            {appointments.length > 0 ? (
                <div className="row">
                    {appointments.map((appointment) => (
                        <div className="col-md-4 mb-3" key={appointment.id}>
                            <AppointmentInformation
                                appointment={appointment}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="row m-2 p-2">
                    <div className="alert alert-warning text-center" role="alert">
                        You currently have no scheduled appointments.
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointment;
