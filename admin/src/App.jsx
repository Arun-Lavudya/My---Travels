import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import authService from './services/authService';
import Sidebar from './components/Sidebar';
import Buses from './pages/Buses';
import RoutesPage from './pages/Routes';
import AddBooking from './pages/AddBooking';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const AdminLayout = ({ children }) => (
  <div className="flex bg-gray-100 min-h-screen">
    <Sidebar />
    <div className="flex-1 overflow-auto p-8">
      {children}
    </div>
  </div>
);


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminLayout><Dashboard /></AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/buses"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminLayout><Buses /></AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/routes"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminLayout><RoutesPage /></AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <AdminLayout><Bookings /></AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-booking"
          element={
            <PrivateRoute>
              <AdminLayout><AddBooking /></AdminLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
