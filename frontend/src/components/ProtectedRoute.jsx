import { Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import { AuthContext } from "../auth/AuthContext";
import { useContext } from "react";

export default function ProtectedRoute({ children }) {
    const {isAuthenticated} = useContext(AuthContext)

    return isAuthenticated ? (
        <>
            <NavBar /> {children}
        </>
    ) : (
        <Navigate to="/login" />
    );
}
