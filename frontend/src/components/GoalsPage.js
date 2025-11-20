import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert, Card } from 'react-bootstrap';
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  // گرفتن داده‌ها از سرور
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('لطفاً ابتدا وارد شوید.');
        return;
      }

      try {
        // پروفایل کاربر
        const profileRes = await axios.get('http://localhost:8000/api/profile/me/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileRes.data);

        // دسته‌بندی‌ها
        const catRes = await axios.get('http://localhost:8000/api/categories/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(catRes.data);

        // زیرمجموعه‌ها
        const subCatRes = await axios.get('http://localhost:8000/api/subcategories/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubCategories(subCatRes.data);

        // وضعیت‌ها
        const statusRes = await axios.get('http://localhost:8000/api/statuses/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatuses(statusRes.data);

        // روتین‌ها
        const routineRes = await axios.get('http://localhost:8000/api/routines/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoutines(routineRes.data);

        // فعالیت‌ها
        const activityRes = await axios.get('http://localhost:8000/api/activities/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivities(activityRes.data);

        // اهداف کاربر
        const goalRes = await axios.get('http://localhost:8000/api/goals/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGoals(goalRes.data);

      } catch (err) {
        setError('خطا در بارگذاری داده‌ها: ' + (err.response?.data?.detail || err.message));
      }
    };

    fetchData();
  }, [token]);

  // فیلتر زیرمجموعه‌ها بر اساس دسته‌بندی انتخاب‌شده
  useEffect(() => {
    if (formData.category) {
      const filtered = subCategories.filter(sub => sub.category === parseInt(formData.category));
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [formData.category, subCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!profile) {
      setError('پروفایل یافت نشد!');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description || "",
      profile: profile.user_profile,           // عدد ID کاربر
      routine: parseInt(formData.routine) || null,
      category: parseInt(formData.category),
      subCategory: parseInt(formData.subCategory),
      status: parseInt(formData.status),
      activity: parseInt(formData.activity),
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

    console.log('ارسال هدف با داده:', payload);

    try {
      const response = await axios.post('http://localhost:8000/api/goals/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setGoals([...goals, response.data]);
      setSuccess('هدف با موفقیت ثبت شد!');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        routine: '',
        category: '',
        subCategory: '',
        status: '',
        activity: '',
        start_date: '',
        end_date: ''
      });
    } catch (err) {
      setError('خطا در ثبت هدف: ' + JSON.stringify(err.response?.data || err.message));
      console.error(err.response);
    }
  };

  return (
    <Container className="mt-5" dir="rtl">
      <h2 className="mb-4">اهداف من</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Button variant="success" onClick={() => setShowModal(true)} className="mb-4">
        ثبت هدف جدید
      </Button>

      {/* مودال ثبت هدف */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title>ثبت هدف جدید</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>عنوان هدف</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="مثال: دویدن ۵ کیلومتر در ماه"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>توضیحات (اختیاری)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>روتین مرتبط</Form.Label>
              <Form.Select name="routine" value={formData.routine} onChange={handleChange}>
                <option value="">بدون روتین</option>
                {routines.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>دسته‌بندی</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">انتخاب کنید</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>نوع هدف (زیرمجموعه)</Form.Label>
              <Form.Select name="subCategory" value={formData.subCategory} onChange={handleChange} required>
                <option value="">ابتدا دسته‌بندی را انتخاب کنید</option>
                {filteredSubCategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.title}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>وضعیت</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                <option value="">انتخاب کنید</option>
                {statuses.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>فعالیت مرتبط</Form.Label>
              <Form.Select name="activity" value={formData.activity} onChange={handleChange} required>
                <option value="">انتخاب کنید</option>
                {activities.map(act => (
                  <option key={act.id} value={act.id}>{act.title}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="row">
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>تاریخ شروع</Form.Label>
                <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>تاریخ پایان</Form.Label>
                <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
              </Form.Group>
            </div>

            <div className="text-center">
              <Button variant="primary" type="submit" size="lg">
                ثبت هدف
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* نمایش اهداف کاربر */}
      <h4 className="mt-5 mb-3">لیست اهداف</h4>
      {goals.length === 0 ? (
        <Alert variant="info">هنوز هدفی ثبت نکرده‌اید.</Alert>
      ) : (
        <div className="row">
          {goals.map(goal => (
            <div key={goal.id} className="col-md-6 mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{goal.title}</Card.Title>
                  {goal.description && <Card.Text>{goal.description}</Card.Text>}
                  <Card.Text><strong>روتین:</strong> {routines.find(r => r.id === goal.routine)?.title || 'ندارد'}</Card.Text>
                  <Card.Text><strong>دسته‌بندی:</strong> {categories.find(c => c.id === goal.category)?.title}</Card.Text>
                  <Card.Text><strong>وضعیت:</strong> {statuses.find(s => s.id === goal.status)?.title}</Card.Text>
                  <Card.Text><strong>فعالیت:</strong> {activities.find(a => a.id === goal.activity)?.title}</Card.Text>
                  <Card.Text><strong>تاریخ شروع:</strong> {goal.start_date}</Card.Text>
                  <Card.Text><strong>تاریخ پایان:</strong> {goal.end_date}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default GoalsPage;