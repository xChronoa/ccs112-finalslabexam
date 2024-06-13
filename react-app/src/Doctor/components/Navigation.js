import React from "react";
import useAuth from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";

const Navigation = () => {
    const { logout } = useAuth();

    return (
        <nav className="bg-dark navbar navbar-expand-lg d-flex justify-content-between align-items-center p-3">
            <ul className="navbar-nav mx-auto fs-6 gap-4">
                <li className="nav-item position-relative">    
                    <NavLink to="/doctor/patients" className="nav-link text-white text-center fw-bold px-3 rounded-2">Patients</NavLink>
                </li>
                <li className="nav-item position-relative">    
                    <NavLink to="/doctor/medical-records" className="nav-link text-white text-center fw-bold px-3 rounded-2">Medical Records</NavLink>
                </li>
                <li className="nav-item position-relative">
                    <NavLink
                        to="appointment"
                        className="nav-link text-white text-center fw-bold px-3 rounded-2"
                    >
                        Appointments
                    </NavLink>
                </li>
            </ul>
            <button onClick={logout}>Logout</button>
        </nav>
    );
};

export default Navigation;