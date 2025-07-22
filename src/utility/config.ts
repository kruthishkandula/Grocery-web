export const CMS_URL = process.env.REACT_APP_CMS_URL || 'http://localhost:3005/api';
export const NODE_URL = process.env.REACT_APP_NODE_URL || 'http://localhost:3000/api';

// The readonly token from tokens.txt file
const FALLBACK_TOKEN = '8d3b1d717d69bcb66cd5c13b26197aa421d19aed8f2a52908571ddd3bfcecffef47897d8a127aa0f668abed0bfc7adbce543b2fd67bd7c672bac2d91b93dcc4e766f3b8de573386acaf50c482e5501b9b36a61a3eeec5d7fad554073bb5bbb83d09dbca8b32c92b3d5b83a6978bd2a1cc3139105a67e50ba4db414cc69c941f6';

export const CMS_TOKEN = process.env.REACT_APP_CMS_TOKEN || FALLBACK_TOKEN;
export const SPLASH_SCREEN_TIMEOUT = 200;

// Log a warning if CMS token is using fallback
if (!process.env.REACT_APP_CMS_TOKEN) {
    console.warn('REACT_APP_CMS_TOKEN is not set in environment. Using fallback token from tokens.txt file.');
}

export const APP_NAME = "GroceryPlus";
export const APP_VERSION = "1.0.0.000";
export const APP_OPCO = process.env.REACT_APP_APP_OPCO || "INDIA"; 

export const persistor_list = ['categories', 'products', 'banners']