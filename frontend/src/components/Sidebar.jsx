import React, { useContext, useEffect, useState } from "react";
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
  FaUserPlus,
  FaUser,
  FaBell,
} from "react-icons/fa";

import { MdBloodtype } from "react-icons/md";
import { AuthContext } from "../auth/AuthContext";
import api from "../api";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openData, setOpenData] = useState(false);
  const [openPatients, setOpenPatients] = useState(false);
  const { isAdmin } = useContext(AuthContext);
  const [issues, setIssues] = useState(0);

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

  useEffect(() => {
    api.get("/issues/ari_urti.php")
    .then(res => setIssues(res.data))
    .catch(e=>console.log(e))
  }, []);

  return (
    <Offcanvas
      show={isOpen}
      onHide={toggleSidebar}
      backdrop
      placement="start"
      style={{
        width: "250px",
      }}
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
          {isAdmin && (
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
              <span
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
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
          )}

          {/* Smooth animated dropdown */}
          {isAdmin && (
            <div
              style={{
                maxHeight: openData ? "500px" : "0px",
                overflow: "hidden",
                transition: "max-height 0.4s ease",
              }}
            >
              <div className="ps-3">
                <NavLink
                  to="/villages/create"
                  style={linkStyle}
                  onClick={toggleSidebar}
                >
                  <FaMapMarkerAlt /> Add Village
                </NavLink>

                <NavLink
                  to="/treatments/create"
                  style={linkStyle}
                  onClick={toggleSidebar}
                >
                  <FaStethoscope /> Add Treatments
                </NavLink>

                <NavLink
                  to="/diseases/create"
                  style={linkStyle}
                  onClick={toggleSidebar}
                >
                  <FaNotesMedical /> Add Conditions
                </NavLink>
              </div>
            </div>
          )}

          {/* Patients Toggle */}
          {isAdmin && (
            <div
              onClick={() => setOpenPatients(!openPatients)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 15px",
              }}
            >
              <span
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <FaUser /> Patients
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
          )}

          {/* Smooth animated Patients dropdown */}
          {isAdmin && (
            <div
              style={{
                maxHeight: openPatients ? "500px" : "0px",
                overflow: "hidden",
                transition: "max-height 0.4s ease",
              }}
            >
              <div className="ps-3">
                <NavLink
                  to="/patients/create"
                  style={linkStyle}
                  onClick={toggleSidebar}
                >
                  <FaUserPlus /> Add Patient
                </NavLink>

                <NavLink
                  to="/patients/manage/"
                  style={linkStyle}
                  onClick={toggleSidebar}
                >
                  <FaStethoscope /> Manage Patients
                </NavLink>
              </div>
            </div>
          )}

          {isAdmin && (
            <NavLink
              to="/labs/create"
              style={linkStyle}
              onClick={toggleSidebar}
            >
              <MdBloodtype /> Collect Lab Data
            </NavLink>
          )}

          {/* Reports */}
          <NavLink to="/reports" style={linkStyle} onClick={toggleSidebar}>
            <FaFileAlt /> Reports
          </NavLink>

          {/* Settings */}
          <NavLink to="/settings" style={linkStyle} onClick={toggleSidebar}>
            <FaCog /> Settings
          </NavLink>

          {/* Settings */}
          <NavLink to="/alerts" style={linkStyle} onClick={toggleSidebar}>
            <FaBell /> <span className="badge-span">Alerts ({issues.ari_over_five + issues.urti_less_five})</span>
          </NavLink>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;
