import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: 'fas fa-tachometer-alt',
      label: 'Dashboard'
    },
    {
      path: '/admin/products',
      icon: 'fas fa-shoe-prints',
      label: 'Products'
    },
    {
      path: '/admin/orders',
      icon: 'fas fa-shopping-cart',
      label: 'Orders'
    },
    {
      path: '/admin/users',
      icon: 'fas fa-users',
      label: 'Users'
    },

  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-dark text-white" style={{ minHeight: '100vh', width: '250px' }}>
      <div className="p-3 border-bottom">
        <h5 className="mb-0">
          <i className="fas fa-crown me-2"></i>
          SneakersHub Admin
        </h5>
      </div>

      <nav className="p-3">
        <ul className="nav flex-column">
          {menuItems.map((item, index) => (
            <li className="nav-item" key={index}>
              <Link
                to={item.path}
                className={`nav-link text-white d-flex align-items-center py-2 px-3 rounded ${
                  isActive(item.path) ? 'bg-primary' : ''
                }`}
                style={{ textDecoration: 'none' }}
              >
                <i className={`${item.icon} me-3`} style={{ width: '20px' }}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>


    </div>
  );
};

export default AdminSidebar;
