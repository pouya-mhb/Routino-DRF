import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Accordion } from 'react-bootstrap';
import axios from 'axios';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ title: '', description: '', score: 1 });
  const [subCategoryForm, setSubCategoryForm] = useState({ title: '', description: '', score: 1, category_id: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/categories/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setCategories(res.data));
    axios.get('/api/subcategories/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setSubCategories(res.data));
  }, []);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/categories/', categoryForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCategories([...categories, response.data]);
      setCategoryForm({ title: '', description: '', score: 1 });
    } catch (err) {
      setError('خطا در افزودن دسته‌بندی: ' + err.response.data);
    }
  };

  const handleSubCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/subcategories/', subCategoryForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSubCategories([...subCategories, response.data]);
      setSubCategoryForm({ title: '', description: '', score: 1, category_id: '' });
    } catch (err) {
      setError('خطا در افزودن زیرمجموعه: ' + err.response.data);
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };

  const handleSubCategoryChange = (e) => {
    setSubCategoryForm({ ...subCategoryForm, [e.target.name]: e.target.value });
  };

  return (
    <Container className="mt-5">
      <h2>دسته‌بندی‌ها</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Accordion className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>افزودن دسته‌بندی جدید</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleCategorySubmit}>
              <Form.Group className="mb-3">
                <Form.Label>عنوان</Form.Label>
                <Form.Control name="title" value={categoryForm.title} onChange={handleCategoryChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>توضیحات</Form.Label>
                <Form.Control as="textarea" name="description" value={categoryForm.description} onChange={handleCategoryChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>امتیاز</Form.Label>
                <Form.Control type="number" name="score" value={categoryForm.score} onChange={handleCategoryChange} />
              </Form.Group>
              <Button type="submit" variant="primary">افزودن دسته‌بندی</Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>افزودن زیرمجموعه جدید</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSubCategorySubmit}>
              <Form.Group className="mb-3">
                <Form.Label>عنوان</Form.Label>
                <Form.Control name="title" value={subCategoryForm.title} onChange={handleSubCategoryChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>دسته‌بندی</Form.Label>
                <Form.Select name="category_id" value={subCategoryForm.category_id} onChange={handleSubCategoryChange}>
                  <option value="">انتخاب کنید</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>توضیحات</Form.Label>
                <Form.Control as="textarea" name="description" value={subCategoryForm.description} onChange={handleSubCategoryChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>امتیاز</Form.Label>
                <Form.Control type="number" name="score" value={subCategoryForm.score} onChange={handleSubCategoryChange} />
              </Form.Group>
              <Button type="submit" variant="primary">افزودن زیرمجموعه</Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h3>لیست دسته‌بندی‌ها و زیرمجموعه‌ها</h3>
      <ListGroup>
        {categories.map(category => (
          <ListGroup.Item key={category.id}>
            <h5>{category.title}</h5>
            <p>{category.description}</p>
            <small>امتیاز: {category.score}</small>
            <h6 className="mt-2">زیرمجموعه‌ها:</h6>
            <ListGroup>
              {subCategories.filter(sub => sub.category.id === category.id).map(sub => (
                <ListGroup.Item key={sub.id}>
                  {sub.title} (امتیاز: {sub.score})
                </ListGroup.Item>
              ))}
            </ListGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default CategoriesPage;