import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    const user = sessionStorage.getItem('adminUser');

    if (token && user) {
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;

