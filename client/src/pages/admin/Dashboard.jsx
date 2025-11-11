import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

// Import local data
import productsData from '../../data/products.json';
import ordersData from '../../data/orders.json';
import usersData from '../../data/users.json';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    try {
      // Use local data instead of API calls
      const totalProducts = productsData.length;
      const totalOrders = ordersData.length;
      const totalUsers = usersData.length;

      // Calculate total revenue from orders
      const totalRevenue = ordersData.reduce(
        (sum, order) => sum + parseFloat(order.totalPrice || 0),
        0
      );

      // Get recent orders (last 5)
      const recentOrders = [...ordersData]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Get top products (by price, highest first)
      const topProducts = [...productsData]
        .sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0))
        .slice(0, 5);

      setStats({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        recentOrders,
        topProducts
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

        <div className="row">
          {/* Recent Orders */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Recent Orders
                </h5>
              </div>
              <div className="card-body">
                {stats.recentOrders.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
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
                            <td>#{(order.id || '').toString().slice(-6)}</td>
                            <td>{order.user?.name || 'N/A'}</td>
                            <td>${parseFloat(order.totalPrice || 0).toFixed(2)}</td>
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
                  <p className="text-muted text-center mb-0">No recent orders</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-star me-2"></i>
                  Top Products
                </h5>
              </div>
              <div className="card-body">
                {stats.topProducts.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
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
                            <td>{product.name}</td>
                            <td>${parseFloat(product.price || 0).toFixed(2)}</td>
                            <td>{product.stock || 0}</td>
                            <td>
                              <span className="text-warning">
                                <i className="fas fa-star"></i>
                                {parseFloat(product.rating || 0).toFixed(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center mb-0">No products available</p>
                )}
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
