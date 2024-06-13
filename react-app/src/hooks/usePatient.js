import { useState, useEffect } from "react";
import { toast, Slide } from 'react-toastify';

export function usePatient() {
    // Store and setter for patient.
    const [patients, setPatient] = useState([]);

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

    const fetchPatient = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/patient/view");
            const data = await response.json();

            if (response.ok) {
                setPatient(data.data);
            } else {
                throw new Error("Failed to fetch patient.");
            }
        } catch (error) {
            console.error("Error fetching patient:", error);
        } finally {
            // Set loading to false after fetching data, regardless of success or failure
            setLoading(false); 
        }
    };

    const addPatient = async (patient) => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/patient/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(patient),
                }
            );
    
            const data = await response.json();
    
            if (response.status === 409) {
                notify(`Error: ${data.message}`, "error");
                return false;
            }
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to add patient.");
            }
    
            fetchPatient();
            notify("Successfully created the patient.", "success");
            return true; // Ensure it returns true on success
        } catch (error) {
            console.error("Error creating patient:", error);
            notify(error.message, "error");
            return false; // Ensure it returns false on failure
        }
    };

    const updatePatient = async (patientId, updatedPatientData) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/patient/update/${patientId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedPatientData),
                }
            );

            if (response.status === 409) {
                // Handle patient already exists scenario
                const data = await response.json();
                notify(`Error: ${data.message}`, "error");
                return;
            }
    
            if (!response.ok) {
                throw new Error("Failed to update patient.");
            }
    
            // After successfully updating the patient, fetch the updated list of patient
            fetchPatient();
            return notify("Successfully updated the patient.", "success");
        } catch (error) {
            console.error("Error updating patient:", error);
        }
    }

    // Remove from Cart
    const removePatient = async (patientId) => {
        if (window.confirm("Are you sure you want to remove this patient?")) {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/patient/remove/${patientId}`,
                    {
                        method: "DELETE",
                    }
                );
                
                if (!response.ok) {
                    throw new Error("Failed to remove patient.");
                }

                fetchPatient();
                return notify("Successfully deleted the patient.", "success");
            } catch (error) {
                console.error("Error removing patient:", error);
            }
        }
    };

    useEffect(() => {
        fetchPatient();
    }, []);

    return { loading, patients, setPatient, addPatient, updatePatient, removePatient};
}