// src/services/api/Api.ts
import { CMS_TOKEN, CMS_URL } from '@/utility/config';
import axios from 'axios';
import { showTokenInfo } from '@/utility/tokenHelper';

const BASE_URL = CMS_URL || 'http://localhost:3005/api';

// Show token info on startup
console.log(`Initializing CMS API client with URL: ${BASE_URL}`);
showTokenInfo();

// Create an axios instance
const cmsApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Set a timeout of 10 seconds
});

// Add a flag to prevent showing multiple auth errors
let hasShownAuthError = false;
let consecutiveAuthErrors = 0;
const MAX_AUTH_ERRORS = 3;

// Function to validate token before making requests
const validateToken = (token: string | undefined): boolean => {
  if (!token) {
    console.error('CMS API token is missing');
    return false;
  }
  
  // A very basic format validation for JWT (could be more sophisticated)
  if (token.length < 30) {
    console.error('CMS API token appears to be invalid (too short)');
    return false;
  }
  
  return true;
};

// Axios request interceptor to add auth token
cmsApi.interceptors.request.use(
  async (config: any) => {
    // Get the token - this ensures we always use the latest token value
    const token = CMS_TOKEN;
    
    if (!validateToken(token)) {
      console.warn('Request proceeding with potentially invalid token');
    }

    config.headers = {
      ...config.headers,
      Authorization: token ? `Bearer ${'8d3b1d717d69bcb66cd5c13b26197aa421d19aed8f2a52908571ddd3bfcecffef47897d8a127aa0f668abed0bfc7adbce543b2fd67bd7c672bac2d91b93dcc4e766f3b8de573386acaf50c482e5501b9b36a61a3eeec5d7fad554073bb5bbb83d09dbca8b32c92b3d5b83a6978bd2a1cc3139105a67e50ba4db414cc69c941f6'}` : '',
    };

    // Log the request being made (but not the full token)
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
cmsApi.interceptors.response.use(
  (response) => {
    // Reset auth error counter on successful requests
    consecutiveAuthErrors = 0;
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        consecutiveAuthErrors++;
        
        if (!hasShownAuthError && consecutiveAuthErrors <= MAX_AUTH_ERRORS) {
          hasShownAuthError = true;
          console.error(`Authentication error (${consecutiveAuthErrors}/${MAX_AUTH_ERRORS}): Please check your CMS API token.`);
          console.error('Details:', error.response.data);
          
          // Provide more helpful guidance
          console.info('To fix this issue:');
          console.info('1. Verify your CMS token in the .env file or config');
          console.info('2. Check if the CMS server is running and accessible');
          console.info('3. Ensure your token has not expired');
          
          // Reset the flag after some time to allow showing the error again if needed
          setTimeout(() => {
            hasShownAuthError = false;
          }, 5000);
        }
        
        if (consecutiveAuthErrors > MAX_AUTH_ERRORS) {
          console.error(`Received ${consecutiveAuthErrors} consecutive authentication errors. Requests may be temporarily blocked.`);
        }
      } else {
        // Reset auth error counter for non-auth errors
        consecutiveAuthErrors = 0;
        console.error('API Error:', error.response.status, error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export { cmsApi };