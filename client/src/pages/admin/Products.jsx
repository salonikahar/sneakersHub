import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AddProductModal from '../../components/admin/AddProductModal';
import { useProducts } from '../../contexts/ProductsContext';

const Products = () => {
  const { products, addProduct, deleteProduct } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const categories = ['All', 'Jordan', 'Nike', 'Adidas'];

  useEffect(() => {
    // Load products from context
    setFilteredProducts(products);
    setLoading(false);
  }, [products]);

  useEffect(() => {
    // Filter products based on search term and category
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, selectedCategory, products]);

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // In a real app, this would make an API call
      // For now, we'll just show an alert
      alert('Product deletion would be implemented with backend API');
    }
  };

  const handleEdit = (product) => {
    // In a real app, this would open an edit modal
    alert('Product editing would be implemented with backend API');
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Products Management</h2>
          <div className="d-flex gap-2">
            <button className="btn btn-success">
              <i className="fas fa-download me-2"></i>
              Export Products
            </button>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus me-2"></i>
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products by name, description, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary">
                    <i className="fas fa-filter"></i>search
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                  >
                    <i className="fas fa-eraser"></i>clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Statistics */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Total Products</h5>
                <h3>{products.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Jordan</h5>
                <h3>{products.filter(p => p.category === 'Jordan').length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">Nike</h5>
                <h3>{products.filter(p => p.category === 'Nike').length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">Adidas</h5>
                <h3>{products.filter(p => p.category === 'Adidas').length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.img}
                          alt={product.name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          className="rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                          }}
                        />
                      </td>
                      <td>
                        <div>
                          <strong>{product.name}</strong>
                          <br />
                          <small className="text-muted">ID: {product.id}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge bg-${product.category === 'Jordan' ? 'danger' : product.category === 'Nike' ? 'primary' : 'success'}`}>
                          {product.category}
                        </span>
                      </td>
                      <td>
                        <strong className="text-success">${formatPrice(product.price)}</strong>
                      </td>
                      <td>
                        <small className="text-muted">
                          {product.description.length > 50
                            ? product.description.substring(0, 50) + '...'
                            : product.description
                          }
                        </small>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(product)}
                            title="Edit Product"
                          >
                            <i className="fas fa-edit"></i>Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(product.id)}
                            title="Delete Product"
                          >
                            <i className="fas fa-trash"></i>Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div>
                  <small className="text-muted">
                    Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                  </small>
                </div>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h6 className="card-title">Quick Actions</h6>
            <div className="row g-3">
              <div className="col-md-3">
                <button className="btn btn-outline-primary w-100">
                  <i className="fas fa-sync-alt me-2"></i>
                  Refresh Products
                </button>
              </div>
              <div className="col-md-3">
                <button className="btn btn-outline-success w-100">
                  <i className="fas fa-upload me-2"></i>
                  Import Products
                </button>
              </div>
              <div className="col-md-3">
                <button className="btn btn-outline-info w-100">
                  <i className="fas fa-chart-bar me-2"></i>
                  View Analytics
                </button>
              </div>
              <div className="col-md-3">
                <button className="btn btn-outline-warning w-100">
                  <i className="fas fa-cog me-2"></i>
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onProductAdded={(newProduct) => {
            addProduct(newProduct);
            setShowModal(false);
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default Products;
