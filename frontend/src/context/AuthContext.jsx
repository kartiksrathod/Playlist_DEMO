import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const AuthContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch current user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API}/auth/me`);
          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Invalid token
            logout();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Register new user
   */
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API}/auth/register`, {
        name,
        email,
        password
      });

      if (response.data.success) {
        toast.success(response.data.message);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Login user
   */
  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password,
        rememberMe
      });

      if (response.data.success) {
        const { token: authToken, user: userData } = response.data;
        
        // Store token
        localStorage.setItem('authToken', authToken);
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);

        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        toast.success('Login successful!');
        return { success: true, user: userData };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      const needsVerification = error.response?.data?.needsVerification;
      
      if (needsVerification) {
        toast.error('Please verify your email before logging in');
      } else {
        toast.error(message);
      }
      
      return { success: false, message, needsVerification };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('authToken');
      localStorage.removeItem('rememberMe');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      delete axios.defaults.headers.common['Authorization'];
      toast.success('Logged out successfully');
    }
  };

  /**
   * Request password reset
   */
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${API}/auth/forgot-password`, { email });
      
      if (response.data.success) {
        toast.success(response.data.message);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Reset password with token
   */
  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post(`${API}/auth/reset-password/${token}`, { password });
      
      if (response.data.success) {
        toast.success(response.data.message);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Verify email with token
   */
  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`${API}/auth/verify-email/${token}`);
      
      if (response.data.success) {
        toast.success(response.data.message);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Resend verification email
   */
  const resendVerification = async (email) => {
    try {
      const response = await axios.post(`${API}/auth/resend-verification`, { email });
      
      if (response.data.success) {
        toast.success(response.data.message);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend verification';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      if (response.data.success) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
