import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useDoctor } from "../../hooks/useDoctor";
import { useAppointment } from "../../hooks/useAppointment";
import Loading from "../../Default/components/Loading";
import DoctorInformation from "./DoctorInformation";
import BookAppointmentForm from "./Forms/BookAppointmentForm";

const Doctor = () => {
    const { loading, doctors } = useDoctor();
    const { addAppointment } = useAppointment();
    const [isAddFormVisible, setAddFormVisible] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const handleAddClose = () => setAddFormVisible(false);
    const handleBookAppointmentClick = (doctor) => {
        setSelectedDoctor(doctor);
        setAddFormVisible(true);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container-md mt-5 mb-5 min-vh-100">
            <ToastContainer />
            <header className="d-flex justify-content-between mb-3">
                <h2>Doctors</h2>
            </header>

            {doctors.length > 0 ? (
                <div className="row">
                    {doctors.map((doctor) => (
                        <DoctorInformation
                            key={doctor.id}
                            doctor={doctor}
                            onBookAppointmentClick={() => handleBookAppointmentClick(doctor)}
                        />
                    ))}
                </div>
            ) : (
                <div className="row m-2 p-2">
                    <div className="alert alert-warning text-center" role="alert">
                        There are currently no doctors.
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
                                    <BookAppointmentForm doctor={selectedDoctor} addAppointment={addAppointment} onClose={handleAddClose} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Doctor;
