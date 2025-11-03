import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Check if user is registered before allowing login
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const isRegistered = registeredUsers.find(u => u.email === userData.email);

    if (!isRegistered) {
      throw new Error('Please register first before logging in');
    }

    const userWithLoginTime = {
      ...userData,
      isLoggedIn: true,
      loginTime: new Date().toISOString()
    };

    setUser(userWithLoginTime);
    localStorage.setItem('user', JSON.stringify(userWithLoginTime));
  };

  const signup = (userData) => {
    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = registeredUsers.find(u => u.email === userData.email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user with registration timestamp
    const newUser = {
      ...userData,
      signupTime: new Date().toISOString(),
      isLoggedIn: false
    };

    // Add to registered users list
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Set as current user
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return user !== null && user.isLoggedIn;
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
