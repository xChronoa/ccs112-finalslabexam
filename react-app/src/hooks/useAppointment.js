import { useState, useEffect } from "react";
import { toast, Slide } from "react-toastify";

export function useAppointment() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const notify = (message, status) => {
        const options = {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
            transition: Slide,
        };
        
        if (status === "success") {
            toast.success(message, options);
        } else if (status === "error") {
            toast.error(message, options);
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/appointments", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch appointments.");
            }

            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            notify("Error fetching appointments.", "error");
        } finally {
            setLoading(false);
        }
    };

    const addAppointment = async (appointment) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/appointments/store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(appointment),
            });

            if (response.status === 409) {
                const data = await response.json();
                notify(`Error: ${data.message}`, "error");
                return false;
            }

            if (!response.ok) {
                throw new Error("Failed to add appointment.");
            }

            fetchAppointments();
            notify("Successfully created the appointment.", "success");
            return true;
        } catch (error) {
            console.error("Error creating appointment:", error);
            notify("Error creating appointment.", "error");
            return false;
        }
    };

    const updateAppointment = async (appointmentId, updatedAppointmentData) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/appointments/update/${appointmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(updatedAppointmentData),
            });

            if (response.status === 409) {
                const data = await response.json();
                notify(`Error: ${data.message}`, "error");
                return false;
            }

            if (!response.ok) {
                throw new Error("Failed to update appointment.");
            }

            fetchAppointments();
            notify("Successfully updated the appointment.", "success");
            return true;
        } catch (error) {
            console.error("Error updating appointment:", error);
            notify("Error updating appointment.", "error");
            return false;
        }
    };

    const cancelAppointment = async (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/appointments/cancel/${appointmentId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Failed to cancel appointment.");
                }
    
                fetchAppointments();
                notify("Appointment cancelled successfully.", "success");
                return true;
            } catch (error) {
                console.error("Error cancelling appointment:", error);
                notify("Error cancelling appointment.", "error");
                return false;
            }
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return { loading, appointments, addAppointment, updateAppointment, cancelAppointment };
}
