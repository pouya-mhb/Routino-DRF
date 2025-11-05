import { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function ActivitiesPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    status: '',
    frequency: '',
    start_date: '',
    end_date: '',
    score: ''
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // گرفتن پروفایل
        const profileResponse = await axios.get('http://localhost:8000/api/profile/me/', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        setProfile(profileResponse.data);
        console.log('Profile:', profileResponse.data);

        // گرفتن دسته‌بندی‌ها
        const categoriesResponse = await axios.get('http://localhost:8000/api/categories/', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        setCategories(categoriesResponse.data);

        // گرفتن زیرمجموعه‌ها
        const subcategoriesResponse = await axios.get('http://localhost:8000/api/subcategories/', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        setSubcategories(subcategoriesResponse.data);
        console.log('SubCategories:', subcategoriesResponse.data);

        // گرفتن وضعیت‌ها
        const statusesResponse = await axios.get('http://localhost:8000/api/statuses/', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        setStatuses(statusesResponse.data);

        // گرفتن فرکانس‌ها
        const frequenciesResponse = await axios.get('http://localhost:8000/api/frequencies/', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        setFrequencies(frequenciesResponse.data);

        // گرفتن فعالیت‌ها
        const activitiesResponse = await axios.get('http://localhost:8000/api/activities/', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        setActivities(activitiesResponse.data);
      } catch (err) {
        setError('خطا در بارگذاری داده‌ها: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || 'خطای ناشناخته'));
        console.error('Error:', err.response);
      }
    };
    if (token) {
      fetchData();
    } else {
      setError('لطفاً ابتدا وارد شوید.');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'category') {
      const filtered = subcategories.filter(sub => sub.category === parseInt(value));
      setFilteredSubcategories(filtered);
      console.log('Filtered SubCategories:', filtered);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) {
      setError('پروفایل کاربر یافت نشد. لطفاً دوباره وارد شوید.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/activities/', {
        ...formData,
        profile: profile.user_profile
      }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setActivities([...activities, response.data]);
      setSuccess('فعالیت با موفقیت ثبت شد!');
      setError('');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        type: '',
        status: '',
        frequency: '',
        start_date: '',
        end_date: '',
        score: ''
      });
    } catch (err) {
      setError('خطا در ثبت فعالیت: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || 'خطای ناشناخته'));
      setSuccess('');
      console.error('Error:', err.response);
    }
  };

  return (
    <Container className="mt-5" dir="rtl">
      <h2>فعالیت‌ها</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Button variant="primary" onClick={() => setShowModal(true)}>
        ثبت فعالیت جدید
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title>ثبت فعالیت جدید</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>عنوان</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>توضیحات</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>دسته‌بندی</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">انتخاب کنید</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>نوع فعالیت</Form.Label>
              <Form.Select name="type" value={formData.type} onChange={handleChange} required>
                <option value="">انتخاب کنید</option>
                {filteredSubcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>وضعیت</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                <option value="">انتخاب کنید</option>
                {statuses.map(stat => (
                  <option key={stat.id} value={stat.id}>{stat.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>فرکانس</Form.Label>
              <Form.Select name="frequency" value={formData.frequency} onChange={handleChange} required>
                <option value="">انتخاب کنید</option>
                {frequencies.map(freq => (
                  <option key={freq.id} value={freq.id}>{freq.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>تاریخ شروع</Form.Label>
              <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>تاریخ پایان</Form.Label>
              <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>امتیاز</Form.Label>
              <Form.Control type="number" name="score" value={formData.score} onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              ثبت فعالیت
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <div className="mt-4">
        {activities.map(activity => (
          <Card key={activity.id} className="mb-3">
            <Card.Body>
              <Card.Title>{activity.title}</Card.Title>
              <Card.Text>{activity.description}</Card.Text>
              <Card.Text>دسته‌بندی: {categories.find(cat => cat.id === activity.category)?.title}</Card.Text>
              <Card.Text>نوع فعالیت: {subcategories.find(sub => sub.id === activity.type)?.title}</Card.Text>
              <Card.Text>وضعیت: {statuses.find(stat => stat.id === activity.status)?.title}</Card.Text>
              <Card.Text>فرکانس: {frequencies.find(freq => freq.id === activity.frequency)?.title}</Card.Text>
              <Card.Text>تاریخ شروع: {activity.start_date}</Card.Text>
              <Card.Text>تاریخ پایان: {activity.end_date}</Card.Text>
              <Card.Text>امتیاز: {activity.score}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default ActivitiesPage;