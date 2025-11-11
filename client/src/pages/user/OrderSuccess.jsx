import React, { useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const order = location.state?.order;
  const invoiceRef = useRef();

  if (!order) {
    navigate('/');
    return null;
  }

  const generateInvoice = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${order.id}.pdf`);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Downloading as text file instead.');
      // Fallback to text download
      const invoiceContent = `
SNEAKERSHUB INVOICE
===================

Order ID: ${order.id}
Date: ${new Date(order.date).toLocaleDateString()}
Customer: ${order.user.name}
Email: ${order.user.email}

SHIPPING ADDRESS
================
${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
Phone: ${order.shippingAddress.phone}

PAYMENT METHOD: ${order.paymentMethod.replace('_', ' ').toUpperCase()}

ORDER ITEMS
===========
${order.items.map(item =>
  `${item.name} (Size: ${item.size}) - Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
).join('\n')}

ORDER SUMMARY
=============
Subtotal: $${order.subtotal.toFixed(2)}
Tax (10%): $${order.tax.toFixed(2)}
Shipping: $${order.shipping.toFixed(2)}
TOTAL: $${order.total.toFixed(2)}

Thank you for shopping with SneakersHub!
      `.trim();

      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <div className="success-icon mb-4">
              <i className="fa-solid fa-circle-check fa-5x text-success"></i>
            </div>
            <h1 className="fw-bold text-success mb-3">Order Placed Successfully!</h1>
            <p className="text-muted fs-5">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          {/* Hidden invoice template for PDF generation */}
          <div ref={invoiceRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '800px', backgroundColor: 'white', padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ color: '#28a745', marginBottom: '10px' }}>SNEAKERSHUB</h1>
              <h3 style={{ margin: '0' }}>INVOICE</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <div>
                <h5>Order Information</h5>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <h5>Shipping Address</h5>
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h5>Order Items</h5>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Item</th>
                    <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'center' }}>Size</th>
                    <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'center' }}>Qty</th>
                    <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'right' }}>Price</th>
                    <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={`${item.id}-${item.size}`}>
                      <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{item.name}</td>
                      <td style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'center' }}>{item.size}</td>
                      <td style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                      <td style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <div>
                <h5>Order Summary</h5>
                <p>Subtotal ({order.items.reduce((total, item) => total + item.quantity, 0)} items): ${order.subtotal.toFixed(2)}</p>
                <p>Tax (10%): ${order.tax.toFixed(2)}</p>
                <p>Shipping: ${order.shipping.toFixed(2)}</p>
                <hr style={{ margin: '10px 0' }} />
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Total: ${order.total.toFixed(2)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h5>Customer Details</h5>
                <p><strong>Name:</strong> {order.user.name}</p>
                <p><strong>Email:</strong> {order.user.email}</p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #dee2e6' }}>
              <p style={{ margin: '0', fontSize: '14px', color: '#6c757d' }}>
                Thank you for shopping with SneakersHub!
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                For any questions, please contact us at support@sneakershub.com
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fa-solid fa-receipt me-2"></i>
                Order Details
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-bold">Order Information</h6>
                  <p className="mb-1"><strong>Order ID:</strong> {order.id}</p>
                  <p className="mb-1"><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                  <p className="mb-1"><strong>Status:</strong>
                    <span className="badge bg-warning ms-2">{order.status}</span>
                  </p>
                  <p className="mb-0"><strong>Payment Method:</strong> {order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold">Shipping Address</h6>
                  <p className="mb-1">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p className="mb-1">{order.shippingAddress.address}</p>
                  <p className="mb-1">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p className="mb-0">{order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Items</h5>
            </div>
            <div className="card-body">
              {order.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="rounded me-3"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  <div className="flex-fill">
                    <h6 className="mb-0 fw-bold">{item.name}</h6>
                    <small className="text-muted">Size: {item.size} | Quantity: {item.quantity}</small>
                  </div>
                  <div className="text-end">
                    <p className="fw-bold text-primary mb-0">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-bold">Order Summary</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal ({order.items.reduce((total, item) => total + item.quantity, 0)} items)</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax (10%)</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold fs-5">Total</span>
                    <span className="fw-bold fs-5 text-primary">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="col-md-6 text-center">
                  <div className="alert alert-info">
                    <i className="fa-solid fa-info-circle me-2"></i>
                    <strong>Next Steps:</strong><br />
                    {order.paymentMethod === 'cash_on_delivery' ? (
                      <>Payment will be collected upon delivery.</>
                    ) : (
                      <>Your payment has been processed successfully.</>
                    )}
                    <br />
                    You will receive an email confirmation shortly.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={generateInvoice}
            >
              <i className="fa-solid fa-download me-2"></i>
              Download Invoice (PDF)
            </button>
            <Link to="/shop" className="btn btn-outline-primary btn-lg">
              <i className="fa-solid fa-store me-2"></i>
              Continue Shopping
            </Link>
          </div>

          <div className="text-center mt-4">
            <small className="text-muted">
              <i className="fa-solid fa-envelope me-1"></i>
              A confirmation email has been sent to {order.user.email}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
