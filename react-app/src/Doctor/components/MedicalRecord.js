import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useRecord } from "../../hooks/useRecord"; // Adjust path to useRecord hook
import Loading from "../../Default/components/Loading";
import MedicalRecordInformation from "./MedicalRecordInformation";
import AddRecordForm from "./Forms/AddRecordForm";
import UpdateRecordForm from "./Forms/UpdateRecordForm";

const MedicalRecord = () => {
    const { loading, records, add, update } = useRecord();
    const [isAddFormVisible, setAddFormVisible] = useState(false);
    const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);

    const handleAddClose = () => setAddFormVisible(false);
    const handleUpdateClick = (record) => {
        setCurrentRecord(record);
        setUpdateFormVisible(true);
    };
    const handleUpdateClose = () => {
        setUpdateFormVisible(false);
        setCurrentRecord(null);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container-md mt-5 mb-5 min-vh-100">
            <ToastContainer />
            <header className="d-flex justify-content-between mb-3">
                <h2>Medical Records</h2>
                <button className="btn btn-primary" onClick={() => setAddFormVisible(true)}>&#10009; Add Record</button>
            </header>

            {records.length > 0 ? (
                <div className="row">
                    {records.map((record) => (
                        <div className="col-md-4 mb-3" key={record.id}>
                            <MedicalRecordInformation
                                record={record}
                                onUpdateClick={handleUpdateClick}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="row m-2 p-2">
                    <div className="alert alert-warning text-center" role="alert">
                        You currently have no existing medical records.
                    </div>
                </div>
            )}

            {isAddFormVisible && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="addRecordModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="addRecordModalLabel">New Medical Record</h1>
                                    <button type="button" className="btn-close" onClick={handleAddClose} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <AddRecordForm add={add} onClose={handleAddClose} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isUpdateFormVisible && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="updateRecordModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="updateRecordModalLabel">Update Medical Record</h1>
                                    <button type="button" className="btn-close" onClick={handleUpdateClose} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <UpdateRecordForm record={currentRecord} update={update} onClose={handleUpdateClose} />
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

export default MedicalRecord;
