import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../contexts/ProductsContext';
import { useOrders } from '../../contexts/OrdersContext';

// Import local data as fallback
import productsData from '../../data/products.json';
import ordersData from '../../data/orders.json';
import usersData from '../../data/users.json';

const Dashboard = () => {
  const { products } = useProducts();
  const { orders } = useOrders();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
    monthlyRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [products, orders]);

  const fetchDashboardData = () => {
    try {
      // Use dynamic data from contexts, fallback to static data
      const currentProducts = products.length > 0 ? products : productsData;
      const currentOrders = orders.length > 0 ? orders : ordersData;

      // Get registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const currentUsers = registeredUsers.length > 0 ? registeredUsers : usersData;

      const totalProducts = currentProducts.length;
      const totalOrders = currentOrders.length;
      const totalUsers = currentUsers.length;

      // Calculate total revenue from orders with error handling
      const totalRevenue = currentOrders.reduce(
        (sum, order) => {
          const price = parseFloat(order.totalPrice || order.total || 0);
          return sum + (isNaN(price) ? 0 : price);
        },
        0
      );

      // Calculate monthly revenue (current month) with error handling
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = currentOrders
        .filter(order => {
          try {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
          } catch (error) {
            console.warn('Invalid date format for order:', order._id);
            return false;
          }
        })
        .reduce((sum, order) => {
          const price = parseFloat(order.totalPrice || order.total || 0);
          return sum + (isNaN(price) ? 0 : price);
        }, 0);

      // Count pending orders with status validation
      const pendingOrders = currentOrders.filter(order =>
        order.status && order.status.toLowerCase() === 'pending'
      ).length;

      // Count low stock products (assuming stock < 10 is low) with validation
      const lowStockProducts = currentProducts.filter(product => {
        const stock = parseInt(product.stock || 0);
        return !isNaN(stock) && stock < 10;
      }).length;

      // Count active users (users who have logged in recently - within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = currentUsers.filter(user => {
        if (!user.loginTime) return false;
        try {
          return new Date(user.loginTime) > thirtyDaysAgo;
        } catch (error) {
          return false;
        }
      }).length;

      // Get recent orders (last 5) with date validation
      const recentOrders = [...currentOrders]
        .filter(order => {
          try {
            new Date(order.createdAt);
            return true;
          } catch (error) {
            console.warn('Invalid date format for order:', order._id);
            return false;
          }
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Get top products (by price, highest first) with validation
      const topProducts = [...currentProducts]
        .filter(product => {
          const price = parseFloat(product.price || 0);
          return !isNaN(price);
        })
        .sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0))
        .slice(0, 5);

      setStats({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        recentOrders,
        topProducts,
        monthlyRevenue,
        pendingOrders,
        lowStockProducts,
        activeUsers
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="col-md-3 mb-4">
      <div className={`card border-0 shadow-sm bg-${color} text-white`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-title mb-1">{title}</h6>
              <h3 className="mb-0 fw-bold">{value}</h3>
              {subtitle && <small className="opacity-75">{subtitle}</small>}
            </div>
            <div className="fs-1 opacity-75">
              <i className={icon}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
          <h2 className="mb-0">Dashboard</h2>
          <button className="btn btn-primary" onClick={fetchDashboardData}>
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="fas fa-shoe-prints"
            color="primary"
            subtitle="Active products"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="fas fa-shopping-cart"
            color="success"
            subtitle="All time orders"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="fas fa-users"
            color="info"
            subtitle="Registered users"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon="fas fa-dollar-sign"
            color="warning"
            subtitle="All time revenue"
          />
        </div>

        {/* Additional Statistics Cards */}
        <div className="row mb-4">
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toFixed(2)}`}
            icon="fas fa-calendar-alt"
            color="secondary"
            subtitle="This month"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="fas fa-clock"
            color="warning"
            subtitle="Awaiting processing"
          />
          <StatCard
            title="Low Stock Alert"
            value={stats.lowStockProducts}
            icon="fas fa-exclamation-triangle"
            color="danger"
            subtitle="Products < 10 stock"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon="fas fa-user-check"
            color="success"
            subtitle="Last 30 days"
          />
        </div>

        <div className="row">
          {/* Recent Orders */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Recent Orders
                </h5>
                <span className="badge bg-primary">{stats.recentOrders.length}</span>
              </div>
              <div className="card-body">
                {stats.recentOrders.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders.map((order, index) => (
                          <tr key={order.id || index}>
                            <td>
                              <strong className="text-primary">#{(order.id || '').toString().slice(-6)}</strong>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar me-2">
                                  <div
                                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                                    style={{ width: '30px', height: '30px', fontSize: '12px' }}
                                  >
                                    {(order.user?.name || 'N').charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                {order.user?.name || 'N/A'}
                              </div>
                            </td>
                            <td>
                              <strong>${parseFloat(order.totalPrice || order.total || 0).toFixed(2)}</strong>
                            </td>
                            <td>
                              <span className={`badge bg-${getStatusColor(order.status)}`}>
                                {order.status || 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p className="text-muted mb-0">No recent orders</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-star me-2"></i>
                  Top Products
                </h5>
                <span className="badge bg-warning text-dark">{stats.topProducts.length}</span>
              </div>
              <div className="card-body">
                {stats.topProducts.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.topProducts.map((product, index) => (
                          <tr key={product.id || index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={product.img || '/assets/img/images.png'}
                                  alt={product.name}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  className="rounded me-2"
                                />
                                <div>
                                  <strong>{product.name}</strong>
                                  <br />
                                  <small className="text-muted">ID: {product.id}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong className="text-success">${parseFloat(product.price || 0).toFixed(2)}</strong>
                            </td>
                            <td>
                              <span className={`badge ${product.stock < 10 ? 'bg-danger' : 'bg-success'}`}>
                                {product.stock || 0}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="text-warning me-1">
                                  <i className="fas fa-star"></i>
                                </span>
                                <strong>{parseFloat(product.rating || 0).toFixed(1)}</strong>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                    <p className="text-muted mb-0">No products available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics Section */}
        <div className="row">
          {/* Revenue Chart Placeholder */}
          <div className="col-md-8 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-chart-line me-2"></i>
                  Revenue Analytics
                </h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <h4 className="text-primary mb-1">${stats.totalRevenue.toFixed(2)}</h4>
                      <p className="text-muted mb-0">Total Revenue</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <h4 className="text-success mb-1">${stats.monthlyRevenue.toFixed(2)}</h4>
                      <p className="text-muted mb-0">This Month</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Revenue data is calculated from all completed orders
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-bolt me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => window.location.href = '/admin/products'}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add New Product
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => window.location.href = '/admin/users'}
                  >
                    <i className="fas fa-users me-2"></i>
                    View All Users
                  </button>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => window.location.href = '/admin/orders'}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Process Orders
                  </button>
                  <button
                    className="btn btn-outline-info"
                    onClick={() => window.location.href = '/admin/dashboard'}
                  >
                    <i className="fas fa-chart-bar me-2"></i>
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'processing': return 'info';
    case 'shipped': return 'primary';
    case 'delivered': return 'success';
    case 'cancelled': return 'danger';
    default: return 'secondary';
  }
};

export default Dashboard;
