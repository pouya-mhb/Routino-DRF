import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.rtl.min.css'; // نسخه RTL بوت‌استرپ
import axios from 'axios';
import './index.css'; // فایل CSS سفارشی

axios.defaults.baseURL = 'http://localhost:8000';
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);