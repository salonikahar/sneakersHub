import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import nike1 from "../../assets/img/slider/nike1.jpg";
import nike2 from "../../assets/img/slider/nike2.jpg";
import nike3 from "../../assets/img/slider/nike3.jpg";
import productsData from "../../data/products.json";
import "../../assets/css/home.css";
import "../../assets/css/style.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides data
  const slides = [
    {
      img: nike1,
      title: "EXCLUSIVE NIKE SNEAKERS",
      text: "STEP INTO STYLE WITH OUR LATEST SNEAKER COLLECTION",
      btn1: { text: "SHOP NOW", link: "/shop", class: "btn btn-dark px-4 py-2" },
      btn2: { text: "CONTACT US", link: "/contact", class: "btn btn-dark text-white px-4 py-2" }
    },
    {
      img: nike2,
      title: "TRENDING SNEAKERS",
      text: "DISCOVER THE HOTTEST DESIGNS OF THE SEASON",
      btn1: { text: "SHOP NOW", link: "/shop", class: "btn btn-dark px-4 py-2" },
      btn2: { text: "CONTACT US", link: "/contact", class: "btn btn-outline-dark px-4 py-2" }
    },
    {
      img: nike3,
      title: "LIMITED EDITION",
      text: "GRAB YOUR EXCLUSIVE PAIR BEFORE THEY SELL OUT",
      btn1: { text: "SHOP NOW", link: "/shop", class: "btn btn-dark px-4 py-2" },
      btn2: { text: "CONTACT US", link: "/contact", class: "btn btn-outline-dark px-4 py-2" }
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const renderProducts = (productList) => {
    return productList.map((product, index) => (
      <div key={product.id || index} className="col-md-3 mb-4">
        <div className="card shadow-sm border-0 h-100">
          <img src={product.img} className="card-img-top" alt={product.name} />
          <div className="card-body text-center">
            <h5 className="card-title fw-bold">{product.name}</h5>
            <p className="card-text text-success fw-semibold">${product.price}</p>
            <Link to={`/product/${product.id}`} className="btn btn-warning fw-bold text-white">Get Yours</Link>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      {/* ✅ React Controlled Slider */}
      <div className="custom-slider">
        <div
          className="slides-wrapper"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div className="slide" key={index}>
              <img src={slide.img} className="d-block w-100 carousel-img" alt={slide.title} />
              <div className="carousel-caption d-flex flex-column justify-content-center h-100">
                <h1 className="fw-bold display-5">{slide.title}</h1>
                <p>{slide.text}</p>
                <div className="mt-3 gap-3 d-flex justify-content-center">
                  <Link to={slide.btn1.link} className={slide.btn1.class}>
                    {slide.btn1.text}
                  </Link>
                  <Link to={slide.btn2.link} className={slide.btn2.class}>
                    {slide.btn2.text}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button className="carousel-control-prev" onClick={prevSlide}>
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" onClick={nextSlide}>
          <span className="carousel-control-next-icon"></span>
        </button>

        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={index === currentSlide ? "active" : ""}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      </div>

      {/* Product Section 1 */}
      <section>
        <div className="container my-5">
          <h6 className="text-center fw-bold mb-4">
            STEP INTO STYLE WITH THE ICONIC AIR JORDAN FOUR COLLECTION
          </h6>
          <div className="row">
            {renderProducts(productsData.slice(0, 4))}
          </div>
        </div>
      </section>

      {/* Parallax Section 1 */}
      <section className="parallax-section parallax-section1 text-white d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1 className="display-4 fw-bold">Step Into Style</h1>
          <p className="lead">With the iconic Air Jordan Four Collection</p>
          <Link to="/shop" className="btn btn-warning btn-lg fw-bold">Shop Now</Link>
        </div>
      </section>

      {/* Product Section 2 */}
      <section>
        <div className="container my-5">
          <h2 className="text-center mb-4">⭐ Best Sellers</h2>
          <div className="row">
            {renderProducts(productsData.slice(4, 8))}
          </div>
        </div>
      </section>

      {/* Parallax Section 2 */}
      <section className="parallax-section parallax-section2 text-white d-flex align-items-center justify-content-center" >
        <div className="text-center">
          <h1 className="display-4 fw-bold">Step Into Style</h1>
          <p className="lead">With the iconic Air Jordan Four Collection</p>
          <Link to="/shop" className="btn btn-warning btn-lg fw-bold">Shop Now</Link>
        </div>
      </section>

      {/* Product Section 3 */}
      <section>
        <div className="container my-5">
          <h2 className="text-center mb-4">⭐ Best Sellers</h2>
          <div className="row">
            {renderProducts(productsData.slice(8, 12))}
          </div>
        </div>
      </section>

      {/* Parallax Section 4 */}
      <section className="parallax-section parallax-section4 text-white d-flex align-items-center justify-content-center" >
        <div className="text-center">
          <h1 className="display-4 fw-bold">Step Into Style</h1>
          <p className="lead">With the iconic Air Jordan Four Collection</p>
          <Link to="/shop" className="btn btn-warning btn-lg fw-bold">Shop Now</Link>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">What Our Customers Say</h2>
          <div className="row g-4">
            {/* Testimonial 1 */}
            <div className="col-md-4">
              <div className="card shadow-lg border-0 rounded-3 p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <img src="/src/assets/img/user/dummy.jpg" alt="User" className="rounded-circle me-3" width="60" height="60" />
                  <div>
                    <h6 className="mb-0 fw-bold">John Doe</h6>
                    <small className="text-muted">Customer</small>
                  </div>
                </div>
                <p className="text-muted">
                  "The service was excellent and the quality is top-notch. I would definitely recommend it to others!"
                </p>
                <div className="text-warning">★★★★☆</div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="col-md-4">
              <div className="card shadow-lg border-0 rounded-3 p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <img src="/src/assets/img/user/dummy.jpg" alt="User" className="rounded-circle me-3" width="60" height="60" />
                  <div>
                    <h6 className="mb-0 fw-bold">Jane Smith</h6>
                    <small className="text-muted">Customer</small>
                  </div>
                </div>
                <p className="text-muted">
                  "Amazing experience! The delivery was super quick and the staff was very supportive."
                </p>
                <div className="text-warning">★★★★★</div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="col-md-4">
              <div className="card shadow-lg border-0 rounded-3 p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <img src="/src/assets/img/user/dummy.jpg" alt="User" className="rounded-circle me-3" width="60" height="60" />
                  <div>
                    <h6 className="mb-0 fw-bold">Michael Lee</h6>
                    <small className="text-muted">Customer</small>
                  </div>
                </div>
                <p className="text-muted">
                  "I love the variety of products. Everything I ordered was exactly as shown. 10/10!"
                </p>
                <div className="text-warning">★★★★☆</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <h2 className="fw-bold">
              Contact <span className="text-primary">Sneakers Hub</span>
            </h2>
            <p className="text-muted">We'd love to hear from you! Reach out with any questions or feedback.</p>
          </div>

          <div className="row g-4">
            {/* Contact Info */}
            <div className="col-lg-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body text-center">
                  <i className="fa-solid fa-location-dot fa-2x text-primary mb-3"></i>
                  <h5 className="fw-bold">Our Store</h5>
                  <p>123 Sneaker Street, Mumbai, India</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body text-center">
                  <i className="fa-solid fa-phone fa-2x text-primary mb-3"></i>
                  <h5 className="fw-bold">Call Us</h5>
                  <p>+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body text-center">
                  <i className="fa-solid fa-envelope fa-2x text-primary mb-3"></i>
                  <h5 className="fw-bold">Email Us</h5>
                  <p>support@sneakershub.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="row mt-5">
            <div className="col-lg-8 mx-auto">
              <div className="card shadow border-0">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4 text-center">Send Us a Message</h4>
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input type="text" className="form-control" placeholder="Your Name" required />
                      </div>
                      <div className="col-md-6">
                        <input type="email" className="form-control" placeholder="Your Email" required />
                      </div>
                    </div>
                    <div className="mb-3">
                      <input type="text" className="form-control" placeholder="Subject" required />
                    </div>
                    <div className="mb-3">
                      <textarea className="form-control" rows="5" placeholder="Your Message" required></textarea>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-dark px-4">
                        Send Message <i className="fa-solid fa-paper-plane ms-2"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
