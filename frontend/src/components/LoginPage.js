import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login Form Data:', formData); // دیباگ
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      localStorage.setItem('token', response.data.access);
      setSuccess('ورود با موفقیت انجام شد!');
      setError('');
      window.location.href = '/';
    } catch (err) {
      setError('خطا در ورود: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || 'خطای ناشناخته'));
      setSuccess('');
      console.error('Login Error:', err.response); // دیباگ
    }
  };

  return (
    <Container className="mt-5" dir="rtl">
      <h2>ورود</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>نام کاربری</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>رمز عبور</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          ورود
        </Button>
      </Form>
    </Container>
  );
}

export default LoginPage;