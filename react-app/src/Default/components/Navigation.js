import React from "react";
import useAuth from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";

const Navigation = () => {
    const { logout } = useAuth();

    return (
        <nav className="bg-dark navbar navbar-expand-lg d-flex justify-content-between align-items-center p-3">
            <h4 className="text-white text-uppercase m-0">
                Hospital Management System
            </h4>
            <ul className="navbar-nav fs-6 gap-4">
                <li className="nav-item position-relative">
                    <NavLink
                        to="/"
                        className="nav-link text-white text-center fw-bold px-3 rounded-2"
                    >
                        Login
                    </NavLink>
                </li>
                <li className="nav-item position-relative">
                    <NavLink
                        to="/doctors"
                        className="nav-link text-white text-center fw-bold px-3 rounded-2"
                    >
                        List of Doctors
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
