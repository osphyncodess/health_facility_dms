import React from "react";
import { Offcanvas, Nav, Button } from "react-bootstrap";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <Offcanvas
        show={isOpen}
        onHide={toggleSidebar}
        backdrop={true}
        placement="start"
        style={{ width: "250px" }}
      >
        <Offcanvas.Header closeButton closeLabel="Close sidebar">
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-dark text-white p-0">
          <Nav className="flex-column">
            <Nav.Link
              href="#dashboard"
              className="text-white py-2 px-3 hover-bg-light"
              style={{ transition: "0.2s" }}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              href="#users"
              className="text-white py-2 px-3 hover-bg-light"
              style={{ transition: "0.2s" }}
            >
              Users
            </Nav.Link>
            <Nav.Link
              href="#settings"
              className="text-white py-2 px-3 hover-bg-light"
              style={{ transition: "0.2s" }}
            >
              Settings
            </Nav.Link>
            <Nav.Link
              href="#reports"
              className="text-white py-2 px-3 hover-bg-light"
              style={{ transition: "0.2s" }}
            >
              Reports
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;