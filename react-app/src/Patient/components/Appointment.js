import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useAppointment } from "../../hooks/useAppointment"; // Adjust path to useAppointment hook
import Loading from "../../Default/components/Loading";
import AppointmentInformation from "./AppointmentInformation";
import BookAppointmentForm from "./Forms/BookAppointmentForm";
import UpdateAppointmentForm from "./Forms/UpdateAppointmentForm";

const Appointment = () => {
    const { loading, appointments, addAppointment, updateAppointment, cancelAppointment } = useAppointment();
    const [isAddFormVisible, setAddFormVisible] = useState(false);
    const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);

    const handleAddClose = () => setAddFormVisible(false);
    const handleUpdateClick = (appointment) => {
        setCurrentAppointment(appointment);
        setUpdateFormVisible(true);
    };
    const handleUpdateClose = () => {
        setUpdateFormVisible(false);
        setCurrentAppointment(null);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container-md mt-5 mb-5 min-vh-100">
            <ToastContainer />
            <header className="d-flex justify-content-between mb-3">
                <h2>Appointments</h2>
                <button className="btn btn-primary" onClick={() => setAddFormVisible(true)}>&#10009; Book Appointment</button>
            </header>

            {appointments.length > 0 ? (
                <div className="row">
                    {appointments.map((appointment) => (
                        <div className="col-md-4 mb-3" key={appointment.id}>
                            <AppointmentInformation
                                appointment={appointment}
                                onCancelClick={cancelAppointment}
                                onUpdateClick={handleUpdateClick}
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

            {isAddFormVisible && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="addAppointmentModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="addAppointmentModalLabel">New Appointment</h1>
                                    <button type="button" className="btn-close" onClick={handleAddClose} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <BookAppointmentForm addAppointment={addAppointment} onClose={handleAddClose} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isUpdateFormVisible && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="updateAppointmentModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="updateAppointmentModalLabel">Update Appointment</h1>
                                    <button type="button" className="btn-close" onClick={handleUpdateClose} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <UpdateAppointmentForm appointment={currentAppointment} updateAppointment={updateAppointment} onClose={handleUpdateClose} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleUpdateClose}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Appointment;
