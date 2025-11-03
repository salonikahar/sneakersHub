import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1">
        <AdminHeader />
        <main className="p-4 bg-light" style={{ minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

