import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useDoctor } from "../../hooks/useDoctor";
import Loading from "../../Default/components/Loading";
import DoctorInformation from "./DoctorInformation";

const Doctor = () => {
    const { loading, doctors } = useDoctor();

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
        </div>
    );
};

export default Doctor;
