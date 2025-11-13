import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          console.log('Cart loaded from localStorage:', cartData);
          setCartItems(cartData);
        } else {
          console.log('No cart found in localStorage');
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      }
    };

    loadCart();
    setIsInitialized(true);
  }, []);

  // Listen for user logout event to clear cart
  useEffect(() => {
    const handleUserLogout = () => {
      console.log('User logged out, clearing cart');
      setCartItems([]);
    };

    window.addEventListener('userLoggedOut', handleUserLogout);

    return () => {
      window.removeEventListener('userLoggedOut', handleUserLogout);
    };
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        console.log('Cart saved to localStorage:', cartItems);

        // Dispatch custom event to update navbar cart count
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, isInitialized]);

  const addToCart = (product, size = 'US 8', quantity = 1) => {
    console.log('Adding to cart:', { product, size, quantity });

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.size === size
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update quantity if product with same size already exists
        newItems = prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new product to cart
        const newItem = {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          img: product.img,
          quantity: quantity,
          size: size
        };
        newItems = [...prevItems, newItem];
      }

      console.log('Updated cart items:', newItems);
      return newItems;
    });
  };

  const removeFromCart = (id, size = null) => {
    console.log('Removing from cart:', { id, size });

    setCartItems(prevItems => {
      const newItems = size
        ? prevItems.filter(item => !(item.id === id && item.size === size))
        : prevItems.filter(item => item.id !== id);

      console.log('Cart after removal:', newItems);
      return newItems;
    });
  };

  const updateQuantity = (id, size, newQuantity) => {
    console.log('Updating quantity:', { id, size, newQuantity });

    if (newQuantity < 1) {
      removeFromCart(id, size);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    console.log('Clearing cart');
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartItems = () => {
    return cartItems;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
