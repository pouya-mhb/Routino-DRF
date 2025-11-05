import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/', formData);
      setSuccess(response.data.message || 'ثبت‌نام موفق!');
      setTimeout(() => navigate('/login'), 2000);  // ریدایرکت بعد از 2 ثانیه
    } catch (err) {
      const errorDetail = err.response?.data || 'خطا در ثبت‌نام';
      setError(JSON.stringify(errorDetail)); // نمایش جزئیات خطا
      console.error('Error:', err.response?.data);
    }
  };

  return (
    <Container className="mt-5" dir="rtl">
      <h2>ثبت‌نام</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>نام کاربری</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="نام کاربری"
            style={{ textAlign: 'right' }}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>رمز عبور</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="رمز عبور"
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
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formFirstName">
          <Form.Label>نام</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="نام (اختیاری)"
            style={{ textAlign: 'right' }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formLastName">
          <Form.Label>نام خانوادگی</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="نام خانوادگی (اختیاری)"
            style={{ textAlign: 'right' }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          ثبت‌نام
        </Button>
      </Form>
    </Container>
  );
}

export default SignupPage;