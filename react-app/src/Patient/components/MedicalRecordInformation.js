import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const MedicalRecordInformation = ({ record }) => {
    const { patient_id, doctor_id, visit_date, diagnosis, treatment, notes } = record;

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Row>
                    <Col md={6} className="mb-3">
                        <Card.Text><strong>Patient ID:</strong> {patient_id}</Card.Text>
                        <Card.Text><strong>Doctor ID:</strong> {doctor_id}</Card.Text>
                        <Card.Text><strong>Visit Date:</strong> {visit_date}</Card.Text>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Card.Text><strong>Diagnosis:</strong> {diagnosis}</Card.Text>
                        <Card.Text><strong>Treatment:</strong> {treatment}</Card.Text>
                        <Card.Text><strong>Notes:</strong> {notes}</Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default MedicalRecordInformation;