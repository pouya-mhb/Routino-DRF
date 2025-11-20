import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: 18,
    gender: 'male',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // بارگذاری پروفایل
  useEffect(() => {
    if (!token) {
      setError('لطفاً ابتدا وارد شوید.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profile/me/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;
        setProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          age: data.age || 18,
          gender: data.gender || 'male',
        });

        if (!data.firstName || !data.lastName) {
          setIsEditing(true);
          setSuccess('لطفاً اطلاعات پروفایل خود را تکمیل کنید');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError('جلسه منقضی شده. در حال انتقال به صفحه ورود...');
          localStorage.clear();
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('خطا در بارگذاری پروفایل: ' + (err.response?.data?.detail || err.message));
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.patch(
        'http://localhost:8000/api/profile/me/update/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setProfile(response.data);
      setSuccess('پروفایل با موفقیت به‌روزرسانی شد');
      setIsEditing(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('جلسه منقضی شده. لطفاً دوباره وارد شوید.');
        localStorage.clear();
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const msg = err.response?.data;
        setError(
          typeof msg === 'object'
            ? Object.values(msg).join(' ')
            : 'خطا در ذخیره تغییرات. دوباره تلاش کنید.'
        );
      }
      console.error('Update error:', err.response?.data);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        age: profile.age || 18,
        gender: profile.gender || 'male',
      });
    }
    setIsEditing(false);
    setError('');
  };

  if (loading) return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3">در حال بارگذاری پروفایل...</p>
    </Container>
  );

  return (
    <Container className="mt-5" dir="rtl">
      <h2 className="mb-4 text-primary">پروفایل من</h2>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {profile && (
        <Card className="shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h4>{profile.firstName} {profile.lastName || profile.userName}</h4>
                <p className="text-muted">@{profile.userName}</p>
              </div>
              {!isEditing && (
                <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
                  ویرایش پروفایل
                </Button>
              )}
            </div>

            {/* نمایش اطلاعات (وقتی در حالت ویرایش نیست) */}
            {!isEditing ? (
              <div className="text-end">
                <p><strong>نام:</strong> {profile.firstName || 'تنظیم نشده'}</p>
                <p><strong>نام خانوادگی:</strong> {profile.lastName || 'تنظیم نشده'}</p>
                <p><strong>ایمیل:</strong> {profile.email || 'ثبت نشده'}</p>
                <p><strong>سن:</strong> {profile.age} سال</p>
                <p><strong>جنسیت:</strong> {profile.gender === 'male' ? 'مرد' : 'زن'}</p>
                <hr />
                <p><strong>امتیاز کلی:</strong> <span className="text-success fs-4">{profile.overall_score}</span></p>
                <p><strong>امتیاز فعالیت:</strong> {profile.activity_score}</p>
              </div>
            ) : (
              /* فرم ویرایش */
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>نام</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="نام خود را وارد کنید"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>نام خانوادگی</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="نام خانوادگی"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>ایمیل (اختیاری)</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>سن</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="10"
                    max="100"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>جنسیت</Form.Label>
                  <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="male">مرد</option>
                    <option value="female">زن</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="success" type="submit" disabled={saving}>
                    {saving ? <>در حال ذخیره...</> : 'ذخیره تغییرات'}
                  </Button>
                  <Button variant="secondary" onClick={handleCancel} disabled={saving}>
                    لغو
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}