import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function NewRoutine() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activities: [],
    start_date: '',
    end_date: ''
  });
  const [activities, setActivities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [routines, setRoutines] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // گرفتن پروفایل
        const profileResponse = await axios.get('http://localhost:8000/api/profile/me/', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        setProfile(profileResponse.data);
        console.log('Profile:', profileResponse.data);

        // گرفتن فعالیت‌ها
        const activitiesResponse = await axios.get('http://localhost:8000/api/activities/', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        setActivities(activitiesResponse.data);
        console.log('Activities:', activitiesResponse.data);

        // گرفتن روتین‌ها
        const routinesResponse = await axios.get('http://localhost:8000/api/routines/', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        setRoutines(routinesResponse.data);
        console.log('Routines:', routinesResponse.data);
      } catch (err) {
        setError('خطا در بارگذاری داده‌ها: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || 'خطای ناشناخته'));
        console.error('Error:', err.response);
      }
    };
    if (token) {
      fetchData();
    } else {
      setError('لطفاً ابتدا وارد شوید.');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const activityId = parseInt(value);
      setFormData(prev => {
        const newActivities = checked
          ? [...prev.activities, activityId]
          : prev.activities.filter(id => id !== activityId);
        return { ...prev, activities: newActivities };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) {
      setError('پروفایل کاربر یافت نشد. لطفاً دوباره وارد شوید.');
      return;
    }
    if (formData.activities.length === 0) {
      setError('لطفاً حداقل یک فعالیت انتخاب کنید.');
      return;
    }
    const payload = {
      ...formData,
      profile: profile.user_profile
    };
    console.log('Request Payload:', payload); // لاگ برای دیباگ
    try {
      const response = await axios.post('http://localhost:8000/api/routines/', payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setRoutines([...routines, response.data]);
      setSuccess('روتین با موفقیت ثبت شد!');
      setError('');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        activities: [],
        start_date: '',
        end_date: ''
      });
    } catch (err) {
      setError('خطا در ثبت روتین: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || 'خطای ناشناخته'));
      setSuccess('');
      console.error('Error:', err.response);
    }
  };

  return (
    <Container className="mt-5" dir="rtl">
      <h2>روتین‌ها</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Button variant="primary" onClick={() => setShowModal(true)}>
        ثبت روتین جدید
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title>ثبت روتین جدید</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>عنوان</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>توضیحات</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>فعالیت‌ها</Form.Label>
              <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ced4da', padding: '10px', borderRadius: '4px' }}>
                {activities.map(act => (
                  <Form.Check
                    key={act.id}
                    type="checkbox"
                    label={act.title}
                    value={act.id}
                    checked={formData.activities.includes(act.id)}
                    onChange={handleChange}
                    name="activities"
                  />
                ))}
              </div>
              <Form.Text className="text-muted">
                فعالیت‌های موردنظر خود را انتخاب کنید.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>تاریخ شروع</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>تاریخ پایان</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              ثبت روتین
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <div className="mt-4">
        {routines.map(routine => (
          <Card key={routine.id} className="mb-3">
            <Card.Body>
              <Card.Title>{routine.title}</Card.Title>
              <Card.Text>{routine.description}</Card.Text>
              <Card.Text>
                فعالیت‌ها: {routine.activities.map(id => activities.find(act => act.id === id)?.title).join(', ')}
              </Card.Text>
              <Card.Text>تاریخ شروع: {routine.start_date}</Card.Text>
              <Card.Text>تاریخ پایان: {routine.end_date}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default NewRoutine;