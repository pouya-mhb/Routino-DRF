import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import { ProfilePage } from './components/ProfilePage';
import CategoriesPage from './components/CategoriesPage';
import ActivitiesPage from './components/ActivitiesPage';
import RoutinesPage from './components/RoutinesPage';
import GoalsPage from './components/GoalsPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProgressPage from './components/ProgressPage';
import NewGoalPage from './components/NewGoalPage';
import NewRoutinePage from './components/NewRoutinePage';
import NewActivityPage from './components/NewActivityPage';
import ScoresPage from './components/ScoresPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/new-goal" element={<NewGoalPage />} />
        <Route path="/new-routine" element={<NewRoutinePage />} />
        <Route path="/new-activity" element={<NewActivityPage />} />
        <Route path="/scores" element={<ScoresPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/routines" element={<RoutinesPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;