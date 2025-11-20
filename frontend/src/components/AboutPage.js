import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {
  Bullseye,
  Clock,
  Trophy,
  Heart,
  People,
  Lightbulb,
  Rocket,
  Stars
} from 'react-bootstrap-icons';

function AboutPage() {
  return (
    <Container className="mt-5 mb-5" dir="rtl">
      {/* هدر اصلی */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-4">
          روتینو — همراه همیشگی پیشرفت تو
        </h1>
        <p className="lead text-muted fs-5 max-w-800 mx-auto">
          ما باور داریم که موفقیت‌های بزرگ، از عادت‌های کوچک روزانه ساخته می‌شن.
          روتینو اینجا هست تا بهت کمک کنه عادت‌های خوب بسازی، هدف‌هات رو دنبال کنی و هر روز بهتر از دیروز بشی.
        </p>
      </div>

      <Row className="g-4 mb-5">
        {/* ماموریت ما */}
        <Col md={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm text-center p-4 hover-lift">
            <div className="mb-3">
              <Bullseye size={50} className="text-success" />
            </div>
            <Card.Body>
              <h4 className="fw-bold text-dark">ماموریت ما</h4>
              <p className="text-muted">
                کمک به میلیون‌ها نفر برای ساختن زندگی منظم، معنادار و پر از دستاورد با استفاده از قدرت روتین‌های روزانه.
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* داستان ما */}
        <Col md={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm text-center p-4 hover-lift">
            <div className="mb-3">
              <Lightbulb size={50} className="text-warning" />
            </div>
            <Card.Body>
              <h4 className="fw-bold text-dark">داستان روتینو</h4>
              <p className="text-muted">
                روتینو از یک ایده ساده شروع شد:
                «اگر هر روز فقط ۱٪ بهتر بشیم، بعد از یک سال ۳۷ برابر قوی‌تر خواهیم بود!»
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* آینده ما */}
        <Col md={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm text-center p-4 hover-lift">
            <div className="mb-3">
              <Rocket size={50} className="text-info" />
            </div>
            <Card.Body>
              <h4 className="fw-bold text-dark">آینده با روتینو</h4>
              <p className="text-muted">
                ما در حال ساخت یک اکوسیستم کامل برای رشد شخصی هستیم:
                از هوش مصنوعی مربی تا جامعه کاربران موفق.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ویژگی‌های کلیدی */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary mb-4">چرا روتینو؟</h2>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <div className="d-flex align-items-start gap-3 p-4 rounded-4 bg-light">
            <Clock size={40} className="text-primary flex-shrink-0" />
            <div>
              <h5 className="fw-bold">مدیریت زمان هوشمند</h5>
              <p className="text-muted mb-0">
                روتین‌های روزانه‌ات رو بساز، پیگیری کن و ببین چطور وقتت چند برابر می‌شه.
              </p>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="d-flex align-items-start gap-3 p-4 rounded-4 bg-light">
            <Trophy size={40} className="text-warning flex-shrink-0" />
            <div>
              <h5 className="fw-bold">سیستم امتیازدهی انگیزشی</h5>
              <p className="text-muted mb-0">
                هر فعالیت امتیازی داره. هرچه منظم‌تر باشی، امتیازت بیشتر می‌شه!
              </p>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="d-flex align-items-start gap-3 p-4 rounded-4 bg-light">
            <Heart size={40} className="text-danger flex-shrink-0" />
            <div>
              <h5 className="fw-bold">تمرکز روی سلامت جسم و ذهن</h5>
              <p className="text-muted mb-0">
                از ورزش و مدیتیشن تا خواب منظم — همه چیز رو با هم مدیریت کن.
              </p>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="d-flex align-items-start gap-3 p-4 rounded-4 bg-light">
            <People size={40} className="text-success flex-shrink-0" />
            <div>
              <h5 className="fw-bold">جامعه‌ای از افراد موفق</h5>
              <p className="text-muted mb-0">
                به زودی: چالش‌های گروهی، لیدربورد و رقابت دوستانه با دیگران!
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* دعوت به عمل */}
      <div className="text-center mt-5 py-5 bg-gradient-primary rounded-4 text-white">
        <Stars size={60} className="mb-3" />
        <h3 className="fw-bold mb-3">همین حالا شروع کن!</h3>
        <p className="fs-5 mb-4 max-w-700 mx-auto">
          بهترین زمان برای شروع ساختن نسخه بهتر خودت، همین امروز است.
        </p>
        <Button
          variant="light"
          size="lg"
          className="fw-bold px-5"
          onClick={() => window.location.href = '/new-activity'}
        >
          اولین فعالیتت رو ثبت کن
        </Button>
      </div>

      {/* استایل‌های اضافه */}
      <style jsx>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .max-w-800 {
          max-width: 800px;
        }
        .max-w-700 {
          max-width: 700px;
        }
      `}</style>
    </Container>
  );
}

export default AboutPage;