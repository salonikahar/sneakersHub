import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h2 className="mb-0">Orders Management</h2>
          <button 
            className="btn btn-primary"
            onClick={fetchOrders}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
        </div>

        {/* Orders Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong>#{order._id.slice(-6)}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{order.user?.name || 'N/A'}</strong>
                          <br />
                          <small className="text-muted">{order.user?.email || 'N/A'}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {order.orderItems?.length || 0} items
                        </span>
                      </td>
                      <td>
                        <strong>${order.totalPrice?.toFixed(2) || '0.00'}</strong>
                      </td>
                      <td>
                        <select
                          className={`form-select form-select-sm border-${getStatusColor(order.status)}`}
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          style={{ width: 'auto' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <small>{formatDate(order.createdAt)}</small>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewOrder(order)}
                        >
                          <i className="fas fa-eye me-1"></i>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Order Details - #{selectedOrder._id.slice(-6)}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6>Customer Information</h6>
                      <p><strong>Name:</strong> {selectedOrder.user?.name || 'N/A'}</p>
                      <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Order Information</h6>
                      <p><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                      <p><strong>Status:</strong> 
                        <span className={`badge bg-${getStatusColor(selectedOrder.status)} ms-2`}>
                          {selectedOrder.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6>Shipping Address</h6>
                    <p>
                      {selectedOrder.shippingAddress?.address}<br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}<br />
                      {selectedOrder.shippingAddress?.country}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h6>Order Items</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.orderItems?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img
                                    src={item.image || '/assets/img/images.png'}
                                    alt={item.name}
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                    className="rounded me-2"
                                  />
                                  <span>{item.name}</span>
                                </div>
                              </td>
                              <td>{item.size}</td>
                              <td>{item.quantity}</td>
                              <td>${item.price?.toFixed(2)}</td>
                              <td>${(item.price * item.quantity)?.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 offset-md-6">
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td><strong>Subtotal:</strong></td>
                            <td className="text-end">${selectedOrder.itemsPrice?.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td><strong>Tax:</strong></td>
                            <td className="text-end">${selectedOrder.taxPrice?.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td><strong>Shipping:</strong></td>
                            <td className="text-end">${selectedOrder.shippingPrice?.toFixed(2)}</td>
                          </tr>
                          <tr className="table-active">
                            <td><strong>Total:</strong></td>
                            <td className="text-end"><strong>${selectedOrder.totalPrice?.toFixed(2)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
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

export default Orders;

