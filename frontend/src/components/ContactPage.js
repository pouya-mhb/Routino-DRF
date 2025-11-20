import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup
} from 'react-bootstrap';
import {
  EnvelopeFill,
  Telegram,
  Instagram,
  Whatsapp,
  PhoneFill,
  MapFill,
  SendFill,
  Check2Circle
} from 'react-bootstrap-icons';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(''); // '', 'sending', 'success', 'error'
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setAlertMessage('');

    // شبیه‌سازی ارسال پیام (در آینده به API وصل می‌شه)
    setTimeout(() => {
      // اینجا می‌تونی به بک‌اند یا سرویس‌هایی مثل EmailJS وصل کنی
      setStatus('success');
      setAlertMessage('پیامت با موفقیت ارسال شد! خیلی زود باهات تماس می‌گیریم');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <Container className="mt-5 mb-5" dir="rtl">
      {/* هدر */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary mb-3">تماس با ما</h1>
        <p className="lead text-muted fs-5 max-w-700 mx-auto">
          سوالی داری؟ پیشنهادی؟ مشکلی؟
          ما اینجاییم تا بهت کمک کنیم و صدات رو بشنویم
        </p>
      </div>

      <Row className="g-5">
        {/* فرم تماس */}
        <Col lg={7}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4 p-md-5">
              <h4 className="fw-bold mb-4 text-primary">ارسال پیام</h4>

              {status === 'success' && (
                <Alert variant="success" className="d-flex align-items-center gap-2">
                  <Check2Circle size={20} />
                  {alertMessage}
                </Alert>
              )}

              {status === 'error' && (
                <Alert variant="danger">
                  خطایی رخ داد. لطفاً دوباره تلاش کنید.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>نام و نام خانوادگی</Form.Label>
                      <InputGroup>
                        <InputGroup.Text><EnvelopeFill size={16} /></InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="مثال: علی رضایی"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ایمیل</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>@</InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="example@gmail.com"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>موضوع</Form.Label>
                  <Form.Select name="subject" onChange={handleChange} required>
                    <option value="">انتخاب کنید...</option>
                    <option value="support">پشتیبانی فنی</option>
                    <option value="suggestion">پیشنهاد و ایده</option>
                    <option value="bug">گزارش باگ</option>
                    <option value="cooperation">همکاری</option>
                    <option value="other">سایر موارد</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>پیام شما</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="هر چی تو دلته بنویس... ما می‌خونیمش"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100 fw-bold"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>در حال ارسال...</>
                  ) : (
                    <>
                      <SendFill className="me-2" />
                      ارسال پیام
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* اطلاعات تماس */}
        <Col lg={5}>
          <h4 className="fw-bold mb-4 text-primary">راه‌های ارتباطی</h4>

          <div className="d-flex flex-column gap-4">
            <Card className="border-0 shadow-sm p-4 hover-lift">
              <div className="d-flex align-items-center gap- gap-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <EnvelopeFill size={24} className="text-primary" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">ایمیل</h6>
                  <p className="text-muted mb-0 small">support@routino.app</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm p-4 hover-lift">
              <div className="d-flex align-items-center gap- gap-3">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <Whatsapp size={24} className="text-success" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">واتساپ</h6>
                  <p className="text-muted mb-0 small">+98 901 234 5678</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm p-4 hover-lift">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                  <Telegram size={24} className="text-info" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">تلگرام</h6>
                  <p className="text-muted mb-0 small">@RoutinoSupport</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm p-4 hover-lift">
              <div className="d-flex align-items-center gap- gap-3">
                <div className="bg-pink bg-opacity-10 p-3 rounded-circle">
                  <Instagram size={24} className="text-pink" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">اینستاگرام</h6>
                  <p className="text-muted mb-0 small">@routino.app</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm p-4 hover-lift">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                  <PhoneFill size={24} className="text-warning" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">پشتیبانی تلفنی</h6>
                  <p className="text-muted mb-0 small">شنبه تا چهارشنبه — ۹ صبح تا ۵ عصر</p>
                </div>
              </div>
            </Card>
          </div>

          {/* نقشه کوچک (اختیاری) */}
          <div className="mt-4">
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="bg-light p-4 text-center">
                <MapFill size={40} className="text-muted mb-3" />
                <p className="mb-0 text-muted">
                  ما در سراسر ایران هستیم<br />
                  و همیشه آنلاین!
                </p>
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* استایل‌های زیبا */}
      <style jsx>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.1) !important;
        }
        .bg-pink {
          background-color: #e91e63 !important;
        }
        .text-pink {
          color: #e91e63 !important;
        }
        .max-w-700 {
          max-width: 700px;
        }
      `}</style>
    </Container>
  );
}

export default ContactPage;