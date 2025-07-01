# Authentication System Guide

## Overview

The SkillBridge application now has a complete authentication system with the following features:

- **User Registration**: Create new accounts with email and password
- **User Login**: Authenticate existing users
- **JWT Token Storage**: Tokens are stored in localStorage for persistent sessions
- **Protected Routes**: Certain pages require authentication
- **User Dashboard**: Shows logged-in user's name and logout functionality
- **Automatic Redirects**: Users are redirected appropriately based on auth status

## Components

### 1. AuthContext (`src/context/AuthContext.jsx`)
- Manages authentication state across the application
- Provides login, register, and logout functions
- Automatically checks for existing tokens on app load
- Stores user data and JWT tokens

### 2. ProtectedRoute (`src/components/ProtectedRoute.jsx`)
- Wraps components that require authentication
- Shows loading state while checking authentication
- Redirects to login page if user is not authenticated

### 3. Updated Components
- **Login.jsx**: Connected to backend API with error handling and loading states
- **Register.jsx**: Connected to backend API with form validation
- **Dashboard.jsx**: Shows user name and logout button
- **Navbar.jsx**: Dynamic navigation based on authentication status
- **App.jsx**: Wrapped with AuthProvider and protected routes

## Backend API Endpoints

The authentication system connects to these backend endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/logout` - Logout (client-side token removal)

## How to Test

### 1. Start the Backend Server
```bash
cd skillbridge-backend
npm start
```

### 2. Start the Frontend Development Server
```bash
cd skillbridge-frontend
npm run dev
```

### 3. Test the Authentication Flow

#### Registration Test:
1. Navigate to `http://localhost:5173/register`
2. Fill out the registration form:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john.doe@example.com"
   - Password: "Password123"
   - Confirm Password: "Password123"
   - Check "I agree to the Terms and Conditions"
3. Click "Create account"
4. You should be redirected to the dashboard

#### Login Test:
1. Navigate to `http://localhost:5173/login`
2. Use the credentials from registration:
   - Email: "john.doe@example.com"
   - Password: "Password123"
3. Click "Sign in"
4. You should be redirected to the dashboard

#### Dashboard Features:
1. The dashboard should display "Welcome back, John Doe!"
2. A logout button should be visible in the top-right corner
3. The navbar should show authenticated navigation items

#### Logout Test:
1. Click the "Logout" button
2. You should be redirected to the home page
3. The navbar should show public navigation items (Home, Login, Register)
4. Trying to access `/dashboard` should redirect to `/login`

### 4. Browser Console Testing

You can also test the API endpoints directly in the browser console:

```javascript
// Import the test file
import('./test-auth.js').then(() => {
  // Run the tests
  window.testAuth();
});
```

## Security Features

1. **JWT Token Storage**: Tokens are stored in localStorage
2. **Automatic Token Validation**: Tokens are validated on app load
3. **Protected Routes**: Unauthenticated users cannot access protected pages
4. **Form Validation**: Client-side validation for all forms
5. **Error Handling**: Proper error messages for failed authentication attempts
6. **Loading States**: Visual feedback during authentication operations

## File Structure

```
skillbridge-frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── components/
│   │   ├── Navbar.jsx               # Updated with auth-aware navigation
│   │   └── ProtectedRoute.jsx       # Route protection component
│   ├── pages/
│   │   ├── Login.jsx                # Updated with API integration
│   │   ├── Register.jsx             # Updated with API integration
│   │   └── Dashboard.jsx            # Updated with user info and logout
│   ├── App.jsx                      # Updated with AuthProvider and protected routes
│   └── test-auth.js                 # API testing utilities
└── AUTHENTICATION_GUIDE.md          # This file
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure the backend server is running on port 5000
2. **MongoDB Connection**: Ensure MongoDB is running and accessible
3. **Token Issues**: Check browser localStorage for token storage
4. **Redirect Loops**: Clear localStorage if authentication state gets corrupted

### Debug Steps:

1. Check browser console for error messages
2. Verify backend server is running: `http://localhost:5000/api/status`
3. Check network tab for API request/response details
4. Clear localStorage and try logging in again

## Next Steps

The authentication system is now fully functional. You can:

1. Add password reset functionality
2. Implement email verification
3. Add social login options (Google, GitHub, etc.)
4. Enhance user profile management
5. Add role-based access control 