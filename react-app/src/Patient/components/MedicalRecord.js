import React from "react";
import { ToastContainer } from 'react-toastify';
import { useRecord } from "../../hooks/useRecord";
import Loading from "../../Default/components/Loading";
import MedicalRecordInformation from "./MedicalRecordInformation";

const MedicalRecord = () => {
    const { loading, records } = useRecord();

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container-md mt-5 mb-5 min-vh-100">
            <ToastContainer />
            <header className="d-flex justify-content-between mb-3">
                <h2>Medical Records</h2>
            </header>

            {records.length > 0 ? (
                <div className="row">
                    {records.map((record) => (
                        <MedicalRecordInformation
                            key={record.id}
                            record={record}
                        />
                    ))}
                </div>
            ) : (
                <div className="row m-2 p-2">
                    <div className="alert alert-warning text-center" role="alert">
                        You currently have no existing medical records.
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalRecord;