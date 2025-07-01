# Clean Authentication System Setup Guide

## Overview
This guide covers the cleaned authentication system for SkillBridge, which uses **email/password authentication only** with JWT tokens. All OAuth/social login functionality has been removed.

## ✅ What's Been Cleaned Up

### Backend Changes:
- ❌ Removed all OAuth dependencies (passport-google-oauth20, passport-facebook, etc.)
- ❌ Removed Passport.js configuration
- ❌ Removed session middleware
- ❌ Removed OAuth test files
- ✅ Enhanced error handling and logging
- ✅ Improved validation messages
- ✅ Better user feedback

### Frontend Changes:
- ✅ Clean authentication service
- ✅ Improved error handling
- ✅ Better user experience
- ✅ No OAuth references

## 🔧 Backend Setup

### 1. Install Dependencies
```bash
cd skillbridge-backend
npm install
```

### 2. Environment Variables
Create a `.env` file with:
```env
MONGODB_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Server
```bash
npm run dev
```

## 🔧 Frontend Setup

### 1. Install Dependencies
```bash
cd skillbridge-frontend
npm install
```

### 2. Environment Variables
Create a `.env` file with:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the Frontend
```bash
npm run dev
```

## 🧪 Testing the Authentication System

### Run Backend Tests
```bash
cd skillbridge-backend
node test-auth-clean.js
```

### Manual Testing
1. **Registration**: Go to `/register` and create a new account
2. **Login**: Go to `/login` and sign in with your credentials
3. **Protected Routes**: Try accessing `/dashboard` (should redirect to login if not authenticated)
4. **Logout**: Click logout in the navbar

## 📋 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### POST `/api/auth/login`
Login with email and password
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### GET `/api/auth/me`
Get current user profile (requires authentication)
```
Headers: Authorization: Bearer <token>
```

#### POST `/api/auth/logout`
Logout user (requires authentication)
```
Headers: Authorization: Bearer <token>
```

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### JWT Token
- 7-day expiration
- Stored in localStorage
- Automatically included in API requests

### Validation
- Email format validation
- Name length validation (2-50 characters)
- Required field validation
- Duplicate email prevention

## 🚨 Error Handling

### Common Error Messages
- **Registration**: "An account with this email already exists"
- **Login**: "Invalid email or password"
- **Token Expired**: "Session expired. Please sign in again."
- **Invalid Token**: "Invalid session. Please sign in again."

### Error Response Format
```json
{
  "success": false,
  "message": "User-friendly error message",
  "errors": ["Detailed validation errors"]
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Cannot connect to backend"
- Check if backend server is running on port 5000
- Verify MongoDB connection
- Check CORS settings

#### 2. "Invalid email or password"
- Verify email format
- Check password requirements
- Ensure user exists in database

#### 3. "Session expired"
- Clear localStorage and login again
- Check JWT_SECRET in environment variables

#### 4. "Email already exists"
- Use a different email address
- Check if user was previously registered

### Debug Steps
1. Check browser console for frontend errors
2. Check backend console for server errors
3. Verify environment variables
4. Test API endpoints with Postman/curl
5. Check MongoDB connection

## 📝 Logging

The system includes comprehensive logging:
- Registration attempts
- Login attempts (success/failure)
- User profile requests
- Logout events
- Error details

Check the backend console for detailed logs.

## 🎯 Next Steps

After setting up the authentication system:

1. **Test all endpoints** using the test script
2. **Verify frontend integration** by testing registration/login flow
3. **Check protected routes** work correctly
4. **Test error scenarios** (invalid credentials, expired tokens, etc.)

## ✅ Success Criteria

Your authentication system is working correctly when:
- ✅ Users can register with email/password
- ✅ Users can login with valid credentials
- ✅ Invalid credentials show appropriate errors
- ✅ Protected routes require authentication
- ✅ JWT tokens work correctly
- ✅ Logout clears user session
- ✅ No OAuth-related errors occur

## 🆘 Support

If you encounter issues:
1. Check this guide first
2. Review the error logs
3. Test with the provided test script
4. Verify all environment variables are set correctly

---

**🎉 Congratulations!** Your authentication system is now clean, secure, and ready for production use. 