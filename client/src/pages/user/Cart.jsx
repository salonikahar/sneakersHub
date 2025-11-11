import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isAuthenticated()) {
      navigate('/checkout');
    } else {
      navigate('/signin', { state: { from: '/cart' } });
    }
  };

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

  if (cartItems.length === 0) {
    return (
      <div className="container my-5 postion-relative" style={{ minHeight: '60vh' }}>
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="mb-4">
              <i className="fa-solid fa-shopping-cart fa-5x text-muted mb-4"></i>
              <h2 className="fw-bold mb-3">Your Cart is Empty</h2>
              <p className="text-muted mb-4">Add some items to your cart before checking out.</p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/shop')}
              >
                <i className="fa-solid fa-store me-2"></i>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fw-bold">Shopping Cart</h1>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                clearCart();
                toast.success('Cart cleared successfully!');
              }}
            >
              <i className="fa-solid fa-trash me-2"></i>
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Cart Items ({cartItems.length})</h5>
            </div>
            <div className="card-body">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="row align-items-center mb-3 pb-3 border-bottom">
                  <div className="col-md-2">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <h6 className="fw-bold">{item.name}</h6>
                    <p className="text-muted mb-0">Size: {item.size}</p>
                    <p className="text-success fw-semibold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span className="mx-3 fw-bold">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2 text-end">
                    <p className="fw-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="col-md-1 text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        removeFromCart(item.id, item.size);
                        toast.success(`${item.name} removed from cart!`);
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-start">
            <Link to="/shop" className="btn btn-outline-primary">
              <i className="fa-solid fa-arrow-left me-2"></i>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-4">Order Summary</h5>

              <div className="mb-3">
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
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-5 text-primary">${calculateTotal().toFixed(2)}</span>
              </div>

              <button
                className="btn btn-success w-100 mb-3"
                onClick={handleCheckout}
              >
                <i className="fa-solid fa-credit-card me-2"></i>
                Proceed to Checkout
              </button>

              <div className="text-center">
                <small className="text-muted">
                  <i className="fa-solid fa-shield-halved me-1"></i>
                  Secure checkout
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
