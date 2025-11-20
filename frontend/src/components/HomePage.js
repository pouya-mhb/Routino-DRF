import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Badge, Alert, ListGroup, ProgressBar
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Trophy, Bullseye, Fire, LightningFill, StarFill,
  Calendar3, ArrowRight, GraphUp, CheckCircleFill, Circle
} from 'react-bootstrap-icons';

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [todayActivities, setTodayActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  useEffect(() => {
    const token = localStorage.getItem('token');
    const authenticated = !!token;
    setIsAuthenticated(authenticated);

    if (authenticated) {
      const fetchData = async () => {
        try {
          const headers = { Authorization: `Bearer ${token}` };

          const [
            { data: profileData },
            { data: routines },
            { data: activities }
          ] = await Promise.all([
            axios.get('http://localhost:8000/api/profile/me/', { headers }),
            axios.get('http://localhost:8000/api/routines/', { headers }),
            axios.get('http://localhost:8000/api/activities/', { headers })
          ]);

          setProfile(profileData);

          // محاسبه آمار
          const activeRoutines = routines.filter(r => r.is_active).length;
          const completedToday = activities.filter(a =>
            a.completed_dates?.includes(today)
          ).length;

          setStats({
            overallScore: profileData.overall_score || 0,
            streak: profileData.current_streak || 0,
            level: Math.floor((profileData.overall_score || 0) / 100) + 1,
            activeRoutines,
            completedToday,
            totalToday: activities.length
          });

          // فعالیت‌های امروز (از روتین‌های فعال)
          const todayActs = activities.filter(act => {
            // فرض: هر فعالیتی که در روتین فعال باشه، امروز باید انجام بشه
            const inActiveRoutine = routines.some(r =>
              r.is_active && r.activities.includes(act.id)
            );
            return inActiveRoutine;
          });

          setTodayActivities(todayActs.map(act => ({
            ...act,
            isCompleted: act.completed_dates?.includes(today) || false
          })));

        } catch (err) {
          if (err.response?.status === 401) {
            localStorage.clear();
            setError('جلسه منقضی شد. در حال انتقال به ورود...');
            setTimeout(() => navigate('/login'), 3000);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [navigate, today]);

  const toggleActivity = (id) => {
    setTodayActivities(prev =>
      prev.map(act =>
        act.id === id ? { ...act, isCompleted: !act.isCompleted } : act
      )
    );
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center py-5">
        <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }}></div>
        <p className="mt-4 fs-4 text-muted">در حال آماده‌سازی داشبورد...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5" dir="rtl">
      {error && <Alert variant="warning" className="text-center">{error}</Alert>}

      {/* کاربر وارد شده */}
      {isAuthenticated && profile ? (
        <>
          {/* خوش‌آمدگویی */}
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-primary">
              سلام، {profile.firstName || profile.userName || 'دوست عزیز'}!
            </h1>
            <div className="d-flex justify-content-center align-items-center gap-4 mt-4 flex-wrap">
              <div className="d-flex align-items-center gap-2 bg-danger bg-opacity-10 px-4 py-3 rounded-pill">
                <Fire size={32} className="text-danger" />
                <span className="fw-bold fs-3">{stats?.streak || 0}</span>
                <span className="text-muted fs-5">روز استریک</span>
              </div>
              <Badge bg="warning" text="dark" className="fs-4 px-4 py-3">
                سطح {stats?.level || 1}
              </Badge>
            </div>
          </div>

          {/* آمار سریع */}
          <Row className="g-4 mb-5">
            <Col md={6} lg={3}>
              <Card className="text-center border-0 shadow-sm hover-lift">
                <Card.Body>
                  <Trophy size={40} className="text-warning mb-3" />
                  <h3 className="fw-bold">{stats?.overallScore || 0}</h3>
                  <p className="text-muted">امتیاز کلی</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="text-center border-0 shadow-sm hover-lift">
                <Card.Body>
                  <Bullseye size={40} className="text-success mb-3" />
                  <h3 className="fw-bold">{stats?.activeRoutines || 0}</h3>
                  <p className="text-muted">روتین فعال</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="text-center border-0 shadow-sm hover-lift">
                <Card.Body>
                  <LightningFill size={40} className="text-info mb-3" />
                  <h3 className="fw-bold">{stats?.completedToday || 0} / {stats?.totalToday || 0}</h3>
                  <p className="text-muted">فعالیت امروز</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="text-center border-0 shadow-sm hover-lift">
                <Card.Body>
                  <GraphUp size={40} className="text-purple mb-3" />
                  <h3 className="fw-bold">+{Math.floor(Math.random() * 25 + 10)}%</h3>
                  <p className="text-muted">رشد هفتگی</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* بخش جدید: فعالیت‌های امروز من */}
          <h3 className="text-primary fw-bold mb-4 text-center">
            فعالیت‌های امروز من
          </h3>
          <Card className="shadow-sm border-0 mb-5">
            <Card.Body>
              {todayActivities.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <Calendar3 size={50} className="mb-3 opacity-50" />
                  <p>امروز فعالیتی نداری. وقت اضافه داری!</p>
                  <Button as={Link} to="/new-activity" variant="outline-success">
                    فعالیت جدید بساز
                  </Button>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {todayActivities.map((act) => (
                    <ListGroup.Item
                      key={act.id}
                      className="px-0 py-3 d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <Button
                          variant="link"
                          className="p-0"
                          onClick={() => toggleActivity(act.id)}
                        >
                          {act.isCompleted ? (
                            <CheckCircleFill size={28} className="text-success" />
                          ) : (
                            <Circle size={28} className="text-muted" />
                          )}
                        </Button>
                        <div>
                          <h6 className={`mb-0 ${act.isCompleted ? 'text-muted text-decoration-line-through' : 'fw-bold'}`}>
                            {act.title}
                          </h6>
                          <small className="text-muted">
                            {act.category || 'بدون دسته‌بندی'} • امتیاز: {act.score || 1}
                          </small>
                        </div>
                      </div>
                      <Badge bg={act.isCompleted ? "success" : "secondary"}>
                        {act.isCompleted ? "انجام شد" : "در انتظار"}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>

          {/* دسترسی سریع */}
          <Row className="g-4">
            <Col md={4}>
              <Card className="text-center h-100 border-0 shadow hover-lift bg-light">
                <Card.Body>
                  <Calendar3 size={50} className="text-info mb-3" />
                  <h5>روتین‌ها</h5>
                  <Button as={Link} to="/routines" variant="outline-info" size="sm">مشاهده</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center h-100 border-0 shadow hover-lift bg-light">
                <Card.Body>
                  <Bullseye size={50} className="text-success mb-3" />
                  <h5>اهداف</h5>
                  <Button as={Link} to="/goals" variant="outline-success" size="sm">مشاهده</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center h-100 border-0 shadow hover-lift bg-light">
                <Card.Body>
                  <StarFill size={50} className="text-warning mb-3" />
                  <h5>پیشرفت</h5>
                  <Button as={Link} to="/progress" variant="outline-warning" size="sm">مشاهده</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        /* صفحه مهمان — همون قبلی */
        <div className="text-center py-5">
          <h1 className="display-3 fw-bold text-primary mb-4">روتینو</h1>
          <p className="lead fs-3 text-muted mb-5">معمار عادت‌های موفق</p>
          <Button as={Link} to="/signup" size="lg" variant="primary" className="px-5">شروع کن</Button>
        </div>
      )}

      <style jsx>{`
        .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important; transition: all 0.3s ease; }
        .text-purple { color: #9c27b0; }
      `}</style>
    </Container>
  );
}

export default HomePage;