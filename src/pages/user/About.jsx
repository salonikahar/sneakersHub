import React from 'react';

const About = () => {
  return (
    <div className="container my-5">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="display-4 fw-bold mb-4">About SneakersHub</h1>
          <p className="lead text-muted">
            Your premier destination for the latest and greatest sneakers from around the world.
            We're passionate about bringing you the most exclusive and stylish footwear.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="row mb-5">
        <div className="col-lg-6">
          <h2 className="fw-bold mb-4">Our Mission</h2>
          <p className="text-muted">
            At SneakersHub, we believe that everyone deserves to step into style. Our mission is to provide
            premium sneakers that not only look great but also feel amazing on your feet. We curate the best
            collection of sneakers from top brands worldwide, ensuring quality, authenticity, and the latest trends.
          </p>
          <p className="text-muted">
            Whether you're a sneaker enthusiast, a fashion-forward individual, or someone looking for comfort
            and style, we have something for everyone. Our commitment to customer satisfaction and product
            quality sets us apart in the industry.
          </p>
        </div>
        <div className="col-lg-6">
          <img
            src="/src/assets/img/aboutUs/mission-sneakers.jpg"
            alt="Our Mission"
            className="img-fluid rounded shadow"
            style={{ height: '300px', objectFit: 'cover', width: '100%' }}
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="fw-bold text-center mb-5">Our Values</h2>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fa-solid fa-star fa-3x text-warning mb-3"></i>
              <h5 className="fw-bold">Quality</h5>
              <p className="text-muted">
                We never compromise on quality. Every product in our collection meets the highest standards
                of excellence and durability.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fa-solid fa-heart fa-3x text-danger mb-3"></i>
              <h5 className="fw-bold">Authenticity</h5>
              <p className="text-muted">
                All our sneakers are 100% authentic. We work directly with authorized dealers and brands
                to ensure you get the real deal.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <i className="fa-solid fa-users fa-3x text-primary mb-3"></i>
              <h5 className="fw-bold">Community</h5>
              <p className="text-muted">
                We're more than just a store - we're a community of sneaker lovers who share the same
                passion for style and comfort.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="row mb-5">
        <div className="col-lg-6 order-lg-2">
          <h2 className="fw-bold mb-4">Our Story</h2>
          <p className="text-muted">
            Founded in 2020, SneakersHub started as a small passion project by a group of sneaker enthusiasts
            who wanted to create a better shopping experience for fellow sneaker lovers. What began as a
            local store has now grown into one of the most trusted names in the sneaker industry.
          </p>
          <p className="text-muted">
            Over the years, we've expanded our collection to include the latest releases from Nike, Adidas,
            Jordan, and many other premium brands. Our team of experts carefully selects each product,
            ensuring that we only offer the best to our customers.
          </p>
          <p className="text-muted">
            Today, we serve customers worldwide, providing them with access to exclusive sneakers and
            exceptional customer service. Our journey continues as we strive to be the ultimate destination
            for sneaker enthusiasts everywhere.
          </p>
        </div>
        <div className="col-lg-6 order-lg-1">
          <img
            src="/src/assets/img/aboutUs/story-sneakers.jpg"
            alt="Our Story"
            className="img-fluid rounded shadow"
            style={{ height: '400px', objectFit: 'cover', width: '100%' }}
          />
        </div>
      </div>

      {/* Team Section */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="fw-bold text-center mb-5">Meet Our Team</h2>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm text-center">
            <img
              src="/src/assets/img/aboutUs/team-member1.jpg"
              className="card-img-top rounded-circle mx-auto mt-3"
              alt="John Doe - Founder & CEO"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <h5 className="fw-bold">John Doe</h5>
              <p className="text-muted">Founder & CEO</p>
              <p className="small text-muted">
                Passionate about sneakers and committed to bringing the best products to our customers.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm text-center">
            <img
              src="/src/assets/img/aboutUs/team-member2.jpg"
              className="card-img-top rounded-circle mx-auto mt-3"
              alt="Jane Smith - Head of Operations"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <h5 className="fw-bold">Jane Smith</h5>
              <p className="text-muted">Head of Operations</p>
              <p className="small text-muted">
                Ensures smooth operations and maintains our high standards of service quality.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm text-center">
            <img
              src="/src/assets/img/aboutUs/team-member3.jpg"
              className="card-img-top rounded-circle mx-auto mt-3"
              alt="Mike Johnson - Product Curator"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <h5 className="fw-bold">Mike Johnson</h5>
              <p className="text-muted">Product Curator</p>
              <p className="small text-muted">
                Expert in sneaker trends and responsible for selecting our premium collection.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm text-center">
            <img
              src="/src/assets/img/aboutUs/team-member4.jpg"
              className="card-img-top rounded-circle mx-auto mt-3"
              alt="Sarah Wilson - Customer Experience"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <h5 className="fw-bold">Sarah Wilson</h5>
              <p className="text-muted">Customer Experience</p>
              <p className="small text-muted">
                Dedicated to providing exceptional customer service and support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="bg-light rounded p-5">
            <div className="row text-center">
              <div className="col-md-3 mb-3">
                <h2 className="fw-bold text-primary">10K+</h2>
                <p className="text-muted">Happy Customers</p>
              </div>
              <div className="col-md-3 mb-3">
                <h2 className="fw-bold text-primary">500+</h2>
                <p className="text-muted">Products</p>
              </div>
              <div className="col-md-3 mb-3">
                <h2 className="fw-bold text-primary">50+</h2>
                <p className="text-muted">Brands</p>
              </div>
              <div className="col-md-3 mb-3">
                <h2 className="fw-bold text-primary">24/7</h2>
                <p className="text-muted">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
