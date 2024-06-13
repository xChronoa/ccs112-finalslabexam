import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8000/api/user/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                }
            );

            if (response.ok) {
                const data = await response.json();
                // Store token in local storage or session storage
                localStorage.setItem("token", data.token);
                setIsAuthenticated(true);
                notify("Successfully logged in.", "success");

                // Redirect based on user role
                const role = data.user.role;
                switch (role) {
                    case "Admin":
                        navigate("/admin");
                        break;
                    case "Doctor":
                        navigate("/doctor");
                        break;
                    case "Receptionist":
                        navigate("/receptionist");
                        break;
                    case "Patient":
                        navigate("/patient");
                        break;
                    default:
                        navigate("/");
                }
            } else {
                throw new Error("Invalid credentials");
            }
        } catch (error) {
            notify(
                "Login failed. Please check your credentials and try again.",
                "error"
            );
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8000/api/user/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                }
            );

            const data = await response.json();

            if (response.ok) {
                notify("Registration successful. Please log in.", "success");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else if (response.status === 422) {
                // Handle specific validation errors
                if (data.errors && data.errors.email) {
                    notify(data.errors.email[0], "error"); // Email already exists
                } else if (data.message) {
                    notify(data.message, "error"); // Other validation errors
                } else {
                    notify("Registration failed.", "error");
                }
            } else {
                throw new Error(data.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            notify(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setLoading(true);
        try {
            // Clear token from local storage or session storage
            localStorage.removeItem("token");
            setIsAuthenticated(false);

            notify("Successfully logged out.", "success");

            setTimeout(() => {
                navigate("/");
            }, 1250);
        } catch (error) {
            console.error("Logout error:", error);
            notify("Logout failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return {
        isAuthenticated,
        login,
        register,
        logout,
        loading,
        notify,
    };
};

export default useAuth;
