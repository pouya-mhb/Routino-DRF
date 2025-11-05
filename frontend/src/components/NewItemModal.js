import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function NewItemModal({ show, handleClose, itemType, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    start_date: '',
    end_date: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = itemType === 'activity' ? '/api/activities/' :
                      itemType === 'routine' ? '/api/routines/' :
                      '/api/goals/';
      const response = await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onSuccess(response.data);
      handleClose();
      setFormData({ title: '', description: '', category: '', start_date: '', end_date: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || `خطا در ثبت ${itemType === 'activity' ? 'فعالیت' : itemType === 'routine' ? 'روتین' : 'هدف'}`);
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered dir="rtl">
      <Modal.Header closeButton>
        <Modal.Title>ثبت {itemType === 'activity' ? 'فعالیت جدید' : itemType === 'routine' ? 'روتین جدید' : 'هدف جدید'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>عنوان</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="عنوان"
              style={{ textAlign: 'right' }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>توضیحات</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="توضیحات"
              style={{ textAlign: 'right' }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCategory">
            <Form.Label>دسته‌بندی</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="دسته‌بندی"
              style={{ textAlign: 'right' }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formStartDate">
            <Form.Label>تاریخ شروع</Form.Label>
            <Form.Control
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              style={{ textAlign: 'right' }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEndDate">
            <Form.Label>تاریخ پایان</Form.Label>
            <Form.Control
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              style={{ textAlign: 'right' }}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            ثبت
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default NewItemModal;