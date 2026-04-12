import React, { useState, useContext } from "react";
import { FaBars } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import Sidebar from "./Sidebar";
import { AuthContext } from "../auth/AuthContext";

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user, isAdmin } = useContext(AuthContext);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const currentUser = {
    name: user.name,
  };

  function handleLogout(e) {
    logout();
  }
  return (
    <>
      {/* Top Navbar */}
      <nav
        className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between"
        style={{ position: "sticky", top: 0, zIndex: 1001 }}
      >
        <div className="d-flex align-items-center">
          <FaBars
            size={24}
            color="white"
            style={{ cursor: "pointer" }}
            onClick={toggleSidebar}
          />
        </div>

        <div className="d-flex align-items-center">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="dark"
              id="dropdown-basic"
              className="d-flex align-items-center"
            >
              <span className="me-2">{currentUser.name}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav>

      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}
    </>
  );
};

export default NavBar;
