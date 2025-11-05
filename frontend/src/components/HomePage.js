import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/profile/me/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfile(response.data);
        } catch (err) {
          if (err.response?.status === 401) {
            setError('جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.');
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            setTimeout(() => navigate('/login'), 2000);
          } else {
            setError(err.response?.data?.detail || 'خطا در بارگذاری پروفایل');
          }
          console.error('Profile Error:', err.response?.data);
        }
      };
      fetchProfile();
    }
  }, [navigate]);

  return (
    <Container className="mt-5" dir="rtl">
      {isAuthenticated ? (
        <>
          <h2>خوش آمدید، {profile ? profile.userName : 'کاربر'}</h2>
          <p>اینجا داشبورد شماست! می‌توانید پیشرفت، روتین‌ها، فعالیت‌ها و اهداف خود را مدیریت کنید.</p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>پیشرفت من</Card.Title>
                  <Card.Text>
                    خلاصه‌ای از امتیازات و فعالیت‌های شما.
                    {profile ? (
                      <>
                        <p>امتیاز کلی: {profile.overall_score}</p>
                        <p>امتیاز فعالیت‌ها: {profile.activity_score}</p>
                      </>
                    ) : (
                      <p>در حال بارگذاری...</p>
                    )}
                  </Card.Text>
                  <Button as={Link} to="/progress" variant="primary">مشاهده پیشرفت</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>روتین‌های من</Card.Title>
                  <Card.Text>روتین‌های روزانه و هفتگی خود را مدیریت کنید.</Card.Text>
                  <Button as={Link} to="/new-routine" variant="primary">ایجاد روتین جدید</Button>
                  <Button as={Link} to="/routines" variant="secondary" className="ms-2">مشاهده روتین‌ها</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>فعالیت‌ها</Card.Title>
                  <Card.Text>فعالیت‌های خود را مشاهده و مدیریت کنید.</Card.Text>
                  <Button as={Link} to="/new-activity" variant="primary">ایجاد فعالیت جدید</Button>
                  <Button as={Link} to="/activities" variant="secondary" className="ms-2">مشاهده فعالیت‌ها</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>اهداف من</Card.Title>
                  <Card.Text>اهداف جدید تعریف کنید و پیشرفت آن‌ها را دنبال کنید.</Card.Text>
                  <Button as={Link} to="/new-goal" variant="primary">ایجاد هدف جدید</Button>
                  <Button as={Link} to="/goals" variant="secondary" className="ms-2">مشاهده اهداف</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <h2>به روتینو خوش آمدید!</h2>
          <p>روتینو به شما کمک می‌کند تا عادت‌های روزانه خود را مدیریت کنید، اهداف خود را تعیین کنید و پیشرفت خود را دنبال کنید.</p>
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>چرا روتینو؟</Card.Title>
                  <Card.Text>
                    <ul style={{ textAlign: 'right' }}>
                      <li>ایجاد و مدیریت روتین‌های روزانه</li>
                      <li>دنبال کردن پیشرفت با امتیازات</li>
                      <li>تنظیم اهداف شخصی و حرفه‌ای</li>
                      <li>مدیریت فعالیت‌های روزانه</li>
                    </ul>
                  </Card.Text>
                  <Button as={Link} to="/about" variant="primary">بیشتر بدانید</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>شروع کنید!</Card.Title>
                  <Card.Text>
                    همین حالا به جمع کاربران روتینو بپیوندید و زندگی منظم‌تری را تجربه کنید.
                  </Card.Text>
                  <Button as={Link} to="/login" variant="primary" className="me-2">ورود</Button>
                  <Button as={Link} to="/signup" variant="secondary">ثبت‌نام</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default HomePage;