# Authentication Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## API Endpoints

### Authentication Routes

#### 1. Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user" // optional, defaults to "user"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### 2. Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### 3. Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

#### 4. Logout
- **POST** `/api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

## Using Authentication Middleware

To protect routes, use the `auth` middleware:

```javascript
const { auth } = require('./middleware/auth');

// Protected route
router.get('/protected', auth, (req, res) => {
    // req.user contains the authenticated user
    res.json({ user: req.user });
});
```

## Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ User model with email, name, password, and role
- ✅ Protected routes with auth middleware
- ✅ User info and token returned after login
- ✅ Input validation and error handling
- ✅ Email uniqueness validation
- ✅ Password strength requirements (min 6 characters)

## Security Notes

1. Change the JWT_SECRET in production
2. Use HTTPS in production
3. Implement rate limiting for auth endpoints
4. Consider adding refresh tokens for better security
5. Add password reset functionality if needed 