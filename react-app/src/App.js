import { BrowserRouter, Route, Routes } from "react-router-dom";

// Default
import DefaultLayout from "./Default/components/DefaultLayout";
import Login from "./Default/components/Login";
import Register from "./Default/components/Register";
import DoctorDefault from "./Default/components/Doctor";

// Admin
import AdminLayout from "./Admin/components/AdminLayout";
import User from "./Admin/components/User";
import Doctor from "./Admin/components/Doctor";
import Patient from "./Doctor/components/Patient";

// Doctor
import DoctorLayout from "./Doctor/components/DoctorLayout";
import MedicalRecordDoctor from "./Doctor/components/MedicalRecord";
import DoctorPatient from "./Doctor/components/Patient";
import DoctorAppointment from "./Doctor/components/Appointment";

// Receptionist
import ReceptionistLayout from "./Receptionist/components/ReceptionistLayout";
import ReceptionistPatient from "./Receptionist/components/Patient";
import ReceptionistAppointment from "./Receptionist/components/Appointment";
import ReceptionistDoctor from "./Receptionist/components/Doctor";

// Patient
import PatientLayout from "./Patient/components/PatientLayout";
import MedicalRecordPatient from "./Patient/components/MedicalRecord";
import PatientDoctor from "./Patient/components/Doctor";
import Appointment from "./Patient/components/Appointment";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {/* Default Layout */}
                    <Route path="/" element={<DefaultLayout />}>
                        <Route index element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="doctors" element={<DoctorDefault />} />
                    </Route>

                    {/* Admin Layout */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<User />} />
                        <Route path="manage/users" element={<User />} />
                        <Route path="manage/doctors" element={<Doctor />} />
                        <Route path="manage/patients" element={<Patient />} />
                    </Route>

                    {/* Doctor Layout */}
                    <Route path="/doctor" element={<DoctorLayout />}>
                        <Route index element={<DoctorPatient />} />
                        <Route path="patients" element={<DoctorPatient />} />
                        <Route path="medical-records" element={<MedicalRecordDoctor />} />
                        <Route path="appointment" element={<DoctorAppointment />} />
                    </Route>

                    {/* Receptionist Layout */}
                    <Route path="/receptionist" element={<ReceptionistLayout />}>
                        <Route index element={<ReceptionistPatient />} />
                        <Route path="patients" element={<ReceptionistPatient />} />
                        <Route path="doctors" element={<ReceptionistDoctor />} />
                        <Route path="appointment" element={<ReceptionistAppointment />} />
                    </Route>

                    {/* Patient Layout */}
                    <Route path="/patient" element={<PatientLayout />}>
                        <Route index element={<MedicalRecordPatient />} />
                        <Route path="medical-records" element={<MedicalRecordPatient />} />
                        <Route path="doctors" element={<PatientDoctor />} />
                        <Route path="appointment" element={<Appointment />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;