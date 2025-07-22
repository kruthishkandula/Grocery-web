// src/services/api/Api.ts
import { showAlert } from '@/store/alert/alerts';
import { updateLogin } from '@/store/auth/session';
import { NODE_URL } from '@/utility/config';
import axios from 'axios';

const BASE_URL = NODE_URL + '/api';

// Check if we're in a production environment
const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');

// Create an axios instance with proper CORS config
const nodeApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // This is required for CORS with credentials
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor
nodeApi.interceptors.request.use(
  async (config: any) => {
    console.log('URL:', config.baseURL + config.url);
    console.log('Body :', config?.data);

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Skip CSRF token for login endpoint
    const isLoginEndpoint = config.url && (
      config.url === '/auth/login' ||
      config.url.endsWith('/auth/login')
    );

    // Add CSRF token if available and not login endpoint
    if (!isLoginEndpoint) {
      // Get CSRF token from localStorage first
      let csrfToken = localStorage.getItem('csrfToken');

      // If not in localStorage, try to get from cookie as fallback
      if (!csrfToken) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith('XSRF-TOKEN=')) {
            csrfToken = cookie.substring('XSRF-TOKEN='.length);
            break;
          }
        }
      }

      if (csrfToken) {
        console.log('Adding CSRF token to request:', config.url);
        config.headers['X-CSRF-TOKEN'] = csrfToken;
      } else {
        console.warn('⚠️ No CSRF token available for request:', config.url);
        // If token is missing and we're not on login, this might cause a 403
        // We'll let the request proceed and handle the error in the response interceptor
      }
    } else {
      console.log('Skipping CSRF token for login endpoint');
      // Ensure no CSRF token is sent for login
      delete config.headers['X-CSRF-TOKEN'];
    }

    return config;
  },
  (error) => {
    console.log('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
nodeApi.interceptors.response.use(
  async (response: any) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.log('Response error:', error);
    console.log('Error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      config: error.config,
      response: error.response?.data
    });

    // Handle authentication errors
    const originalRequest = error.config;
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if this was a CSRF token validation failure
      if ((error.response.status === 403 &&
        error.response.data?.message?.includes('CSRF')) || error.response.status === 401) {
        console.error('CSRF validation failed:', error.response.data?.message);

        // If CSRF validation fails, we might need to refresh the token or re-login
        // For now, we'll just notify and redirect to login

        // Clear session data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('csrfToken');
        localStorage.removeItem('sessionExpiry');

        // Update login state
        updateLogin(false);

        // Redirect to login
        window.location.href = '/login';
        showAlert({
          title: 'Session Expired',
          message: 'Your session has expired. Please log in again.',
          type: 'error',
          duration: 5000,
        });
        return Promise.reject(error);
      }

      // Check if this was a token expiration
      if (error.response.data?.message?.includes('expired') ||
        error.response.data?.message?.includes('invalid') ||
        error.response.data?.message?.includes('token')) {

        // Clear user session
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('csrfToken');
        localStorage.removeItem('sessionExpiry');

        // Update login state
        updateLogin(false);
        console.error('Unauthorized access - redirecting to login');

        // Redirect to login page
        window.location.href = '/login';
        showAlert({
          title: 'Session Expired',
          message: 'Your session has expired. Please log in again.',
          type: 'error',
          duration: 5000,
        });
      }
    }

    return Promise.reject(error);
  }
);

export default nodeApi;