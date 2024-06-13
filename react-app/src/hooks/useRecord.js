import { useState, useEffect } from "react";
import { toast, Slide } from "react-toastify";

export function useRecord() {
    // Store and setter for records.
    const [records, setRecords] = useState([]);
    // State for displaying a loading page. Used for fetching data first before render.
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

    const fetchRecord = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/medical-records", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch records.");
            }

            const data = await response.json();
            setRecords(data.data);
        } catch (error) {
            console.error("Error fetching records:", error);
            notify("Error fetching records.", "error");
        } finally {
            setLoading(false);
        }
    };

    const add = async (record) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/medical-records/store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(record),
            });

            if (response.status === 409) {
                const data = await response.json();
                notify(`Error: ${data.message}`, "error");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to add record.");
            }

            fetchRecord();
            notify("Successfully created the record.", "success");
        } catch (error) {
            console.error("Error creating record:", error);
            notify("Error creating record.", "error");
        }
    };

    const update = async (recordId, updatedRecordData) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/medical-records/update/${recordId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(updatedRecordData),
            });

            if (response.status === 409) {
                const data = await response.json();
                notify(`Error: ${data.message}`, "error");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to update record.");
            }

            fetchRecord();
            notify("Successfully updated the record.", "success");
        } catch (error) {
            console.error("Error updating record:", error);
            notify("Error updating record.", "error");
        }
    };

    useEffect(() => {
        fetchRecord();
    }, []);

    return { loading, records, setRecords, add, update };
}
