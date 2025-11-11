import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrdersContext';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: false
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Shipping Information
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    // Payment Information - only validate if credit card is selected
    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create order object
      const order = {
        id: Date.now().toString(),
        user: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email
        },
        items: cartItems,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shipping: calculateShipping(),
        total: calculateTotal(),
        date: new Date().toISOString(),
        status: 'pending',
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod
      };

      // Add order to context
      addOrder(order);

      // Clear cart
      clearCart();

      // Show success toast
      toast.success('Order placed successfully!');

      // Redirect to success page or show success message
      navigate('/order-success', { state: { order } });

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
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
        <div className="col-lg-8">
          <h1 className="fw-bold mb-4">Checkout</h1>

          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="fa-solid fa-truck me-2 text-primary"></i>
                  Shipping Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your street address"
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Enter your state"
                    />
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">ZIP Code *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="Enter your ZIP code"
                    />
                    {errors.zipCode && <div className="invalid-feedback">{errors.zipCode}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="fa-solid fa-credit-card me-2 text-primary"></i>
                  Payment Information
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="credit_card"
                        value="credit_card"
                        checked={formData.paymentMethod === 'credit_card'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="credit_card">
                        <i className="fab fa-cc-visa me-1"></i>
                        <i className="fab fa-cc-mastercard me-1"></i>
                        <i className="fab fa-cc-amex me-1"></i>
                        Credit Card
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="paypal"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="paypal">
                        <i className="fab fa-paypal me-1"></i>
                        PayPal
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cash_on_delivery"
                        value="cash_on_delivery"
                        checked={formData.paymentMethod === 'cash_on_delivery'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="cash_on_delivery">
                        <i className="fa-solid fa-money-bill-wave me-1"></i>
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>

                {formData.paymentMethod === 'credit_card' && (
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Card Number *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Expiry Date *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">CVV *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                      />
                      {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                    </div>
                  </div>
                )}

                <div className="form-check mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="billingAddress"
                    id="billingAddress"
                    checked={formData.billingAddress}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="billingAddress">
                    Billing address is the same as shipping address
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/cart')}
              >
                <i className="fa-solid fa-arrow-left me-2"></i>
                Back to Cart
              </button>
              <button
                type="submit"
                className="btn btn-success flex-fill"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock me-2"></i>
                    Place Order
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm" style={{ position: 'absolute', top: '188px', width: '32%', maxWidth: '350px' }}>
            <div className="card-body">
              <h5 className="fw-bold mb-4">Order Summary</h5>

              {/* Order Items */}
              <div className="mb-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="rounded me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <div className="flex-fill">
                      <h6 className="mb-0 fw-bold">{item.name}</h6>
                      <small className="text-muted">Size: {item.size} | Qty: {item.quantity}</small>
                      <div className="fw-bold text-primary">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-top pt-3">
                <div className="mb-3">
                  <div className="mb-2">
                    <span className="d-block">Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                    <span className="fw-bold">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="mb-2">
                    <span className="d-block">Tax (10%)</span>
                    <span className="fw-bold">${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="mb-3">
                    <span className="d-block">Shipping</span>
                    <span className={`fw-bold ${calculateShipping() === 0 ? 'text-success' : ''}`}>
                      {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                    </span>
                  </div>
                </div>
                <hr />
                <div className="mb-0">
                  <span className="d-block fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-5 text-primary">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Security Note */}
              <div className="mt-4 p-3 bg-light rounded">
                <div className="d-flex align-items-center">
                  <i className="fa-solid fa-shield-halved text-success me-2"></i>
                  <small className="text-muted">
                    Your payment information is secure and encrypted.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
