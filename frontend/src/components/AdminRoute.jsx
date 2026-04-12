import React from "react";
import { Navigate } from "react-router-dom";
import NavBar from "./NavBar";

/**
 * AdminRoute
 * Wrap your admin-only pages with this component.
 * Redirects non-admin users to home or login.
 */
export default function AdminRoute({ children }) {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is not admin, redirect to home (or other page)
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If admin, render children
  return (
    <>
      <NavBar /> {children}
    </>
  );
}
