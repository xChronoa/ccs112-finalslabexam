import React from "react";
import useAuth from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";

const Navigation = () => {
    const { logout } = useAuth();

    return (
        <nav className="bg-dark navbar navbar-expand-lg d-flex justify-content-between align-items-center p-3">
            <ul className="navbar-nav mx-auto fs-6 gap-4">
                <li className="nav-item position-relative">    
                    <NavLink to="/admin/manage/users" className="nav-link text-white text-center fw-bold px-3 rounded-2">Manage Users</NavLink>
                </li>
                <li className="nav-item position-relative">    
                    <NavLink to="/admin/manage/doctors" className="nav-link text-white text-center fw-bold px-3 rounded-2">Manage Doctors</NavLink>
                </li>
                <li className="nav-item position-relative">    
                    <NavLink to="/admin/manage/patients" className="nav-link text-white text-center fw-bold px-3 rounded-2">Manage Patients</NavLink>
                </li>
            </ul>
            <button onClick={logout}>Logout</button>
        </nav>
    );
};

export default Navigation;