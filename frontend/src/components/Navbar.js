import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  HouseDoorFill,
  PersonCircle,
  Bullseye,
  ClockFill,
  LightningChargeFill,
  TrophyFill,
  BoxArrowRight,
  BarChartFill,
  PersonPlusFill,
  BoxArrowInRight
} from 'react-bootstrap-icons';
import axios from 'axios';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [overallScore, setOverallScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);

      // دریافت اطلاعات پروفایل برای نمایش نام و امتیاز
      const fetchProfile = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/profile/me/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = response.data;
          setUserName(data.firstName || data.userName || 'کاربر');
          setOverallScore(data.overall_score || 0);
        } catch (err) {
          console.error('خطا در دریافت پروفایل', err);
        }
      };
      fetchProfile();
    } else {
      setIsAuthenticated(false);
      setUserName('');
      setOverallScore(0);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setIsAuthenticated(false);
      setUserName('');
      setOverallScore(0);
      navigate('/login');
    }
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-3">
      <Container fluid className="px-4">
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold fs-4 d-flex align-items-center gap-2">
          Routino
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />

        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto align-items-center">

            {isAuthenticated ? (
              <>
                {/* پیشرفت من */}
                <Nav.Link as={Link} to="/progress" className="d-flex align-items-center gap-2 px-3 py-2 rounded hover-bg">
                  <BarChartFill size={18} />
                  <span>پیشرفت من</span>
                </Nav.Link>

                {/* اهداف */}
                <Nav.Link as={Link} to="/goals" className="d-flex align-items-center gap-2 px-3 py-2 rounded hover-bg">
                  <Bullseye size={18} />
                  <span>اهداف</span>
                </Nav.Link>

                {/* روتین‌ها */}
                <Nav.Link as={Link} to="/routines" className="d-flex align-items-center gap-2 px-3 py-2 rounded hover-bg">
                  <ClockFill size={18} />
                  <span>روتین‌ها</span>
                </Nav.Link>

                {/* فعالیت جدید */}
                <Nav.Link as={Link} to="/new-activity" className="d-flex align-items-center gap-2 px-3 py-2 rounded hover-bg">
                  <LightningChargeFill size={18} />
                  <span>فعالیت جدید</span>
                </Nav.Link>

                {/* پروفایل با دراپ‌داون */}
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center gap-2">
                      <PersonCircle size={20} />
                      {userName}
                      <Badge bg="success" className="ms-2">{overallScore}</Badge>
                    </span>
                  }
                  id="profile-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <PersonCircle className="me-2" /> پروفایل من
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/progress">
                    <BarChartFill className="me-2" /> پیشرفت و آمار
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    <BoxArrowRight className="me-2" /> خروج
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-2 px-3 py-2 rounded hover-bg">
                  <HouseDoorFill size={18} />
                  خانه
                </Nav.Link>

                <Nav.Link as={Link} to="/about" className="px-3 py-2 rounded hover-bg">
                  درباره ما
                </Nav.Link>

                <Nav.Link as={Link} to="/contact" className="px-3 py-2 rounded hover-bg">
                  تماس با ما
                </Nav.Link>

                <Nav className="ms-auto">
                  <Nav.Link as={Link} to="/login" className="d-flex align-items-center gap-2 btn btn-outline-light mx-2">
                    <BoxArrowInRight size={18} />
                    ورود
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup" className="d-flex align-items-center gap-2 btn btn-success">
                    <PersonPlusFill size={18} />
                    ثبت‌نام
                  </Nav.Link>
                </Nav>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>

      {/* استایل‌های اضافه برای افکت hover */}
      <style jsx>{`
        .hover-bg:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .navbar-nav .nav-link {
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .navbar-brand {
          font-family: 'Vazirmatn', sans-serif;
          letter-spacing: 1px;
        }
      `}</style>
    </BootstrapNavbar>
  );
}

export default Navbar;