import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Checkout = () => {
  const { cartItems, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const calculateSubtotal = () => {
    return getCartTotal();
  };

  const calculateTax = () => {
    return getCartTotal() * 0.1; // 10% tax
  };

  const calculateShipping = () => {
    return getCartTotal() > 200 ? 0 : 15; // Free shipping over $200
  };

  const calculateTotal = () => {
    return getCartTotal() + calculateTax() + calculateShipping();
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order object
      const order = {
        id: Date.now().toString(),
        user: user.email,
        items: cartItems,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shipping: calculateShipping(),
        total: calculateTotal(),
        date: new Date().toISOString(),
        status: 'confirmed'
      };

      // Store order in localStorage (in real app, this would be sent to backend)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart
      clearCart();

      // Show success message
      setOrderPlaced(true);

      // Redirect to order confirmation after 3 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 3000);

    } catch (error) {
      alert('Error placing order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card border-0 shadow-lg">
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className="fa-solid fa-check-circle fa-5x text-success mb-4"></i>
                  <h2 className="fw-bold text-success mb-3">Order Placed Successfully!</h2>
                  <p className="text-muted mb-4">
                    Thank you for your purchase, {user?.name || user?.email}!
                    Your order has been confirmed and will be processed shortly.
                  </p>
                  <div className="alert alert-info">
                    <strong>Order ID:</strong> {Date.now().toString()}
                  </div>
                  <p className="text-muted">Redirecting to your orders page...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <i className="fa-solid fa-shopping-bag fa-5x text-muted mb-4"></i>
                <h2 className="fw-bold mb-3">Your Cart is Empty</h2>
                <p className="text-muted mb-4">Add some items to your cart before checkout.</p>
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <i className="fa-solid fa-store me-2"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8">
          {/* Customer Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Customer Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Name:</strong> {user?.name || 'N/A'}</p>
                  <p className="mb-1"><strong>Email:</strong> {user?.email}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
                  <p className="mb-0"><strong>Member since:</strong> {user?.signupTime ? new Date(user.signupTime).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Shipping Address</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-warning">
                <i className="fa-solid fa-exclamation-triangle me-2"></i>
                Please provide your shipping address to complete the order.
              </div>
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" placeholder="Enter first name" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" placeholder="Enter last name" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" placeholder="Enter street address" />
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">City</label>
                    <input type="text" className="form-control" placeholder="Enter city" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">State</label>
                    <input type="text" className="form-control" placeholder="Enter state" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">ZIP Code</label>
                    <input type="text" className="form-control" placeholder="Enter ZIP code" />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Payment Method</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="radio" name="payment" id="credit" defaultChecked />
                    <label className="form-check-label" htmlFor="credit">
                      <i className="fa-solid fa-credit-card me-2"></i>
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="radio" name="payment" id="paypal" />
                    <label className="form-check-label" htmlFor="paypal">
                      <i className="fab fa-paypal me-2"></i>
                      PayPal
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2 justify-content-center">
                    <i className="fab fa-cc-visa fa-2x text-primary"></i>
                    <i className="fab fa-cc-mastercard fa-2x text-warning"></i>
                    <i className="fab fa-cc-amex fa-2x text-info"></i>
                    <i className="fab fa-cc-paypal fa-2x text-primary"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h5 className="fw-bold mb-4">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tax (10%)</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span className={calculateShipping() === 0 ? 'text-success' : ''}>
                  {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-5 text-primary">${calculateTotal().toFixed(2)}</span>
              </div>

              {/* Place Order Button */}
              <button
                className="btn btn-success btn-lg w-100 mb-3"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock me-2"></i>
                    Place Order
                  </>
                )}
              </button>

              <div className="text-center">
                <small className="text-muted">
                  <i className="fa-solid fa-shield-halved me-1"></i>
                  Your payment information is secure and encrypted
                </small>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Order Items</h6>
              {cartItems.slice(0, 3).map((item) => (
                <div key={`${item.id}-${item.size}`} className="d-flex align-items-center mb-2">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="rounded me-3"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <p className="mb-0 fw-bold small">{item.name}</p>
                    <p className="mb-0 text-muted small">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {cartItems.length > 3 && (
                <p className="text-muted small text-center">
                  ... and {cartItems.length - 3} more items
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
