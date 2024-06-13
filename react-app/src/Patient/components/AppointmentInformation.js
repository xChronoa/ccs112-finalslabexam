import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { usePatient } from "../../hooks/usePatient"; // Adjust the path as per your actual hook location
import { useDoctor } from "../../hooks/useDoctor"; // Adjust the path as per your actual hook location

const AppointmentInformation = ({ appointment, onUpdateClick, onCancelClick }) => {
    const { patient_id, doctor_id, appointment_date, reason } = appointment;

    // Fetch patient and doctor details using usePatient and useDoctor hooks
    const { patients, loading: patientLoading } = usePatient(); 
    const { doctors, loading: doctorLoading } = useDoctor();

    // Find patient and doctor names based on their IDs
    const patient = patients.find(patient => patient.id === patient_id);
    const doctor = doctors.find(doctor => doctor.id === doctor_id);

    return (
        <Card className="w-100 mb-3 shadow-sm">
            <Card.Body>
                <Row>
                    <Col md={6} className="mb-3">
                        <Card.Text><strong>Doctor:</strong> {doctor ? `${doctor.first_name} ${doctor.last_name}` : '-'}</Card.Text>
                        <Card.Text><strong>Appointment Date:</strong> {appointment_date}</Card.Text>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Card.Text><strong>Reason:</strong> {reason}</Card.Text>
                    </Col>
                    <hr/>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="outline-primary" onClick={() => onUpdateClick(appointment)}>Reschedule</Button>
                        <Button variant="outline-danger" onClick={() => onCancelClick(appointment.id)}>Cancel</Button>
                    </div>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default AppointmentInformation;
