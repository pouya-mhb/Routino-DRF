import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" dir="rtl">
      <BootstrapNavbar.Brand as={Link} to="/">روتینو</BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {isAuthenticated ? (
            <>
              <Nav.Link as={Link} to="/progress">پیشرفت من</Nav.Link>
              <Nav.Link as={Link} to="/profile">پروفایل</Nav.Link>
              <Nav.Link as={Link} to="/new-goal">هدف جدید</Nav.Link>
              <Nav.Link as={Link} to="/new-routine">روتین جدید</Nav.Link>
              <Nav.Link as={Link} to="/new-activity">فعالیت جدید</Nav.Link>
              <Nav.Link as={Link} to="/scores">جدول امتیازات</Nav.Link>
              <Nav.Link onClick={handleLogout}>خروج</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/">خانه</Nav.Link>
              <Nav.Link as={Link} to="/about">درباره ما</Nav.Link>
              <Nav.Link as={Link} to="/contact">تماس با ما</Nav.Link>
              <Nav.Link as={Link} to="/login">ورود</Nav.Link>
              <Nav.Link as={Link} to="/signup">ثبت‌نام</Nav.Link>
            </>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}

export default Navbar;