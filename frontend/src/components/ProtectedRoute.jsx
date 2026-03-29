import { Navigate } from "react-router-dom";
import NavBar from "./NavBar";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("access_token");
    return token ? (
        <>
            <NavBar /> {children}
        </>
    ) : (
        <Navigate to="/login" />
    );
}
