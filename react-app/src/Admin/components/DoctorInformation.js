import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

const DoctorInformation = ({ doctor, remove, onUpdateClick }) => {
    return (
        <Card className="w-50 mb-3 shadow-sm">
            <Card.Body>
                <Row>
                    <Col md={3} className="d-flex flex-column justify-content-center align-items-center">
                        <div className="text-center">
                            <Card.Title className="mb-1">{doctor.first_name} {doctor.last_name}</Card.Title>
                            <Card.Subtitle className="text-muted mb-2">ID: {doctor.id}</Card.Subtitle>
                        </div>
                    </Col>
                    <Col md={9}>
                        <Row>
                            <Col className="mb-3">
                                <Card.Text><strong>Specialization:</strong> {doctor.specialization}</Card.Text>
                                <Card.Text><strong>License Number:</strong> {doctor.license_number}</Card.Text>
                                <Card.Text><strong>Phone:</strong> {doctor.phone}</Card.Text>
                                <Card.Text><strong>Email:</strong> {doctor.email}</Card.Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button variant="outline-primary" onClick={() => onUpdateClick(doctor)}>Update</Button>
                    <Button variant="outline-danger" onClick={() => remove(doctor.id)}>Delete</Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default DoctorInformation;
