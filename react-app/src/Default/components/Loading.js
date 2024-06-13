import React from "react";

// Component used for displaying loading screen.
// Used to provide enough time to fetch data and render after fetched.
export default function Loading() {
    return (
        <div className="d-flex fs-1 justify-content-center align-items-center min-vh-100">
            <div className="loading-overlay">
                <div className="spinner-border text-light" role="status">
                </div>
            </div>
        </div>
    );
};