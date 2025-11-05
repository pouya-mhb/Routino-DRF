import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import NewItemModal from './NewItemModal';

function RoutinesPage() {
  const [routines, setRoutines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axios.get('/api/routines/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setRoutines(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'خطا در بارگذاری روتین‌ها');
        console.error(err);
      }
    };
    fetchRoutines();
  }, []);

  const handleAddRoutine = (newRoutine) => {
    setRoutines([...routines, newRoutine]);
  };

  return (
    <Container className="mt-5" dir="rtl">
      <h2>روتین‌ها</h2>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
        افزودن روتین جدید
      </Button>
      {error && <div className="alert alert-danger">{error}</div>}
      <Row>
        {routines.length > 0 ? (
          routines.map((routine) => (
            <Col md={4} key={routine.id}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{routine.title}</Card.Title>
                  <Card.Text style={{ textAlign: 'right' }}>
                    <p>توضیحات: {routine.description}</p>
                    <p>دسته‌بندی: {routine.category}</p>
                    <p>تاریخ شروع: {routine.start_date}</p>
                    <p>تاریخ پایان: {routine.end_date}</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>هیچ روتینی یافت نشد.</p>
        )}
      </Row>
      <NewItemModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        itemType="routine"
        onSuccess={handleAddRoutine}
      />
    </Container>
  );
}

export default RoutinesPage;