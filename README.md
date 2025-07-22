# GroceryPlus Admin Portal

This is the admin portal for the GroceryPlus application, providing management capabilities for products, categories, orders, and more.

## Features

- **Products Management**: Create, view, edit, and delete products
- **Categories Management**: Create, view, edit, and delete categories
- **Theme Support**: Light and dark mode
- **Error Handling**: Comprehensive error handling for API failures
- **Responsive Design**: Mobile-friendly interface

## Prerequisites

- Node.js v14.0.0 or later
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Navigate to the adminportal directory: `cd adminportal`
3. Install dependencies: `npm install` or `yarn install`
4. Create a `.env` file (see Configuration section)
5. Start the development server: `npm start` or `yarn start`

## Configuration

The admin portal requires configuration for connecting to the CMS API. Create a `.env` file in the root directory with the following variables:

```
REACT_APP_CMS_URL=http://localhost:3005/api
REACT_APP_CMS_TOKEN=your_token_here
REACT_APP_NODE_URL=http://localhost:3000/api
REACT_APP_APP_OPCO=INDIA
```

### CMS API Token

The CMS API token is required for authentication with the CMS. There are two ways to get the token:

1. **From tokens.txt**: If you have access to the `tokens.txt` file in the project root, copy the token from there.

2. **From CMS Admin**: Log in to the CMS admin panel and generate a new API token.

3. **Using the UI Helper**: If you encounter an authentication error, you can use the "Download .env File with Token" button on the error screen to automatically generate a properly configured `.env` file with the token from tokens.txt.

### Troubleshooting Authentication Errors

If you encounter a 401 Unauthorized error when accessing the admin portal, follow these steps:

1. Check if you have a valid CMS API token set in the `.env` file.
2. Verify that the CMS server is running and accessible.
3. If the token is expired, generate a new one from the CMS admin panel.
4. Use the "Download .env File with Token" button on the error screen for quick setup.
5. Restart the development server after updating the token.

## Project Structure

- `/src/api`: API clients for both CMS and Node backends
  - `/src/api/cmsApi`: API client for CMS (products, categories)
  - `/src/api/nodeApi`: API client for Node backend
- `/src/pages`: React components for each page
- `/src/components`: Reusable UI components
  - `/src/components/atom`: Basic UI elements
  - `/src/components/molecule`: Composite components
- `/src/utility`: Helper functions and configuration
- `/src/theme`: Theme configuration and components

## Recent Updates

- Added real API integration for Products and Categories
- Implemented detailed error handling for authentication issues
- Added helper utilities for token management
- Improved the UI for loading states and error messages
- Added create, update, and delete functionality for Products and Categories
