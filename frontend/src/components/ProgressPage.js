import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, ListGroup, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// ثبت کامپوننت‌های Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProgressPage() {
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!token) {
        setError('لطفاً ابتدا وارد شوید.');
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [profileRes, actRes, routineRes, goalRes] = await Promise.all([
          axios.get('http://localhost:8000/api/profile/me/', { headers }),
          axios.get('http://localhost:8000/api/activities/', { headers }),
          axios.get('http://localhost:8000/api/routines/', { headers }),
          axios.get('http://localhost:8000/api/goals/', { headers })
        ]);

        setProfile(profileRes.data);
        setActivities(actRes.data);
        setRoutines(routineRes.data);
        setGoals(goalRes.data);
        setLoading(false);
      } catch (err) {
        setError('خطا در بارگذاری اطلاعات پیشرفت');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProgressData();
  }, [token]);

  // داده‌های نمودار هفتگی (تعداد فعالیت در ۷ روز گذشته)
  const getWeeklyData = () => {
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    const today = new Date();
    const counts = Array(7).fill(0);

    activities.forEach(act => {
      const actDate = new Date(act.created_date);
      const diffTime = Math.abs(today - actDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) {
        const dayIndex = (today.getDay() + 6) % 7; // تبدیل به شنبه‌محور
        const actDayIndex = (actDate.getDay() + 6) % 7;
        const relativeIndex = (7 + dayIndex - actDayIndex) % 7;
        if (relativeIndex < 7) counts[relativeIndex]++;
      }
    });

    return {
      labels: days,
      datasets: [{
        label: 'تعداد فعالیت',
        data: counts.reverse(), // از شنبه شروع بشه
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  };

  if (loading) return <Container className="mt-5 text-center"><Alert variant="info">در حال بارگذاری...</Alert></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  const completedGoals = goals.filter(g => {
    const status = g.status_title || g.status;
    return status === 'Done' || status === 'انجام شده';
  }).length;

  const inProgressGoals = goals.length - completedGoals;

  return (
    <Container className="mt-5" dir="rtl">
      <h1 className="text-center mb-5 text-primary fw-bold">پیشرفت من</h1>

      {/* کارت‌های آماری */}
      <Row className="mb-5">
        <Col md={3}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <h5>امتیاز کلی</h5>
              <h2 className="text-success fw-bold">{profile?.overall_score || 0}</h2>
              <Badge bg="success">عالی!</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <h5>تعداد فعالیت</h5>
              <h3 className="text-primary">{activities.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <h5>روتین فعال</h5>
              <h3 className="text-warning">{routines.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <h5>اهداف</h5>
              <h3 className="text-info">{goals.length}</h3>
              <small>{completedGoals} تکمیل شده</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* نمودار پیشرفت هفتگی */}
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h5 className="mb-0">فعالیت‌های هفتگی</h5>
            </Card.Header>
            <Card.Body>
              <Bar
                data={getWeeklyData()}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'top' }, title: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* آخرین اهداف در حال انجام */}
      <Row>
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5>اهداف در حال انجام</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {goals.filter(g => g.status !== 'Done' && g.status !== 'انجام شده').slice(0, 5).map(goal => (
                <ListGroup.Item key={goal.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{goal.title}</strong><br />
                    <small>تا {new Date(goal.end_date).toLocaleDateString('fa-IR')}</small>
                  </div>
                  <Badge bg="warning" pill>در حال انجام</Badge>
                </ListGroup.Item>
              ))}
              {inProgressGoals === 0 && <ListGroup.Item className="text-center text-muted">هدفی در حال انجام نیست</ListGroup.Item>}
            </ListGroup>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h5>آخرین فعالیت‌ها</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {activities.slice(0, 5).map(act => (
                <ListGroup.Item key={act.id}>
                  <div className="d-flex justify-content-between">
                    <span>{act.title}</span>
                    <small className="text-muted">{new Date(act.created_date).toLocaleDateString('fa-IR')}</small>
                  </div>
                </ListGroup.Item>
              ))}
              {activities.length === 0 && <ListGroup.Item className="text-center text-muted">فعالیتی ثبت نشده</ListGroup.Item>}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* نوار پیشرفت کلی */}
      <Row className="mt-5">
        <Col md={8} className="mx-auto">
          <Card className="text-center shadow-lg border-0">
            <Card.Body>
              <h4>سطح پیشرفت شما</h4>
              <ProgressBar className="my-3" style={{ height: '30px' }}>
                <ProgressBar animated striped variant="success" now={Math.min((profile?.overall_score || 0), 100)} label={`${profile?.overall_score || 0}%`} />
                <ProgressBar variant="warning" now={100 - Math.min((profile?.overall_score || 0), 100)} />
              </ProgressBar>
              <p className="text-muted">
                {profile?.overall_score >= 80 ? 'عالیه! ادامه بده!' :
                  profile?.overall_score >= 50 ? 'خوبه، یه کم بیشتر تلاش کن!' :
                    'شروع کن! تو می‌تونی!'}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProgressPage;