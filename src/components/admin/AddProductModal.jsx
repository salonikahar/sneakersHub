import React, { useState } from 'react';

const AddProductModal = ({ show, onHide, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    img: '',
    category: 'Jordan',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = ['Jordan', 'Nike', 'Adidas'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.img.trim()) {
      newErrors.img = 'Image path is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Get existing products
      const response = await fetch('/src/data/products.json');
      const existingProducts = await response.json();

      // Generate new ID
      const newId = Math.max(...existingProducts.map(p => p.id)) + 1;

      // Create new product
      const newProduct = {
        id: newId,
        name: formData.name.trim(),
        price: parseFloat(formData.price).toFixed(2),
        img: formData.img.trim(),
        category: formData.category,
        description: formData.description.trim()
      };

      // Add to products array
      const updatedProducts = [...existingProducts, newProduct];

      // Save to file (in a real app, this would be an API call)
      // For now, we'll simulate the update
      console.log('New product to be added:', newProduct);
      console.log('Updated products array:', updatedProducts);

      // Show success message
      alert('Product added successfully! (Note: In a real application, this would save to the server)');

      // Reset form
      setFormData({
        name: '',
        price: '',
        img: '',
        category: 'Jordan',
        description: ''
      });

      // Notify parent component
      if (onProductAdded) {
        onProductAdded(newProduct);
      }

      // Close modal
      onHide();

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      price: '',
      img: '',
      category: 'Jordan',
      description: ''
    });
    setErrors({});
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-plus me-2"></i>
              Add New Product
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="price" className="form-label">
                    Price *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="img" className="form-label">
                    Image Path *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.img ? 'is-invalid' : ''}`}
                    id="img"
                    name="img"
                    value={formData.img}
                    onChange={handleChange}
                    placeholder="/product/your-image.jpg"
                  />
                  {errors.img && <div className="invalid-feedback">{errors.img}</div>}
                  <small className="form-text text-muted">
                    Enter the path relative to public folder (e.g., /product/nike-air.jpg)
                  </small>
                </div>

                <div className="col-12">
                  <label htmlFor="description" className="form-label">
                    Description *
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                  ></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                <i className="fas fa-times me-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
