import { useState, useEffect } from "react";
import { toast, Slide } from 'react-toastify';

export function useDoctor() {
    // Store and setter for doctor.
    const [doctors, setDoctor] = useState([]);

    // State for displaying a loading page. Used for fetching data first before render.
    const [loading, setLoading] = useState(true);

    const notify = (message, status) => {
        if(status === "success") {
            toast.success(message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
            return true
        } else if (status === "error") {
            toast.error(message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
            return false;
        }
    }

    const fetchDoctor = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/doctor/view");
            const data = await response.json();

            if (response.ok) {
                setDoctor(data.data);
            } else {
                throw new Error("Failed to fetch doctor.");
            }
        } catch (error) {
            console.error("Error fetching doctor:", error);
        } finally {
            // Set loading to false after fetching data, regardless of success or failure
            setLoading(false); 
        }
    };

    const addDoctor = async (doctor) => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/doctor/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(doctor),
                }
            );
    
            const data = await response.json();
    
            if (response.status === 409) {
                notify(`Error: ${data.message}`, "error");
                return false;
            }
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to add doctor.");
            }
    
            fetchDoctor();
            notify("Successfully created the doctor.", "success");
            return true; // Ensure it returns true on success
        } catch (error) {
            console.error("Error creating doctor:", error);
            notify(error.message, "error");
            return false; // Ensure it returns false on failure
        }
    };

    const updateDoctor = async (doctorId, updatedDoctorData) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/doctor/update/${doctorId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedDoctorData),
                }
            );

            if (response.status === 409) {
                // Handle doctor already exists scenario
                const data = await response.json();
                notify(`Error: ${data.message}`, "error");
                return;
            }
    
            if (!response.ok) {
                throw new Error("Failed to update doctor.");
            }
    
            // After successfully updating the doctor, fetch the updated list of doctor
            fetchDoctor();
            return notify("Successfully updated the doctor.", "success");
        } catch (error) {
            console.error("Error updating doctor:", error);
        }
    }

    // Remove from Cart
    const removeDoctor = async (doctorId) => {
        if (window.confirm("Are you sure you want to remove this doctor?")) {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/doctor/remove/${doctorId}`,
                    {
                        method: "DELETE",
                    }
                );
                
                if (!response.ok) {
                    throw new Error("Failed to remove doctor.");
                }

                fetchDoctor();
                return notify("Successfully deleted the doctor.", "success");
            } catch (error) {
                console.error("Error removing doctor:", error);
            }
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, []);

    return { loading, doctors, setDoctor, addDoctor, updateDoctor, removeDoctor};
}