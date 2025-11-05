import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import NewItemModal from './NewItemModal';

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get('/api/goals/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setGoals(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'خطا در بارگذاری اهداف');
        console.error(err);
      }
    };
    fetchGoals();
  }, []);

  const handleAddGoal = (newGoal) => {
    setGoals([...goals, newGoal]);
  };

  return (
    <Container className="mt-5" dir="rtl">
      <h2>اهداف</h2>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
        افزودن هدف جدید
      </Button>
      {error && <div className="alert alert-danger">{error}</div>}
      <Row>
        {goals.length > 0 ? (
          goals.map((goal) => (
            <Col md={4} key={goal.id}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{goal.title}</Card.Title>
                  <Card.Text style={{ textAlign: 'right' }}>
                    <p>توضیحات: {goal.description}</p>
                    <p>دسته‌بندی: {goal.category}</p>
                    <p>تاریخ شروع: {goal.start_date}</p>
                    <p>تاریخ پایان: {goal.end_date}</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>هیچ هدفی یافت نشد.</p>
        )}
      </Row>
      <NewItemModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        itemType="goal"
        onSuccess={handleAddGoal}
      />
    </Container>
  );
}

export default GoalsPage;