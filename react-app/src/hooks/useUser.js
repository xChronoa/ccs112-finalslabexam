import { useState, useEffect } from "react";
import { toast, Slide } from "react-toastify";

export function useUser() {
    // Store and setter for user.
    const [users, setUsers] = useState([]);

    // State for displaying a loading page. Used for fetching data first before render.
    const [loading, setLoading] = useState(true);

    const notify = (message, status) => {
        if (status === "success") {
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
            return true;
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
    };

    const fetchUser = async () => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/user/view",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            const data = await response.json();

            if (response.ok) {
                setUsers(data.data);
            } else {
                throw new Error("Failed to fetch user.");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            // Set loading to false after fetching data, regardless of success or failure
            setLoading(false);
        }
    };

    // Add to Cart Functionality
    const addUser = async (user) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/user/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(user),
            });

            if (response.status === 409) {
                // Handle user already exists scenario
                const data = await response.json();
                notify(`Error: ${data.message}`, "error");
                return;
            }

            if (response.status === 400) {
                // Handle validation error (password length)
                const data = await response.json();
                if (data.errors && data.errors.password) {
                    notify(data.errors.password[0], "error");
                } else {
                    notify("Failed to add user.", "error");
                }
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to add user.");
            }

            fetchUser();
            return notify("Successfully created the user.", "success");
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const updateUser = async (userId, updatedUserData) => {
        console.log(updatedUserData);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/user/update/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify(updatedUserData),
                }
            );

            const data = await response.json();

            if (response.status === 409) {
                notify(`Error: ${data.message}`, "error");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to update user.");
            }

            // After successfully updating the user, fetch the updated list of users
            fetchUser();
            return notify("Successfully updated the user.", "success");
        } catch (error) {
            console.error("Error updating user:", error);
            notify("Failed to update user.", "error");
        }
    };

    // Remove from Cart
    const removeUser = async (userId) => {
        if (window.confirm("Are you sure you want to remove this user?")) {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/user/remove/${userId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to remove user.");
                }

                fetchUser();
                return notify("Successfully deleted the user.", "success");
            } catch (error) {
                console.error("Error removing user:", error);
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return { loading, users, setUsers, addUser, updateUser, removeUser };
}
