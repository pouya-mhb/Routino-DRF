import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewActivityPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    status: '',
    frequency: '',
    start_date: '',
    end_date: '',
    score: 5
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // بارگذاری داده‌های اولیه
  useEffect(() => {
    if (!token) {
      setError('لطفاً ابتدا وارد شوید.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [
          profileRes,
          catRes,
          subCatRes,
          statusRes,
          freqRes
        ] = await Promise.all([
          axios.get('http://localhost:8000/api/profile/me/', { headers }),
          axios.get('http://localhost:8000/api/categories/', { headers }),
          axios.get('http://localhost:8000/api/subcategories/', { headers }),
          axios.get('http://localhost:8000/api/statuses/', { headers }),
          axios.get('http://localhost:8000/api/frequencies/', { headers })
        ]);

        setProfile(profileRes.data);
        setCategories(catRes.data);
        setSubCategories(subCatRes.data);
        setStatuses(statusRes.data);
        setFrequencies(freqRes.data);

      } catch (err) {
        setError('خطا در بارگذاری اطلاعات: ' + (err.response?.data?.detail || err.message));
        if (err.response?.status === 401) {
          localStorage.clear();
          setTimeout(() => navigate('/login'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // فیلتر زیرمجموعه‌ها بر اساس دسته‌بندی انتخاب‌شده
  useEffect(() => {
    if (formData.category) {
      const filtered = subCategories.filter(sub => sub.category === parseInt(formData.category));
      setFilteredSubCategories(filtered);
      setFormData(prev => ({ ...prev, type: '' })); // ریست کردن نوع وقتی دسته‌بندی تغییر می‌کنه
    } else {
      setFilteredSubCategories([]);
      setFormData(prev => ({ ...prev, type: '' }));
    }
  }, [formData.category, subCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    if (!profile) {
      setError('پروفایل یافت نشد!');
      setSaving(false);
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description || '',
      profile: profile.user_profile,
      category: parseInt(formData.category),
      type: parseInt(formData.type),
      status: parseInt(formData.status),
      frequency: parseInt(formData.frequency),
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      score: parseInt(formData.score) || 1
    };

    try {
      await axios.post('http://localhost:8000/api/activities/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess('فعالیت با موفقیت ثبت شد!');
      setTimeout(() => {
        navigate('/activities'); // یا هر صفحه‌ای که لیست فعالیت‌ها رو داره
      }, 1500);

    } catch (err) {
      const errorMsg = err.response?.data
        ? typeof err.response.data === 'object'
          ? Object.values(err.response.data).flat().join(' | ')
          : err.response.data
        : 'خطا در ثبت فعالیت';
      setError(errorMsg);
      console.error('خطا در ثبت:', err.response?.data);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">در حال بارگذاری فرم...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5" dir="rtl">
      <h2 className="mb-4 text-center text-primary fw-bold">ثبت فعالیت جدید</h2>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="justify-content-center">
        <Col lg={9}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>

                {/* عنوان */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">عنوان فعالیت</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="مثال: دویدن صبحگاهی، مطالعه کتاب، مدیتیشن"
                    required
                    className="text-end"
                  />
                </Form.Group>

                {/* توضیحات */}
                <Form.Group className="mb-4">
                  <Form.Label>توضیحات (اختیاری)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="جزئیات بیشتر درباره این فعالیت..."
                    className="text-end"
                  />
                </Form.Group>

                {/* دسته‌بندی و نوع */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">دسته‌بندی</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">انتخاب کنید</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">نوع فعالیت</Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        disabled={!formData.category}
                      >
                        <option value="">
                          {formData.category ? 'انتخاب کنید' : 'ابتدا دسته‌بندی را انتخاب کنید'}
                        </option>
                        {filteredSubCategories.map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.title}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* وضعیت و تکرار */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">وضعیت</Form.Label>
                      <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                        <option value="">انتخاب کنید</option>
                        {statuses.map(s => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">تکرار</Form.Label>
                      <Form.Select name="frequency" value={formData.frequency} onChange={handleChange} required>
                        <option value="">انتخاب کنید</option>
                        {frequencies.map(f => (
                          <option key={f.id} value={f.id}>{f.title}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* تاریخ‌ها */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">تاریخ شروع</Form.Label>
                      <Form.Control
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>تاریخ پایان (اختیاری)</Form.Label>
                      <Form.Control
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* امتیاز */}
                <Form.Group className="mb-5">
                  <Form.Label className="fw-bold">
                    امتیاز فعالیت: <strong className="text-primary">{formData.score}</strong> از ۱۰
                  </Form.Label>
                  <Form.Range
                    min="1"
                    max="10"
                    name="score"
                    value={formData.score}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* دکمه ثبت */}
                <div className="text-center">
                  <Button
                    variant="success"
                    type="submit"
                    size="lg"
                    disabled={saving}
                    className="px-6"
                  >
                    {saving ? 'در حال ثبت...' : 'ثبت فعالیت'}
                  </Button>
                </div>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default NewActivityPage;