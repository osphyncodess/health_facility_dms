import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // 🔐 Initialize auth (runs once)
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get("/auth/me.php", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.data.success) {
                    setUser(res.data.user);
                } else {
                    logout();
                }
            } catch (err) {
                console.error("Auth error:", err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // 🔑 Login
    const login = async data => {
        try {
            const res = await api.post("/auth/login.php", data);

            if (!res.data.success) {
                alert(res.data.error || "Login failed");
                return false;
            }

            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            setUser(res.data.user);
            navigate("/");

            return true;
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong");
            return false;
        }
    };

    // 🚪 Logout
    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    // 🔄 Optional: Refresh user manually
    const refreshUser = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) return logout();

        try {
            const res = await api.get("/auth/me.php", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                setUser(res.data.user);
            } else {
                logout();
            }
        } catch {
            logout();
        }
    };

    // 🧠 Auth state helpers
    const isAuthenticated = !!user;

    var isAdmin = false;
   console.log(user)
    isAuthenticated && (isAdmin = user.role === "admin");

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshUser,
                isAuthenticated,
                isAdmin
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}
