import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { usePatient } from "../../hooks/usePatient";
import Loading from "../../Default/components/Loading";
import PatientInformation from "./PatientInformation";
import AddPatientForm from "./Forms/AddPatientForm";
import UpdatePatientForm from "./Forms/UpdatePatientForm";
import { useUser } from "../../hooks/useUser";

const Patient = () => {
    const { loading, patients, addPatient, updatePatient, removePatient } = usePatient();
    const { addUser } = useUser();
    const [isAddFormVisible, setAddFormVisible] = useState(false);
    const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null);

    const handleAddClose = () => setAddFormVisible(false);
    const handleUpdateClick = (patient) => {
        setCurrentPatient(patient);
        setUpdateFormVisible(true);
    };
    const handleUpdateClose = () => {
        setUpdateFormVisible(false);
        setCurrentPatient(null);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container-md mt-5 mb-5 min-vh-100">
            <ToastContainer />
            <header className="d-flex justify-content-between mb-3">
                <h2>Patients</h2>
                <button className="btn btn-primary" onClick={() => setAddFormVisible(true)}>&#10009; Add Patient</button>
            </header>

            {patients.length > 0 ? (
                <div className="row">
                    {patients.map((patient) => (
                        <PatientInformation
                            key={patient.id}
                            patient={patient}
                            removePatient={removePatient}
                            onUpdateClick={handleUpdateClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="row m-2 p-2">
                    <div className="alert alert-warning text-center" role="alert">
                        There are currently no patients.
                    </div>
                </div>
            )}

            {isAddFormVisible && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="addPatientModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="addPatientModalLabel">New Patient</h1>
                                    <button type="button" className="btn-close" onClick={handleAddClose} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <AddPatientForm addPatient={addPatient} addUser={addUser} onClose={handleAddClose} />
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
                                    <h1 className="modal-title fs-5" id="updatePatientModalLabel">Update Patient</h1>
                                    <button type="button" className="btn-close" onClick={handleUpdateClose} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <UpdatePatientForm patient={currentPatient} updatePatient={updatePatient} onClose={handleUpdateClose} />
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

export default Patient;
