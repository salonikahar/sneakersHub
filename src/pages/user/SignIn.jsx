import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Get the page user was trying to access before login
  const from = location.state?.from || '/';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation (only for signup)
    if (!isLogin && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // First name validation (only for signup)
    if (!isLogin && !formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation (only for signup)
    if (!isLogin && !formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isLogin) {
        // Handle login
        console.log('Login:', { email: formData.email, password: formData.password, rememberMe: formData.rememberMe });

        // Use AuthContext login method
        const userData = {
          email: formData.email,
          name: 'User',
          rememberMe: formData.rememberMe
        };

        login(userData);
        alert('Login successful! Welcome back to SneakersHub!');

        // Redirect to the page user was trying to access or home
        navigate(from, { replace: true });
      } else {
        // Handle registration
        console.log('Register:', formData);

        // Use AuthContext signup method
        const userData = {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName
        };

        signup(userData);
        alert('Registration successful! Welcome to SneakersHub!');

        // Redirect to the page user was trying to access or home
        navigate(from, { replace: true });
      }
    } catch (error) {
      alert(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login is not implemented yet. Please use email login.`);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-6">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="fa-solid fa-shoe-prints fa-3x text-primary"></i>
                </div>
                <h2 className="fw-bold text-dark">Welcome to SneakersHub</h2>
                <p className="text-muted">
                  {isLogin ? 'Sign in to your account' : 'Create your account'}
                </p>
              </div>

              {/* Toggle Buttons */}
              <div className="row mb-4">
                <div className="col-6">
                  <button
                    className={`btn w-100 py-2 ${isLogin ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setIsLogin(true)}
                    disabled={isLoading}
                  >
                    Sign In
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className={`btn w-100 py-2 ${!isLogin ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setIsLogin(false)}
                    disabled={isLoading}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="firstName" className="form-label fw-bold">First Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lastName" className="form-label fw-bold">Last Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">Email Address *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Enter your email"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">Password *</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Enter your password"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                {!isLogin && (
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label fw-bold">Confirm Password *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>
                )}

                {isLogin && (
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="#" className="text-decoration-none text-primary">Forgot password?</Link>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-lg mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    <>
                      <i className={`fa-solid ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'} me-2`}></i>
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="text-center my-4">
                <span className="bg-white px-3 text-muted">or continue with</span>
                <hr className="mt-n3" />
              </div>

              {/* Social Login */}
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => handleSocialLogin('Google')}
                    disabled={isLoading}
                  >
                    <i className="fab fa-google me-2"></i>
                    Google
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleSocialLogin('Facebook')}
                    disabled={isLoading}
                  >
                    <i className="fab fa-facebook-f me-2"></i>
                    Facebook
                  </button>
                </div>
              </div>

              {/* Terms */}
              {!isLogin && (
                <div className="text-center mb-3">
                  <small className="text-muted">
                    By creating an account, you agree to our{' '}
                    <Link to="#" className="text-decoration-none text-primary">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="#" className="text-decoration-none text-primary">Privacy Policy</Link>
                  </small>
                </div>
              )}

              {/* Footer */}
              <div className="text-center">
                <p className="text-muted mb-0">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    className="text-decoration-none border-0 bg-transparent text-primary fw-bold"
                    onClick={() => setIsLogin(!isLogin)}
                    disabled={isLoading}
                  >
                    {isLogin ? 'Sign up here' : 'Sign in here'}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="card border-0 shadow mt-4">
            <div className="card-body text-center">
              <h6 className="fw-bold mb-3 text-primary">Why Join SneakersHub?</h6>
              <div className="row g-3">
                <div className="col-4">
                  <div className="text-center">
                    <i className="fa-solid fa-heart fa-2x text-danger mb-2"></i>
                    <p className="small text-muted mb-0">Save Favorites</p>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center">
                    <i className="fa-solid fa-truck fa-2x text-primary mb-2"></i>
                    <p className="small text-muted mb-0">Track Orders</p>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center">
                    <i className="fa-solid fa-gift fa-2x text-warning mb-2"></i>
                    <p className="small text-muted mb-0">Exclusive Deals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="alert alert-info mt-3 border-0 shadow-sm">
            <div className="d-flex align-items-center">
              <i className="fa-solid fa-shield-alt fa-2x text-info me-3"></i>
              <div>
                <h6 className="fw-bold mb-1">Secure & Protected</h6>
                <small className="text-muted">
                  Your personal information is encrypted and secure with us.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
