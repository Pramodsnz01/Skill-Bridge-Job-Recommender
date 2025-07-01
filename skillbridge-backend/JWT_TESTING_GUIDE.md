# JWT Authentication Testing Guide

## Method 1: Using the Test Script (Easiest)

### Step 1: Run the Automated Test
```bash
cd skillbridge-backend
node test-auth.js
```

This will automatically test all authentication endpoints and show you the results.

---

## Method 2: Manual Testing with cURL

### Step 1: Test Server Status
```bash
curl http://localhost:5000/api/status
```
**Expected Response:**
```json
{"status":"API Working"}
```

### Step 2: Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Step 3: Login with the User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:** Same format as register, with user data and token.

### Step 4: Test Protected Route (With Token)
```bash
# Replace YOUR_TOKEN_HERE with the token from login/register
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Step 5: Test Protected Route (Without Token) - Should Fail
```bash
curl -X GET http://localhost:5000/api/auth/me
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Step 6: Test Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Method 3: Using Postman

### Step 1: Create a New Collection
1. Open Postman
2. Create a new collection called "SkillBridge Auth"

### Step 2: Test Register Endpoint
1. Create a new POST request
2. URL: `http://localhost:5000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```
5. Send the request
6. Copy the token from the response

### Step 3: Test Login Endpoint
1. Create a new POST request
2. URL: `http://localhost:5000/api/auth/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```
5. Send the request

### Step 4: Test Protected Route
1. Create a new GET request
2. URL: `http://localhost:5000/api/auth/me`
3. Headers: 
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN_HERE`
4. Send the request

### Step 5: Test Without Token
1. Use the same GET request
2. Remove the Authorization header
3. Send the request - should return 401 error

---

## Method 4: Using Browser Developer Tools

### Step 1: Open Browser Console
1. Open your browser (Chrome, Firefox, etc.)
2. Press F12 to open Developer Tools
3. Go to Console tab

### Step 2: Test Register
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Browser User',
    email: 'browser@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Register Response:', data);
  // Store token for next requests
  localStorage.setItem('token', data.data.token);
})
.catch(error => console.error('Error:', error));
```

### Step 3: Test Login
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'browser@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Login Response:', data);
  localStorage.setItem('token', data.data.token);
})
.catch(error => console.error('Error:', error));
```

### Step 4: Test Protected Route
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log('Current User:', data))
.catch(error => console.error('Error:', error));
```

---

## Method 5: Testing Error Cases

### Test 1: Invalid Email Format
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "password": "password123"
  }'
```

### Test 2: Short Password
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123"
  }'
```

### Test 3: Duplicate Email
```bash
# Run this twice with the same email
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "duplicate@example.com",
    "password": "password123"
  }'
```

### Test 4: Invalid Token
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token_here"
```

### Test 5: Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User"
  }'
```

---

## What to Look For

### ✅ Success Indicators:
- HTTP 200/201 status codes
- `success: true` in response
- Valid JWT token returned
- User data without password field
- Proper error messages for invalid requests

### ❌ Error Indicators:
- HTTP 400/401/500 status codes
- `success: false` in response
- Clear error messages
- Validation errors for invalid input

### 🔒 Security Checks:
- Passwords are hashed (not plain text)
- Tokens are required for protected routes
- Invalid tokens are rejected
- Email validation works
- Password strength requirements enforced

---

## Troubleshooting

### Common Issues:

1. **Server not running**: Make sure `npm run dev` is running
2. **MongoDB not connected**: Check MongoDB is running
3. **CORS errors**: Backend has CORS enabled
4. **Port conflicts**: Check if port 5000 is available
5. **Invalid JSON**: Make sure request body is valid JSON

### Debug Commands:
```bash
# Check if server is running
curl http://localhost:5000/api/status

# Check MongoDB connection
# Look for "Connected to MongoDB" in server logs

# Check server logs
# Look at the terminal where npm run dev is running
``` 