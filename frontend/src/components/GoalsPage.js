import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert, Card, Badge, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

function GoalsPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    status: '',
    routine: '',
    activity: '',
    start_date: '',
    end_date: ''
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [activities, setActivities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [goals, setGoals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

        const [
          profileRes,
          catRes,
          subCatRes,
          statusRes,
          routineRes,
          activityRes,
          goalRes
        ] = await Promise.all([
          axios.get('http://localhost:8000/api/profile/me/', { headers }),
          axios.get('http://localhost:8000/api/categories/', { headers }),
          axios.get('http://localhost:8000/api/subcategories/', { headers }),
          axios.get('http://localhost:8000/api/statuses/', { headers }),
          axios.get('http://localhost:8000/api/routines/', { headers }),
          axios.get('http://localhost:8000/api/activities/', { headers }),
          axios.get('http://localhost:8000/api/goals/', { headers })
        ]);

        setProfile(profileRes.data);
        setCategories(catRes.data);
        setSubCategories(subCatRes.data);
        setStatuses(statusRes.data);
        setRoutines(routineRes.data);
        setActivities(activityRes.data);
        setGoals(goalRes.data);

      } catch (err) {
        setError('خطا در بارگذاری اطلاعات: ' + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // فیلتر زیرمجموعه‌ها
  useEffect(() => {
    if (formData.category) {
      const filtered = subCategories.filter(sub => sub.category === parseInt(formData.category));
      setFilteredSubCategories(filtered);
      setFormData(prev => ({ ...prev, subCategory: '' })); // ریست کردن subCategory
    } else {
      setFilteredSubCategories([]);
      setFormData(prev => ({ ...prev, subCategory: '' }));
    }
  }, [formData.category, subCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    if (!profile) {
      setError('پروفایل یافت نشد!');
      setSaving(false);
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description || "",
      profile: profile.user_profile,
      routine: formData.routine ? parseInt(formData.routine) : null,
      category: parseInt(formData.category),
      subCategory: parseInt(formData.subCategory),
      status: parseInt(formData.status),
      activity: parseInt(formData.activity),
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/goals/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setGoals(prev => [...prev, response.data]);
      setSuccess('هدف با موفقیت ثبت شد!');
      setShowModal(false);

      // ریست فرم
      setFormData({
        title: '',
        description: '',
        category: '',
        subCategory: '',
        status: '',
        routine: '',
        activity: '',
        start_date: '',
        end_date: ''
      });

    } catch (err) {
      const msg = err.response?.data;
      setError(
        msg && typeof msg === 'object'
          ? Object.values(msg).flat().join(' | ')
          : 'خطا در ثبت هدف. دوباره تلاش کنید.'
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (statusId) => {
    const status = statuses.find(s => s.id === statusId);
    const title = status?.title || 'نامشخص';
    if (title.includes('انجام') || title.includes('Done')) return <Badge bg="success">انجام شده</Badge>;
    if (title.includes('در حال') || title.includes('Progress')) return <Badge bg="warning">در حال انجام</Badge>;
    return <Badge bg="secondary">{title}</Badge>;
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">در حال بارگذاری اهداف...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5" dir="rtl">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">اهداف من</h2>
        <Button variant="success" size="lg" onClick={() => setShowModal(true)}>
          ثبت هدف جدید
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* مودال ثبت هدف */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title className="text-success">ثبت هدف جدید</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">عنوان هدف</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="مثال: دویدن ۱۰۰ کیلومتر در ۳ ماه"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>توضیحات (اختیاری)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="جزئیات هدف..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>روتین مرتبط</Form.Label>
                  <Form.Select name="routine" value={formData.routine} onChange={handleChange}>
                    <option value="">بدون روتین</option>
                    {routines.map(r => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>دسته‌بندی</Form.Label>
                  <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">انتخاب کنید</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>نوع هدف</Form.Label>
                  <Form.Select name="subCategory" value={formData.subCategory} onChange={handleChange} required disabled={!formData.category}>
                    <option value="">
                      {formData.category ? 'انتخاب کنید' : 'ابتدا دسته‌بندی را انتخاب کنید'}
                    </option>
                    {filteredSubCategories.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>وضعیت</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="">انتخاب کنید</option>
                    {statuses.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>فعالیت مرتبط</Form.Label>
                  <Form.Select name="activity" value={formData.activity} onChange={handleChange} required>
                    <option value="">انتخاب کنید</option>
                    {activities.map(act => (
                      <option key={act.id} value={act.id}>{act.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>تاریخ شروع</Form.Label>
                  <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>تاریخ پایان</Form.Label>
                  <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Button variant="success" type="submit" size="lg" disabled={saving}>
                {saving ? 'در حال ثبت...' : 'ثبت هدف'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* نمایش اهداف */}
      <h4 className="mt-5 mb-4 text-secondary">لیست اهداف شما</h4>
      {goals.length === 0 ? (
        <Alert variant="info" className="text-center">
          هنوز هدفی ثبت نکرده‌اید. روی دکمه "ثبت هدف جدید" کلیک کنید!
        </Alert>
      ) : (
        <Row>
          {goals.map(goal => (
            <Col md={6} lg={4} className="mb-4" key={goal.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="text-primary">{goal.title}</Card.Title>
                    {getStatusBadge(goal.status)}
                  </div>
                  {goal.description && <Card.Text className="text-muted small">{goal.description}</Card.Text>}
                  <div className="mt-auto">
                    <small>
                      <strong>روتین:</strong> {routines.find(r => r.id === goal.routine)?.title || 'ندارد'}<br />
                      <strong>فعالیت:</strong> {activities.find(a => a.id === goal.activity)?.title || '—'}<br />
                      <strong>از:</strong> {new Date(goal.start_date).toLocaleDateString('fa-IR')}
                      <strong> تا:</strong> {new Date(goal.end_date).toLocaleDateString('fa-IR')}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default GoalsPage;