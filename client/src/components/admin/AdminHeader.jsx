import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      setAdminUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-bottom shadow-sm">
      <div className="d-flex justify-content-between align-items-center px-4 py-3">
        <div className="d-flex align-items-center">
          <h4 className="mb-0 text-primary">
            <i className="fas fa-crown me-2"></i>
            Admin Panel
          </h4>
        </div>

        <div className="d-flex align-items-center">
          <div className="me-3">
            <span className="text-muted">Welcome,</span>
            <span className="fw-bold ms-1">
              {adminUser?.name || 'Admin'}
            </span>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              id="adminDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user-circle me-2"></i>
              Admin
            </button>
            <ul className="dropdown-menu" aria-labelledby="adminDropdown">
              <li>
                <a className="dropdown-item" href="#profile">
                  <i className="fas fa-user me-2"></i>
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#settings">
                  <i className="fas fa-cog me-2"></i>
                  Settings
                </a>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

