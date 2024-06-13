import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useDoctor } from "../../hooks/useDoctor";
import { useUser } from "../../hooks/useUser";
import Loading from "../../Default/components/Loading";
import DoctorInformation from "./DoctorInformation";
import AddDoctorForm from "./Forms/AddDoctorForm";
import UpdateDoctorForm from "./Forms/UpdateDoctorForm";

const Doctor = () => {
    const { loading, doctors, addDoctor, updateDoctor, removeDoctor } = useDoctor();
    const { addUser } = useUser();
    const [isAddFormVisible, setAddFormVisible] = useState(false);
    const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState(null);

    const handleAddClose = () => setAddFormVisible(false);
    const handleUpdateClick = (doctor) => {
        setCurrentDoctor(doctor);
        setUpdateFormVisible(true);
    };
    const handleUpdateClose = () => {
        setUpdateFormVisible(false);
        setCurrentDoctor(null);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container-md mt-5 mb-5 min-vh-100">
            <ToastContainer />
            <header className="d-flex justify-content-between mb-3">
                <h2>Doctors</h2>
                <button className="btn btn-primary" onClick={() => setAddFormVisible(true)}>&#10009; Add Doctor</button>
            </header>

            {doctors.length > 0 ? (
                <div className="row">
                    {doctors.map((doctor) => (
                        <DoctorInformation
                            key={doctor.id}
                            doctor={doctor}
                            remove={removeDoctor}
                            onUpdateClick={handleUpdateClick}
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
                    <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="addDoctorModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="addDoctorModalLabel">New Doctor</h1>
                                    <button type="button" className="btn-close" onClick={handleAddClose} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <AddDoctorForm addDoctor={addDoctor} addUser={addUser} onClose={handleAddClose} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isUpdateFormVisible && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="updatePatientModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="updatePatientModalLabel">Update Doctor</h1>
                                    <button type="button" className="btn-close" onClick={handleUpdateClose} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <UpdateDoctorForm doctor={currentDoctor} update={updateDoctor} onClose={handleUpdateClose} />
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

export default Doctor;
