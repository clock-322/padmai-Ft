# Padmai Backend API

Express.js backend application with MongoDB, JWT authentication, and role-based access control.

## Features

- ✅ MongoDB database connection
- ✅ JWT authentication
- ✅ Role-based access control (student, teacher, admin)
- ✅ User registration and login with email/password validation
- ✅ Payment management APIs
- ✅ Swagger API documentation
- ✅ Input validation using express-validator
- ✅ Secure password hashing with bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)

## Installation

1. Navigate to the backend directory:
```bash
cd padmai_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
PORT=3000
MONGODB_URI=mongodb+srv://cluster0.jhyqgks.mongodb.net
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password.

4. Update the `MONGODB_URI` with your MongoDB connection string and set a strong `JWT_SECRET`.

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Documentation

Swagger documentation is available at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Access**: Public
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns JWT token

#### Get Current User
- **GET** `/api/auth/me`
- **Access**: Private (JWT required)

### Payments

#### Add Payment
- **POST** `/api/payments/add`
- **Access**: Private (JWT required)
- **Body**:
  ```json
  {
    "studentId": "STU001",
    "studentName": "John Doe",
    "className": "Class 10A",
    "name": "Tuition Fee",
    "amount": 5000,
    "paymentType": "Monthly"
  }
  ```

#### Get Payment by Student ID
- **POST** `/api/payments/get`
- **Access**: Private (JWT required)
- **Body**:
  ```json
  {
    "studentId": "STU001"
  }
  ```

#### Get All Payments
- **GET** `/api/payments/all`
- **Access**: Private (Admin only)

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Roles

The application supports three roles:
- **student**: Default role for registered users
- **teacher**: Can be assigned by admin
- **admin**: Full access to all endpoints

## Project Structure

```
padmai_backend/
├── config/
│   ├── database.js       # MongoDB connection
│   └── swagger.js        # Swagger configuration
├── controllers/
│   ├── authController.js # Authentication logic
│   └── paymentController.js # Payment logic
├── middleware/
│   ├── auth.js          # JWT authentication middleware
│   └── validation.js    # Input validation middleware
├── models/
│   ├── User.js          # User model
│   └── Payment.js       # Payment model
├── routes/
│   ├── authRoutes.js    # Authentication routes
│   └── paymentRoutes.js # Payment routes
├── server.js            # Main server file
├── package.json
└── README.md
```

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // For validation errors
}
```

## Validation

- Email format validation
- Password minimum length (6 characters)
- Required fields validation
- Numeric validation for amounts

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based authorization
- Input validation and sanitization
- CORS enabled

## License

ISC

