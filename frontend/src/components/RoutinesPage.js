import React, { useState, useEffect } from 'react';
import {
  Container, Button, Card, Row, Col, Badge, Spinner,
  Alert, Dropdown, Modal, Form
} from 'react-bootstrap';
import axios from 'axios';

function RoutinesPage() {
  const [routines, setRoutines] = useState([]);
  const [activities, setActivities] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // فرم مودال
  const [newRoutine, setNewRoutine] = useState({
    title: '',
    description: '',
    activities: [],
    start_date: '',
    end_date: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('لطفاً ابتدا وارد شوید.');
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 1. گرفتن پروفایل (برای profile id)
        const profileRes = await axios.get('http://localhost:8000/api/profile/me/', { headers });
        setProfileId(profileRes.data.user_profile);

        // 2. گرفتن روتین‌ها و فعالیت‌ها
        const [routinesRes, activitiesRes] = await Promise.all([
          axios.get('http://localhost:8000/api/routines/', { headers }),
          axios.get('http://localhost:8000/api/activities/', { headers })
        ]);

        setRoutines(routinesRes.data);
        setActivities(activitiesRes.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'خطا در بارگذاری اطلاعات');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // تغییر چک‌باکس فعالیت‌ها
  const toggleActivity = (activityId) => {
    setNewRoutine(prev => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter(id => id !== activityId)
        : [...prev.activities, activityId]
    }));
  };

  // ثبت روتین جدید
  const handleSubmitRoutine = async (e) => {
    e.preventDefault();
    setError('');

    if (newRoutine.activities.length === 0) {
      setError('لطفاً حداقل یک فعالیت انتخاب کنید.');
      return;
    }

    if (!profileId) {
      setError('پروفایل یافت نشد. لطفاً دوباره وارد شوید.');
      return;
    }

    const payload = {
      title: newRoutine.title,
      description: newRoutine.description || '',
      activities: newRoutine.activities,
      start_date: newRoutine.start_date,
      end_date: newRoutine.end_date || null,
      profile: profileId
    };

    try {
      const response = await axios.post('http://localhost:8000/api/routines/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setRoutines(prev => [...prev, response.data]);
      setShowModal(false);
      setNewRoutine({
        title: '',
        description: '',
        activities: [],
        start_date: '',
        end_date: ''
      });
      setError('');
    } catch (err) {
      console.error('خطای ثبت روتین:', err.response?.data);
      setError('خطا در ثبت روتین: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  // فیلتر روتین‌ها
  const filteredRoutines = routines.filter(routine => {
    if (filter === 'active') return routine.is_active;
    if (filter === 'inactive') return !routine.is_active;
    return true;
  });

  const getActivityTitle = (id) => {
    const act = activities.find(a => a.id === id);
    return act ? act.title : 'نامشخص';
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">در حال بارگذاری...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5" dir="rtl">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">روتین‌های من</h2>
        <div className="d-flex gap-3 align-items-center">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              {filter === 'all' ? 'همه' : filter === 'active' ? 'فعال' : 'غیرفعال'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter('all')}>همه روتین‌ها</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('active')}>فقط فعال</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('inactive')}>غیرفعال</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="success" size="lg" onClick={() => setShowModal(true)}>
            افزودن روتین جدید
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      {filteredRoutines.length === 0 ? (
        <Alert variant="info" className="text-center">
          هنوز روتینی ثبت نکرده‌اید.
        </Alert>
      ) : (
        <Row>
          {filteredRoutines.map(routine => (
            <Col md={6} lg={4} className="mb-4" key={routine.id}>
              <Card className="h-100 shadow-sm border-0 hover-shadow">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between mb-3">
                    <Card.Title className="text-primary">{routine.title}</Card.Title>
                    <Badge bg={routine.is_active ? "success" : "secondary"}>
                      {routine.is_active ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </div>
                  {routine.description && <Card.Text className="text-muted small">{routine.description}</Card.Text>}
                  <small className="text-muted mt-auto">
                    <strong>شروع:</strong> {new Date(routine.start_date).toLocaleDateString('fa-IR')}<br />
                    {routine.end_date && <><strong>پایان:</strong> {new Date(routine.end_date).toLocaleDateString('fa-IR')}<br /></>}
                    <strong>فعالیت‌ها:</strong>
                  </small>
                  <div className="mt-2">
                    {routine.activities?.length > 0 ? (
                      routine.activities.map(id => (
                        <Badge key={id} bg="light" text="dark" className="me-1 mb-1">
                          {getActivityTitle(id)}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted small">بدون فعالیت</span>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* مودال ثبت روتین جدید */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dir="rtl" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-success fw-bold">ثبت روتین جدید</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitRoutine}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">عنوان روتین</Form.Label>
              <Form.Control
                type="text"
                value={newRoutine.title}
                onChange={e => setNewRoutine({ ...newRoutine, title: e.target.value })}
                placeholder="مثال: روتین صبحگاهی"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>توضیحات (اختیاری)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newRoutine.description}
                onChange={e => setNewRoutine({ ...newRoutine, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                فعالیت‌ها ({newRoutine.activities.length} انتخاب شده)
              </Form.Label>
              <div className="border rounded p-3" style={{ maxHeight: '250px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                {activities.length === 0 ? (
                  <p className="text-muted text-center mb-0">فعالیتی یافت نشد.</p>
                ) : (
                  activities.map(act => (
                    <Form.Check
                      key={act.id}
                      type="checkbox"
                      label={act.title}
                      checked={newRoutine.activities.includes(act.id)}
                      onChange={() => toggleActivity(act.id)}
                      className="mb-2"
                    />
                  ))
                )}
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>تاریخ شروع</Form.Label>
                  <Form.Control
                    type="date"
                    value={newRoutine.start_date}
                    onChange={e => setNewRoutine({ ...newRoutine, start_date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>تاریخ پایان (اختیاری)</Form.Label>
                  <Form.Control
                    type="date"
                    value={newRoutine.end_date}
                    onChange={e => setNewRoutine({ ...newRoutine, end_date: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Button
                variant="success"
                type="submit"
                size="lg"
                disabled={newRoutine.activities.length === 0}
                className="px-5"
              >
                ثبت روتین
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </Container>
  );
}

export default RoutinesPage;