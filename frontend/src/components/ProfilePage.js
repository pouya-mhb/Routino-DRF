import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('لطفاً دوباره وارد شوید.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profiles/me/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = response.data;
        setProfile(profileData);
        setFormData({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          age: profileData.age || 18,
          gender: profileData.gender || 'male',
        });
        if (!profileData.firstName || !profileData.lastName) {
          setIsEditing(true);
          setSuccess('لطفاً اطلاعات پروفایل خود را کامل کنید.');
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.data?.detail?.includes('token')) {
          setError('جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.');
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(err.response?.data?.detail || 'خطا در بارگذاری پروفایل');
        }
        console.error('Error:', err.response?.data);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('لطفاً دوباره وارد شوید.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      await axios.put('http://localhost:8000/api/profiles/me/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('پروفایل به‌روزرسانی شد!');
      setIsEditing(false);
      setProfile({ ...profile, ...formData });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.data?.detail?.includes('token')) {
        setError('جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.detail || 'خطا در به‌روزرسانی پروفایل');
      }
      console.error('Error:', err.response?.data);
    }
  };

  return (
    <Container className="mt-5" dir="rtl">
      <h2>پروفایل کاربر</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {profile ? (
        <Card>
          <Card.Body>
            <Card.Title>{profile.userName}</Card.Title>
            <Card.Text style={{ textAlign: 'right' }}>
              <p>نام: {profile.firstName}</p>
              <p>نام خانوادگی: {profile.lastName}</p>
              <p>ایمیل: {profile.email}</p>
              <p>سن: {profile.age}</p>
              <p>جنسیت: {profile.gender === 'male' ? 'مرد' : 'زن'}</p>
              <p>امتیاز کلی: {profile.overall_score}</p>
              <p>امتیاز فعالیت‌ها: {profile.activity_score}</p>
            </Card.Text>
            {!isEditing && (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                ویرایش پروفایل
              </Button>
            )}
            {isEditing && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>نام</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="نام"
                    style={{ textAlign: 'right' }}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>نام خانوادگی</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="نام خانوادگی"
                    style={{ textAlign: 'right' }}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>ایمیل</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ایمیل"
                    style={{ textAlign: 'right' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formAge">
                  <Form.Label>سن</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="سن"
                    style={{ textAlign: 'right' }}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGender">
                  <Form.Label>جنسیت</Form.Label>
                  <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="male">مرد</option>
                    <option value="female">زن</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit">
                  ذخیره تغییرات
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      ) : (
        <p>در حال بارگذاری...</p>
      )}
    </Container>
  );
}