import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import productsData from '../../data/products.json';
import { useCart } from '../../contexts/CartContext';

const Shop = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [searchParams] = useSearchParams();

  // Load products from JSON file
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Since we're importing JSON directly, we can set it immediately
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Read search query from URL parameter
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Generate categories dynamically from products data
  const categories = ['All', ...new Set(products.map(product => product.category))];

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product);
    addToCart(product, 'US 8', 1);
    alert(`${product.name} added to cart!`);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Sidebar */}
        <aside className="col-md-3 col-12 mb-4">
          <div className="card shadow-sm border-0 p-3">
            <h5 className="fw-bold mb-3">Categories</h5>
            <ul className="list-group list-group-flush">
              {categories.map((category, index) => (
                <li key={index} className="list-group-item">
                  <button
                    className={`text-decoration-none text-dark border-0 bg-transparent ${
                      selectedCategory === category ? 'fw-bold text-primary' : ''
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Filter */}
          <div className="card shadow-sm border-0 p-3 mt-3">
            <h5 className="fw-bold mb-3">Price Range</h5>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="price1" />
              <label className="form-check-label" htmlFor="price1">
                Under $100
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="price2" />
              <label className="form-check-label" htmlFor="price2">
                $100 - $200
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="price3" />
              <label className="form-check-label" htmlFor="price3">
                $200 - $300
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="price4" />
              <label className="form-check-label" htmlFor="price4">
                Over $300
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="col-md-9 col-12">
          {/* Search and Sort */}
          <div className="row mb-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <select className="form-select">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name: A to Z</option>
                <option>Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3">
            <p className="text-muted">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
          </div>

          {/* Products Grid */}
          <div className="row g-4">
            {currentProducts.map((product, index) => (
              <div key={product.id || index} className="col-lg-3 col-md-4 col-sm-6">
                <div className="card product-card shadow-sm border-0 h-100">
                  <img src={product.img} className="card-img-top product-img" alt={product.name} />
                  <div className="card-body text-center">
                    <h6 className="card-title fw-bold">{product.name}</h6>
                    <p className="card-text text-success fw-semibold">${product.price}</p>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-warning fw-bold text-white"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <Link to={`/product/${product.id}`} className="btn btn-outline-dark">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-5">
              <h4 className="text-muted">No products found</h4>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
