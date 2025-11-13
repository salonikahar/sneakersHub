import React, { createContext, useContext, useState, useEffect } from 'react';
import productsData from '../data/products.json';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Load products from localStorage on mount, fallback to JSON
  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts && JSON.parse(savedProducts).length > 0) {
          const productsData = JSON.parse(savedProducts);
          // Ensure all products have stock and rating fields
          const updatedProducts = productsData.map(product => ({
            ...product,
            stock: product.stock || Math.floor(Math.random() * 50) + 10,
            rating: product.rating || parseFloat((Math.random() * 2 + 3).toFixed(1))
          }));
          setProducts(updatedProducts);
        } else {
          // Load from JSON and save to localStorage
          const updatedProductsData = productsData.map(product => ({
            ...product,
            stock: product.stock || Math.floor(Math.random() * 50) + 10,
            rating: product.rating || parseFloat((Math.random() * 2 + 3).toFixed(1))
          }));
          setProducts(updatedProductsData);
          localStorage.setItem('products', JSON.stringify(updatedProductsData));
        }
      } catch (error) {
        console.error('Error loading products from localStorage:', error);
        const updatedProductsData = productsData.map(product => ({
          ...product,
          stock: product.stock || Math.floor(Math.random() * 50) + 10,
          rating: product.rating || parseFloat((Math.random() * 2 + 3).toFixed(1))
        }));
        setProducts(updatedProductsData);
      }
    };

    loadProducts();
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    try {
      localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }, [products]);

  const addProduct = (productData) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name: productData.name.trim(),
      price: parseFloat(productData.price).toFixed(2),
      img: productData.img.trim(),
      category: productData.category,
      description: productData.description.trim(),
      stock: productData.stock || Math.floor(Math.random() * 50) + 10,
      rating: productData.rating || parseFloat((Math.random() * 2 + 3).toFixed(1)),
      isNew: true, // Mark as new product
      addedDate: new Date().toISOString()
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);
    return newProduct;
  };

  const updateProduct = (productId, updatedData) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, ...updatedData } : product
      )
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
  };

  const getProductsByCategory = (category) => {
    if (category === 'All') return products;
    return products.filter(product => product.category === category);
  };

  const searchProducts = (searchTerm) => {
    if (!searchTerm) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    searchProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
