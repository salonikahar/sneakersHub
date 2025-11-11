import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    try {
      // Get all registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

      // Get current logged in user
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

      // Combine registered users with current user if not already in the list
      let allUsers = [...registeredUsers];
      if (currentUser && !allUsers.find(u => u.email === currentUser.email)) {
        allUsers.push(currentUser);
      }

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userEmail) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const updatedUsers = registeredUsers.filter(user => user.email !== userEmail);
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

        // Also remove from current user if it's the same email
        const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (currentUser && currentUser.email === userEmail) {
          localStorage.removeItem('user');
        }

        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserOrders = (userEmail) => {
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      return orders.filter(order => order.user === userEmail);
    } catch (error) {
      return [];
    }
  };

  const getUserCartItems = (userEmail) => {
    try {
      const cartData = JSON.parse(localStorage.getItem(`cart_${userEmail}`) || '[]');
      return cartData;
    } catch (error) {
      return [];
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Users Management</h2>
          <button
            className="btn btn-primary"
            onClick={fetchUsers}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
        </div>

        {/* Users Stats */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Total Users</h5>
                <h3>{users.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Active Users</h5>
                <h3>{users.filter(u => u.isLoggedIn).length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Total Orders</h5>
                <h3>{users.reduce((total, user) => total + getUserOrders(user.email).length, 0)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">New This Month</h5>
                <h3>
                  {users.filter(u => {
                    const userDate = new Date(u.signupTime || u.createdAt);
                    const now = new Date();
                    return userDate.getMonth() === now.getMonth() &&
                           userDate.getFullYear() === now.getFullYear();
                  }).length}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Orders</th>
                    <th>Cart Items</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.email || index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar me-3">
                            <div
                              className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                              style={{ width: '40px', height: '40px' }}
                            >
                              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <strong>{user.name || 'N/A'}</strong>
                            {user.phone && (
                              <div>
                                <small className="text-muted">{user.phone}</small>
                              </div>
                            )}
                            {user.isLoggedIn && (
                              <div>
                                <span className="badge bg-success">Online</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge bg-${user.isLoggedIn ? 'success' : 'secondary'}`}>
                          {user.isLoggedIn ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {getUserOrders(user.email).length} orders
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {getUserCartItems(user.email).length} items
                        </span>
                      </td>
                      <td>
                        <small>{formatDate(user.signupTime || user.createdAt)}</small>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewUser(user)}
                          >
                            <i className="fas fa-eye"></i> view
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteUser(user.email)}
                          >
                            <i className="fas fa-trash"></i>delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User Details Modal */}
        {showModal && selectedUser && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User Details - {selectedUser.name || selectedUser.email}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-4">
                    <div className="col-md-4 text-center">
                      <div
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-3"
                        style={{ width: '100px', height: '100px', fontSize: '2rem' }}
                      >
                        {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : selectedUser.email.charAt(0).toUpperCase()}
                      </div>
                      <h5>{selectedUser.name || 'N/A'}</h5>
                      <span className={`badge bg-${selectedUser.isLoggedIn ? 'success' : 'secondary'}`}>
                        {selectedUser.isLoggedIn ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="col-md-8">
                      <h6>Contact Information</h6>
                      <p><strong>Email:</strong> {selectedUser.email}</p>
                      <p><strong>Phone:</strong> {selectedUser.phone || 'Not provided'}</p>
                      <p><strong>Joined:</strong> {formatDate(selectedUser.signupTime || selectedUser.createdAt)}</p>
                      <p><strong>Last Login:</strong> {selectedUser.loginTime ? formatDate(selectedUser.loginTime) : 'Never'}</p>

                      {selectedUser.firstName && selectedUser.lastName && (
                        <div className="mt-3">
                          <h6>Full Name</h6>
                          <p>{selectedUser.firstName} {selectedUser.lastName}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header">
                          <h6 className="mb-0">Order History ({getUserOrders(selectedUser.email).length})</h6>
                        </div>
                        <div className="card-body">
                          {getUserOrders(selectedUser.email).length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-sm">
                                <thead>
                                  <tr>
                                    <th>Order ID</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getUserOrders(selectedUser.email).slice(0, 5).map((order) => (
                                    <tr key={order.id}>
                                      <td>#{order.id.slice(-6)}</td>
                                      <td>${order.total?.toFixed(2)}</td>
                                      <td>{formatDate(order.date)}</td>
                                      <td>
                                        <span className="badge bg-success">
                                          {order.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-muted mb-0">No orders yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header">
                          <h6 className="mb-0">Current Cart ({getUserCartItems(selectedUser.email).length})</h6>
                        </div>
                        <div className="card-body">
                          {getUserCartItems(selectedUser.email).length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-sm">
                                <thead>
                                  <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getUserCartItems(selectedUser.email).slice(0, 5).map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.name || 'N/A'}</td>
                                      <td>{item.quantity}</td>
                                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-muted mb-0">Cart is empty</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Backdrop */}
        {showModal && (
          <div className="modal-backdrop fade show"></div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;
