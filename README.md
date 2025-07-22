# Grocery-web (Admin Portal)

Web-based admin dashboard for grocery store management. Built for store owners and administrators to manage inventory, orders, customers, and analytics.

## 🚀 Features

- **Product Management**: Add, edit, and organize product catalog with categories, pricing, and inventory
- **Order Management**: View, process, and track customer orders in real-time
- **Customer Management**: Monitor customer accounts, purchase history, and preferences
- **Inventory Tracking**: Real-time stock levels, low-stock alerts, and automated reordering
- **Analytics Dashboard**: Sales reports, customer insights, and performance metrics
- **User Management**: Multi-level admin access with role-based permissions
- **Notifications**: Real-time alerts for new orders, inventory updates, and system events

## 🛠️ Tech Stack

- **Frontend**: React.js 
- **State Management**: Zustand
- **UI Framework**: Material-UI, Bootstrap
- **Charts**: Chart.js 
- **HTTP Client**: Axios, @tanstack/react-query
- **Build Tool**: Webpack

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (grocery-be)

## 🏗️ Installation

1. Clone the repository
```bash
git clone https://github.com/kruthishkandula/Grocery-web.git
cd grocery-web
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=Grocery Admin
```

4. Start the development server
```bash
npm start
# or
yarn start
```

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Deploy to hosting platform
```bash
# Example for Render deploy
commit changes to main deploy
```

## 📁 Project Structure

```
grocery-web/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # API service calls
│   ├── store/              # State management
│   ├── utils/              # Helper functions
│   ├── hooks/              # Custom React hooks
│   └── assets/             # Images, fonts, etc.
├── package.json
└── README.md
```

## 🔧 Configuration

### API Endpoints
Update the API base URL in your environment file or configuration:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

### Authentication
The admin portal integrates with JWT-based authentication from the backend API.

## 📚 API Integration

This admin portal consumes the following API endpoints from `grocery-be`:

- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/products` - Product listing
- `POST /api/products` - Create product
- `GET /api/orders` - Order management
- `GET /api/customers` - Customer data
- `GET /api/analytics` - Reports and analytics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact: kandulakruthish@gmail.com

## 🔗 Related Projects

- [Grocery-mobile](https://github.com/kruthishkandula/Grocery-mobile.git) - Customer mobile app
- [Grocery-be](https://github.com/kruthishkandula/Grocery-be.git) - Backend API
