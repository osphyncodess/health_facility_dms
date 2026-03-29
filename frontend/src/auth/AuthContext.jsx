import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const navigate = useNavigate();

    const login = async data => {
        console.log(data);
        const res = await api.post("/auth/login.php", data);

        console.log(res.data);

        if (!res.data.success) {
            alert(res.data.error);
            return;
        }

        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setUser(res.data.user);
        navigate("/");
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/login")
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
