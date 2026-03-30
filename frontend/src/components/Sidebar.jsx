import React, { useState } from "react";
import { Offcanvas, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaDatabase,
  FaFileAlt,
  FaCog,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaStethoscope,
  FaNotesMedical,
  FaUserPlus
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openData, setOpenData] = useState(false);

  const linkStyle = ({ isActive }) => ({
    backgroundColor: isActive ? "#495057" : "transparent",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 15px",
    textDecoration: "none",
    transition: "all 0.2s ease",
  });

  return (
    <Offcanvas
      show={isOpen}
      onHide={toggleSidebar}
      backdrop
      placement="start"
      style={{ width: "250px" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="bg-dark text-white p-0">
        <Nav className="flex-column">

          {/* Dashboard */}
          <NavLink to="/" style={linkStyle} onClick={toggleSidebar}>
            <FaTachometerAlt /> Dashboard
          </NavLink>

          {/* Data Toggle */}
          <div
            onClick={() => setOpenData(!openData)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 15px",
            }}
          >
            <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <FaDatabase /> Data
            </span>
            <span
              style={{
                transition: "transform 0.3s",
                transform: openData ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <FaChevronDown />
            </span>
          </div>

          {/* Smooth animated dropdown */}
          <div
            style={{
              maxHeight: openData ? "500px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.4s ease",
            }}
          >
            <div className="ps-3">

              <NavLink to="/villages/create" style={linkStyle} onClick={toggleSidebar}>
                <FaMapMarkerAlt /> Add Village
              </NavLink>

              <NavLink to="/treatments/create" style={linkStyle} onClick={toggleSidebar}>
                <FaStethoscope /> Add Treatments
              </NavLink>

              <NavLink to="/diseases/create" style={linkStyle} onClick={toggleSidebar}>
                <FaNotesMedical /> Add Conditions
              </NavLink>

            </div>
          </div>

          {/* Add Patient (moved out) */}
          <NavLink to="/patients/create" style={linkStyle} onClick={toggleSidebar}>
            <FaUserPlus /> Add Patient
          </NavLink>

          {/* Reports */}
          <NavLink to="/reports" style={linkStyle} onClick={toggleSidebar}>
            <FaFileAlt /> Reports
          </NavLink>

          {/* Settings */}
          <NavLink to="/settings" style={linkStyle} onClick={toggleSidebar}>
            <FaCog /> Settings
          </NavLink>

        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;