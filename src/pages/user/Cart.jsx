import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productsData from '../../data/products.json';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount
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
      <div className="container my-5">
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="mb-4">
              <i className="fa-solid fa-shopping-bag fa-5x text-muted mb-4"></i>
              <h2 className="fw-bold mb-3">Your Cart is Empty</h2>
              <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <i className="fa-solid fa-store me-2"></i>
                  Continue Shopping
                </Link>
                <Link to="/" className="btn btn-outline-primary btn-lg">
                  <i className="fa-solid fa-home me-2"></i>
                  Back to Home
                </Link>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-5">
              <h5 className="mb-4">Popular Items You Might Like</h5>
              <div className="row g-3">
                {productsData.slice(0, 3).map((product) => (
                  <div key={product.id} className="col-md-4">
                    <div className="card border-0 shadow-sm">
                      <img
                        src={product.img}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: '150px', objectFit: 'cover' }}
                      />
                      <div className="card-body text-center">
                        <h6 className="card-title fw-bold">{product.name}</h6>
                        <p className="card-text text-success fw-bold">${product.price}</p>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Shopping Cart</h1>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={clearCart}
        >
          <i className="fa-solid fa-trash me-2"></i>
          Clear Cart
        </button>
      </div>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Cart Items ({cartItems.length})</h5>
            </div>
            <div className="card-body">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="row align-items-center py-3 border-bottom">
                  <div className="col-md-2">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <h6 className="fw-bold mb-1">{item.name}</h6>
                    <p className="text-muted mb-0">Size: {item.size}</p>
                    <p className="text-success fw-bold mb-0">${item.price.toFixed(2)}</p>
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
                      onClick={() => removeFromCart(item.id, item.size)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-4">
            <Link to="/shop" className="btn btn-outline-primary">
              <i className="fa-solid fa-arrow-left me-2"></i>
              Continue Shopping
            </Link>
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

              {/* Promo Code */}
              <div className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Promo code"
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className="btn btn-success btn-lg w-100 mb-3"
                onClick={handleCheckout}
              >
                <i className="fa-solid fa-credit-card me-2"></i>
                Proceed to Checkout
              </button>

              <div className="text-center">
                <small className="text-muted">
                  <i className="fa-solid fa-shield-halved me-1"></i>
                  Secure checkout powered by Stripe
                </small>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body">
              <h6 className="fw-bold mb-3">We Accept</h6>
              <div className="d-flex gap-2 justify-content-center">
                <i className="fab fa-cc-visa fa-2x text-primary"></i>
                <i className="fab fa-cc-mastercard fa-2x text-warning"></i>
                <i className="fab fa-cc-amex fa-2x text-info"></i>
                <i className="fab fa-cc-paypal fa-2x text-primary"></i>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Shipping Information</h6>
              <ul className="list-unstyled small text-muted">
                <li><i className="fa-solid fa-truck me-2"></i>Free shipping on orders over $200</li>
                <li><i className="fa-solid fa-clock me-2"></i>Standard delivery: 3-5 business days</li>
                <li><i className="fa-solid fa-undo me-2"></i>30-day return policy</li>
                <li><i className="fa-solid fa-shield-halved me-2"></i>100% authentic products</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
