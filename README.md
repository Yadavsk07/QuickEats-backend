# Food Order App - Backend

A comprehensive backend API for a food ordering application built with Node.js and Express.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Menu Management**: Manage food items and categories
- **Order Management**: Create, track, and manage orders
- **Payment Processing**: Razorpay payment gateway integration
- **Admin Dashboard**: Dashboard for administrators to manage the application
- **Rate Limiting**: Prevent abuse with rate limiting
- **Error Handling**: Centralized error handling middleware
- **Email Notifications**: Send emails for order confirmations and alerts

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, environment variables)
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middlewares
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env                # Environment variables
├── package.json        # Dependencies
└── README.md          # Project documentation
```

## Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/foodorder
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET_KEY=your_razorpay_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Lint Code
```bash
npm run lint
```

### Fix Linting Issues
```bash
npm run lint:fix
```

## API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### Menu Routes
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get menu item by ID
- `POST /api/menu` - Create new menu item (Admin only)
- `PUT /api/menu/:id` - Update menu item (Admin only)
- `DELETE /api/menu/:id` - Delete menu item (Admin only)

### Order Routes
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Cancel order

### Admin Routes
- `GET /api/admin/dashboard` - Get dashboard data
- `GET /api/admin/analytics` - Get analytics
- `POST /api/admin/users` - Manage users
- `POST /api/admin/orders` - Manage orders

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development/production |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/foodorder |
| JWT_SECRET | Secret key for JWT tokens | your_secret_key |
| JWT_EXPIRE | JWT token expiration time | 7d |
| STRIPE_SECRET_KEY | Stripe secret API key | sk_test_... |
| STRIPE_PUBLIC_KEY | Stripe public API key | pk_test_... |
| EMAIL_USER | Email address for sending emails | your_email@gmail.com |
| EMAIL_PASSWORD | Email password/app password | your_password |

## Technologies Used
RAZORPAY_KEY_ID | Razorpay key ID | rzp_test_... |
| RAZORPAY_SECRET_KEY | Razorpay secret key | your_razorpay_secret
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **Morgan** - HTTP request logging
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## CRazorpayuting

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, email support@foodorderapp.com or open an issue in the GitHub repository.
