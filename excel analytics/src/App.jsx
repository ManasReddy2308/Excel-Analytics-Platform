import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadHistoryPage from './pages/UploadHistoryPage';
import ChartsPage from './pages/ChartsPage';
import ProfilePage from './pages/ProfilePage';
import AiInsightsPage from './pages/AiInsightsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import { ToastContainer } from "react-toastify";
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      {/* Global toast notification system */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 🔐 Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploads"
          element={
            <ProtectedRoute>
              <UploadHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/charts"
          element={
            <ProtectedRoute>
              <ChartsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <AiInsightsPage />
            </ProtectedRoute>
          }
        />

        {/* 🛡️ Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUserManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <AdminAnalyticsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReportsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettingsPage />
            </AdminRoute>
          }
        />
      </Routes>
       <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
