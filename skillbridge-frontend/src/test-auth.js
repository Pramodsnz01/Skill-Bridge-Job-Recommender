// Simple test to verify authentication endpoints
const API_BASE = 'http://localhost:5000/api/auth';

// Test registration
async function testRegistration() {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123'
      })
    });
    
    const data = await response.json();
    console.log('Registration response:', data);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
  }
}

// Test login
async function testLogin() {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'TestPassword123'
      })
    });
    
    const data = await response.json();
    console.log('Login response:', data);
    return data;
  } catch (error) {
    console.error('Login error:', error);
  }
}

// Test get current user
async function testGetCurrentUser(token) {
  try {
    const response = await fetch(`${API_BASE}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Get current user response:', data);
    return data;
  } catch (error) {
    console.error('Get current user error:', error);
  }
}

// Run tests
async function runTests() {
  console.log('Testing authentication endpoints...');
  
  // Test registration
  const regResult = await testRegistration();
  
  // Test login
  const loginResult = await testLogin();
  
  // Test get current user if login was successful
  if (loginResult && loginResult.success && loginResult.data.token) {
    await testGetCurrentUser(loginResult.data.token);
  }
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testAuth = runTests;
} else {
  // Node.js environment
  runTests();
} 