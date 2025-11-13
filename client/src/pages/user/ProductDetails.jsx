import React, { useState, useLayoutEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductsContext';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);

  // Scroll to top when component mounts
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Find the product by ID
  const product = products.find(p => p.id === parseInt(id));

  // If product not found, show error
  if (!product) {
  return (
    <div id="product-details-top" className="container-fluid mt-4">
        <div className="row">
          <div className="col-12 text-center py-5">
            <h2 className="text-danger mb-4">Product Not Found</h2>
            <p className="text-muted mb-4">The product you're looking for doesn't exist.</p>
            <Link to="/shop" className="btn btn-primary">
              <i className="fa fa-arrow-left me-2"></i>
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (newQuantity) => {
    const clampedQuantity = Math.max(1, Math.min(10, newQuantity));
    setQuantity(clampedQuantity);
  };

  const handleIncrement = () => {
    setQuantity(prev => Math.min(10, prev + 1));
  };

  const handleDecrement = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    // Get selected size
    const sizeInputs = document.querySelectorAll('input[name="size"]:checked');
    const selectedSize = sizeInputs.length > 0 ? sizeInputs[0].id.replace('size-', 'US ') : 'US 8';

    // Use state quantity instead of DOM reading
    addToCart(product, selectedSize, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Breadcrumb */}
        <div className="col-12 mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/shop">Shop</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>

        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="row g-0">
                {/* Product Image */}
                <div className="col-lg-6">
                  <div className="position-relative">
                    <img
                      src={product.img}
                      className="img-fluid w-100 h-100 object-fit-cover"
                      alt={product.name}
                      style={{ minHeight: '500px' }}
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="col-lg-6">
                  <div className="p-5">
                    <h1 className="fw-bold mb-3">
                      {product.name}
                      {product.isNew && (
                        <span className="badge bg-success ms-2">NEW</span>
                      )}
                    </h1>

                    {/* Rating */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <div className="text-warning me-2">
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star-half-alt"></i>
                        </div>
                        <span className="text-muted">(4.5) • 128 reviews</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <h2 className="text-success fw-bold mb-2">${product.price}</h2>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <h5 className="fw-bold mb-2">Description</h5>
                      <p className="text-muted">
                        {product.description || `${product.name} - Premium quality sneakers perfect for casual wear and sports activities. Made with high-quality materials for maximum comfort and durability.`}
                      </p>
                    </div>

                    {/* Product Details */}
                    <div className="row mb-4">
                      <div className="col-sm-6">
                        <h6 className="fw-bold">Category</h6>
                        <p className="text-muted">{product.category}</p>
                      </div>
                      <div className="col-sm-6">
                        <h6 className="fw-bold">Brand</h6>
                        <p className="text-muted">{product.brand || 'SneakersHub'}</p>
                      </div>
                      <div className="col-sm-6">
                        <h6 className="fw-bold">SKU</h6>
                        <p className="text-muted">{product.sku || `SH-${product.id}`}</p>
                      </div>
                      <div className="col-sm-6">
                        <h6 className="fw-bold">Availability</h6>
                        <p className="text-success fw-bold">
                          <i className="fa fa-check-circle me-1"></i>
                          In Stock
                        </p>
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-2">Size</h6>
                      <div className="btn-group" role="group">
                        {['6', '7', '8', '9', '10', '11', '12'].map((size) => (
                          <React.Fragment key={size}>
                            <input
                              type="radio"
                              className="btn-check"
                              name="size"
                              id={`size-${size}`}
                              autoComplete="off"
                            />
                            <label className="btn btn-outline-dark btn-sm" htmlFor={`size-${size}`}>
                              {size}
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-2">Quantity</h6>
                      <div
                        className="input-group d-flex align-items-center justify-content-center"
                        style={{
                          width: "160px",
                        }}
                      >
                        <button
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={handleDecrement}
                          disabled={quantity <= 1}
                          style={{
                            width: "50px",
                            height: "45px",
                            fontSize: "20px",
                            fontWeight: "500",
                            borderRadius: "6px 0 0 6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <i className="fa fa-minus"></i>
                        </button>

                        <input
                          type="number"
                          className="form-control text-center"
                          value={quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              if (value < 1) setQuantity(1);
                              else if (value > 10) setQuantity(10);
                              else setQuantity(value);
                            } else {
                              setQuantity(1);
                            }
                          }}
                          min="1"
                          max="10"
                          style={{
                            width: "60px",
                            height: "45px",
                            color: "#000",
                            fontWeight: "600",
                            fontSize: "17px",
                            textAlign: "center",
                            backgroundColor: "#fff",
                            borderTop: "1px solid #ced4da",
                            borderBottom: "1px solid #ced4da",
                            borderLeft: "none",
                            borderRight: "none",
                            boxShadow: "none",
                            outline: "none",
                          }}
                        />

                        <button
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={handleIncrement}
                          disabled={quantity >= 10}
                          style={{
                            width: "50px",
                            height: "45px",
                            fontSize: "20px",
                            fontWeight: "500",
                            borderRadius: "0 6px 6px 0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <i className="fa fa-plus"></i>
                        </button>
                      </div>
                    </div>



                    {/* Action Buttons */}
                    <div className="d-grid gap-3">
                      <button
                        className="btn btn-warning fw-bold text-white py-3"
                        onClick={handleAddToCart}
                      >
                        <i className="fa fa-shopping-cart me-2"></i>
                        Add to Cart
                      </button>
                      <button className="btn btn-outline-dark py-3">
                        <i className="fa fa-heart me-2"></i>
                        Add to Wishlist
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-top">
                      <div className="row">
                        <div className="col-6">
                          <div className="d-flex align-items-center text-success">
                            <i className="fa fa-truck fa-2x me-3"></i>
                            <div>
                              <h6 className="fw-bold mb-0">Free Shipping</h6>
                              <small className="text-muted">On orders over $50</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center text-success">
                            <i className="fa fa-undo fa-2x me-3"></i>
                            <div>
                              <h6 className="fw-bold mb-0">Easy Returns</h6>
                              <small className="text-muted">30-day return policy</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-5">
            <h3 className="fw-bold mb-4">Related Products</h3>
            <div className="row g-4">
              {products
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <div key={relatedProduct.id} className="col-lg-3 col-md-6">
                    <div className="card product-card shadow-sm border-0 h-100">
                      <img
                        src={relatedProduct.img}
                        className="card-img-top product-img"
                        alt={relatedProduct.name}
                      />
                      <div className="card-body text-center">
                        <h6 className="card-title fw-bold">{relatedProduct.name}</h6>
                        <p className="card-text text-success fw-semibold">
                          ${relatedProduct.price}
                        </p>
                        <Link
                          to={`/product/${relatedProduct.id}`}
                          className="btn btn-outline-dark btn-sm"
                        >
                          View Details
                        </Link>
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
};

export default ProductDetails;
