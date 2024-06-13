import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { usePatient } from "../../hooks/usePatient"; // Adjust the path as per your actual hook location
import { useDoctor } from "../../hooks/useDoctor"; // Adjust the path as per your actual hook location

const MedicalRecordInformation = ({ record, onUpdateClick }) => {
    const { patient_id, doctor_id, visit_date, diagnosis, treatment, notes } = record;

    // Fetch patient and doctor details using usePatient hook or any suitable method
    const { patients, loading } = usePatient(); // Ensure usePatient hook provides patients and doctors data
    const { doctors } = useDoctor();

    // Find patient and doctor names based on their IDs
    const patient = patients.find(patient => patient.id === patient_id);
    const doctor = doctors.find(doctor => doctor.id === doctor_id);

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Row>
                    <Col md={6} className="mb-3">
                        <Card.Text><strong>Patient Name:</strong> {patient ? `${patient.first_name} ${patient.last_name}` : '-'}</Card.Text>
                        <Card.Text><strong>Doctor:</strong> {doctor ? `${doctor.first_name} ${doctor.last_name}` : '-'}</Card.Text>
                        <Card.Text><strong>Visit Date:</strong> {visit_date}</Card.Text>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Card.Text><strong>Diagnosis:</strong> {diagnosis}</Card.Text>
                        <Card.Text><strong>Treatment:</strong> {treatment}</Card.Text>
                        <Card.Text><strong>Notes:</strong> {notes}</Card.Text>
                    </Col>
                </Row>
                <hr />
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button variant="outline-primary" onClick={() => onUpdateClick(record)}>Update</Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default MedicalRecordInformation;
