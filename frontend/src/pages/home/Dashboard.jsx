import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Navbar,
    Form,
    Nav,
    Spinner
} from "react-bootstrap";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Legend
} from "recharts";

import { MdDashboard, MdPeople, MdBarChart, MdSettings } from "react-icons/md";

import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../api";

const Dashboard = () => {
    const [inm, setInm] = useState("Loading...");
    const [stats, setStats] = useState([
        { title: inm, value: "" },
        { title: inm, value: "" },
        { title: inm, value: "" },
        { title: inm, value: "" }
    ]);

    const [dateDistribution, setDateDistribution] = useState([]);

    const [conditions, setConditions] = useState([]);

    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        api.get("/dashboard/dashboard.php")
            .then(res => {
                //etTimeout(() => {
                const status = res.data["status"];
                if (status === true) {
                    const d = res.data["data"];
                    console.log(d);
                    setStats(d.stats);
                    setDateDistribution(d.dateDistribution);
                    setConditions(d.conditions);
                    setShowSpinner(false);
                    //setInm("good");
                } else {
                    setShowSpinner(false);
                    setInm("Something went wrong. Try again later!");
                    //alert(res.data.message);
                }
                //}, 0);
            })
            .catch(e => console.log(e));
    }, []);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* MAIN */}
            <div style={{ flex: 1, background: "#f5f6fa" }}>
                {/* TOP NAV */}
                <Navbar bg="white" className="px-3 shadow-sm">
                    <Navbar.Brand>Intergrated Dashboard</Navbar.Brand>
                    <Form className="d-flex ms-auto">
                        <Form.Control placeholder="Search..." />
                    </Form>
                </Navbar>
                {inm === "Something went wrong. Try again later!" && (
                    <Container fluid className="p-4">
                        <p>{inm}</p>
                    </Container>
                )}
                {inm === "Loading..." && (
                    <Container fluid className="p-4">
                        {/* STATS */}
                        <Row>
                            {stats.map((s, i) => (
                                <Col md={3} key={i}>
                                    <Card
                                        style={{ cursor: "pointer" }}
                                        className="shadow-sm mb-3"
                                    >
                                        <Card.Body>
                                            <h6>{s.title}</h6>
                                            {showSpinner ? (
                                                <Spinner />
                                            ) : (
                                                <>
                                                    <h3
                                                        style={{
                                                            color: "blue"
                                                        }}
                                                    >
                                                        {s.value}
                                                    </h3>
                                                </>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* CHARTS */}
                        <Row>
                            <Col md={6}>
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <h6>Patient Visits</h6>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <LineChart data={dateDistribution}>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <legend />

                                                <Line
                                                    type="monotone"
                                                    dataKey="patients"
                                                    stroke="#0d6efd"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <h6>
                                            Patient visits date Distribution
                                        </h6>
                                        <ResponsiveContainer
                                            style={
                                                showSpinner && {
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }
                                            }
                                            width="100%"
                                            height={250}
                                        >
                                            {showSpinner && <Spinner />}
                                            {!showSpinner && (
                                                <BarChart
                                                    data={dateDistribution}
                                                >
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar
                                                        dataKey="patients"
                                                        fill="#198754"
                                                    />
                                                </BarChart>
                                            )}
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* TABLE */}
                        <Row className="mt-4">
                            <Col>
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <h6>Conditions</h6>

                                        <Table striped hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Condition</th>
                                                    <th>Total</th>
                                                    <th>Percent of total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {conditions.map((c, index) => (
                                                    <tr key={c.diseaseName}>
                                                        <td>{index + 1}</td>
                                                        <td>{c.diseaseName}</td>
                                                        <td>{c.count}</td>
                                                        <td>{c.perc}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
