// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Import Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/footer.jsx';

// Import Pages
import HomePage from './components/HomePage';
import FindRoomPage from './pages/FindRoomPage';
import FindRoommatePage from './pages/FindRoommatePage';
import ListPropertyPage from './pages/ListPropertyPage';
import BrokerZonePage from './pages/BrokerZonePage';
import SupportPage from './pages/SupportPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage.jsx';
import ProfileDetailPage from './pages/ProfileDetailPage';
import FeedbackPage from './pages/FeedbackPage';
import DashboardPage from './pages/DashboardPage';
import AdminPanelPage from './pages/AdminPanelPage';
import SuperAdminPanelPage from './pages/SuperAdminPanelPage';
import NotFoundPage from './pages/NotFoundPage';
import { AppContextProvider } from './context/Appcontext';




const App = () => {
  return (
    <Router>
      <AppContextProvider> {/* Wrap the entire application with AppContextProvider */}
        <div className="min-h-screen bg-gray-50 font-inter antialiased flex flex-col">
          <Navbar />
          <div className="flex-grow"> {/* This div ensures content pushes footer down */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/find-room" element={<FindRoomPage />} />
              <Route path="/find-roommate" element={<FindRoommatePage />} />
              <Route path="/list-property" element={<ListPropertyPage />} />
              <Route path="/broker-zone" element={<BrokerZonePage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile/:id" element={<ProfileDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin-panel" element={<AdminPanelPage />} />
              <Route path="/super-admin-panel" element={<SuperAdminPanelPage />} /> {/* New route for Super Admin */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AppContextProvider>
    </Router>
  );
};

export default App;
