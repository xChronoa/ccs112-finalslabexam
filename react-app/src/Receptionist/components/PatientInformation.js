import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

const PatientInformation = ({ patient, remove, onUpdateClick }) => {
    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Row>
                    <Col md={3} className="d-flex flex-column justify-content-center align-items-center">
                        <div className="text-center">
                            <Card.Title className="mb-1">{patient.first_name} {patient.last_name}</Card.Title>
                            <Card.Subtitle className="text-muted mb-2">ID: {patient.id}</Card.Subtitle>
                        </div>
                    </Col>
                    <Col md={9}>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Card.Text><strong>Date of Birth:</strong> {patient.date_of_birth}</Card.Text>
                                <Card.Text><strong>Gender:</strong> {patient.gender}</Card.Text>
                                <Card.Text><strong>Phone:</strong> {patient.phone}</Card.Text>
                                <Card.Text><strong>Email:</strong> {patient.email}</Card.Text>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Card.Text><strong>Address:</strong> {patient.address}</Card.Text>
                                <Card.Text><strong>Emergency Contact:</strong> {patient.emergency_contact}</Card.Text>
                                <Card.Text><strong>Medical History:</strong> {patient.medical_history}</Card.Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button variant="outline-primary" onClick={() => onUpdateClick(patient)}>Update</Button>
                    <Button variant="outline-danger" onClick={() => remove(patient.id)}>Delete</Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PatientInformation;
