// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth';

export default function AdminRoute({ children }) {
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/login" />;
  }
  return children;
}
