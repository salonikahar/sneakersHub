import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import ordersData from '../data/orders.json';

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  // Load orders from localStorage on mount, fallback to JSON
  useEffect(() => {
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders && JSON.parse(savedOrders).length > 0) {
          const ordersData = JSON.parse(savedOrders);
          // Ensure all orders have consistent data structure
          const updatedOrders = ordersData.map(order => ({
            ...order,
            totalPrice: order.totalPrice || order.total || 0,
            createdAt: order.createdAt || new Date().toISOString(),
            status: order.status || 'pending'
          }));
          setOrders(updatedOrders);
        } else {
          // Load from JSON and save to localStorage
          const updatedOrdersData = ordersData.map(order => ({
            ...order,
            totalPrice: order.totalPrice || order.total || 0,
            createdAt: order.createdAt || new Date().toISOString(),
            status: order.status || 'pending'
          }));
          setOrders(updatedOrdersData);
          localStorage.setItem('orders', JSON.stringify(updatedOrdersData));
        }
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
        const updatedOrdersData = ordersData.map(order => ({
          ...order,
          totalPrice: order.totalPrice || order.total || 0,
          createdAt: order.createdAt || new Date().toISOString(),
          status: order.status || 'pending'
        }));
        setOrders(updatedOrdersData);
      }
    };

    loadOrders();
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    try {
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  }, [orders]);

  const addOrder = (orderData) => {
    const newOrder = {
      _id: orderData.id,
      user: orderData.user,
      totalPrice: orderData.total,
      status: orderData.status,
      items: orderData.items,
      createdAt: orderData.date,
      itemsPrice: orderData.subtotal,
      taxPrice: orderData.tax,
      shippingPrice: orderData.shipping,
      orderItems: orderData.items // For modal display
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter(order => order.user?.email === user.email);
  };

  const getAllOrders = () => {
    return orders;
  };

  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    getUserOrders,
    getAllOrders
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};
