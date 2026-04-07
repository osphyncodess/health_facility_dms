import { useState } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  CardFooter,
  CardTitle,
} from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { Grid } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const CreatePatients = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <Button
          onClick={() => navigate("/patients/")}
          className="btn-secondary"
        >
          <FaArrowLeft />
        </Button>
        <h1>OPD Data Collection</h1>
      </div>

      <div
        style={{ display: "Grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <Card>
          <CardTitle>
            <h2>Excel Like</h2>
          </CardTitle>
          <CardBody>
            <p>
              Add ODP data in excel like way, good for fast data entry when
              patient is not available.
            </p>
            <Button onClick={() => navigate("/patients/create/excel-like")}>
              Collect
            </Button>
          </CardBody>
          <CardFooter>@Osphyncodes</CardFooter>
        </Card>

        <Card>
          <CardTitle>
            <h2>Using Form</h2>
          </CardTitle>
          <CardBody>
            <p>
              Use a well designed form with swipe navigations for entering OPD
              Data, Suitable for Point of Care, when the client is available.
            </p>
            <Button onClick={() => navigate("/patients/create/form")}>
              Collect
            </Button>
          </CardBody>
          <CardFooter>@Osphyncodes</CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreatePatients;
