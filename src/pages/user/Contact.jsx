import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container my-5">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
          <p className="lead text-muted">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="row mb-5">
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fa-solid fa-location-dot fa-3x text-primary mb-3"></i>
              <h5 className="fw-bold">Our Store</h5>
              <p className="text-muted mb-0">123 Sneaker Street</p>
              <p className="text-muted mb-0">Mumbai, Maharashtra 400001</p>
              <p className="text-muted">India</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fa-solid fa-phone fa-3x text-primary mb-3"></i>
              <h5 className="fw-bold">Call Us</h5>
              <p className="text-muted mb-0">+91 98765 43210</p>
              <p className="text-muted mb-0">+91 98765 43211</p>
              <p className="text-muted">Mon-Fri: 9AM-6PM</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fa-solid fa-envelope fa-3x text-primary mb-3"></i>
              <h5 className="fw-bold">Email Us</h5>
              <p className="text-muted mb-0">support@sneakershub.com</p>
              <p className="text-muted mb-0">sales@sneakershub.com</p>
              <p className="text-muted">We reply within 24 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form and Map */}
      <div className="row">
        {/* Contact Form */}
        <div className="col-lg-8 mb-5">
          <div className="card border-0 shadow">
            <div className="card-body p-5">
              <h3 className="fw-bold mb-4">Send Us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label fw-bold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label fw-bold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label fw-bold">Subject *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="form-label fw-bold">Message *</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-lg px-4">
                  Send Message <i className="fa-solid fa-paper-plane ms-2"></i>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map and Additional Info */}
        <div className="col-lg-4">
          {/* Map Placeholder */}
          <div className="card border-0 shadow mb-4">
            <div className="card-body p-0">
              <div
                className="bg-light d-flex align-items-center justify-content-center"
                style={{ height: '200px' }}
              >
                <div className="text-center">
                  <i className="fa-solid fa-map fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Interactive Map</p>
                  <p className="small text-muted">123 Sneaker Street, Mumbai</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="card border-0 shadow mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Business Hours</h5>
              <div className="row">
                <div className="col-6">
                  <p className="mb-1"><strong>Monday - Friday</strong></p>
                  <p className="mb-1"><strong>Saturday</strong></p>
                  <p className="mb-1"><strong>Sunday</strong></p>
                </div>
                <div className="col-6">
                  <p className="mb-1 text-muted">9:00 AM - 6:00 PM</p>
                  <p className="mb-1 text-muted">10:00 AM - 4:00 PM</p>
                  <p className="mb-1 text-muted">Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="card border-0 shadow">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Follow Us</h5>
              <div className="d-flex gap-3">
                <a href="https://facebook.com" className="text-decoration-none">
                  <i className="fab fa-facebook-f fa-2x text-primary"></i>
                </a>
                <a href="https://twitter.com" className="text-decoration-none">
                  <i className="fab fa-twitter fa-2x text-info"></i>
                </a>
                <a href="https://instagram.com" className="text-decoration-none">
                  <i className="fab fa-instagram fa-2x text-danger"></i>
                </a>
                <a href="https://youtube.com" className="text-decoration-none">
                  <i className="fab fa-youtube fa-2x text-danger"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="fw-bold text-center mb-5">Frequently Asked Questions</h3>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold">How can I track my order?</h6>
              <p className="text-muted">
                Once your order ships, you'll receive a tracking number via email. You can also track your order
                through your account dashboard.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold">What is your return policy?</h6>
              <p className="text-muted">
                We offer a 30-day return policy for unworn items in original packaging. Returns are free for
                orders over $100.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold">Do you ship internationally?</h6>
              <p className="text-muted">
                Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold">Are your products authentic?</h6>
              <p className="text-muted">
                Absolutely! All our products are 100% authentic. We work directly with authorized dealers
                and brands to ensure authenticity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
