# Security Features Documentation

## Overview
This document describes the security features implemented in the SkillBridge application, specifically the password change and account deletion functionality.

## Password Change Functionality

### Backend API
- **Endpoint**: `PUT /api/auth/change-password`
- **Authentication**: Required (Bearer token)
- **Validation**: 
  - Current password is required
  - New password must be at least 6 characters long
  - New password must contain at least one uppercase letter, one lowercase letter, and one number
  - New password must be different from current password

### Frontend Implementation
- Located in `Settings.jsx` under the Security tab
- Modal-based interface for password change
- Real-time validation and error handling
- Success/error notifications via Toast component

### Security Features
- Current password verification before allowing changes
- Password strength validation
- Secure password hashing using bcrypt
- JWT token-based authentication

## Account Deletion Functionality

### Backend API
- **Endpoint**: `DELETE /api/auth/delete-account`
- **Authentication**: Required (Bearer token)
- **Validation**: Password confirmation required

### Data Cleanup Process
When an account is deleted, the following data is removed from the database:
1. **User Profile**: Complete user record from the User collection
2. **Analysis History**: All analysis records associated with the user
3. **Chat History**: All chat records associated with the user
4. **Analysis Data**: All analysis data associated with the user

### Frontend Implementation
- Located in `Settings.jsx` under the Security tab
- Warning modal with clear consequences
- Password confirmation required
- Automatic logout and redirect after successful deletion

### Security Features
- Password verification before deletion
- Complete data removal from all collections
- Automatic session termination
- Clear warning about irreversible action

## API Endpoints Summary

### Password Change
```javascript
PUT /api/auth/change-password
Headers: {
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
Body: {
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Account Deletion
```javascript
DELETE /api/auth/delete-account
Headers: {
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
Body: {
  "password": "string"
}
```

## Error Handling

### Password Change Errors
- Invalid current password
- Weak new password
- Same password as current
- Network/server errors

### Account Deletion Errors
- Invalid password
- Network/server errors
- Database operation failures

## Frontend Components

### Security Tab
- Password change section with clear instructions
- Account deletion section with warnings
- Modal-based interactions for both features

### Modals
- **Password Change Modal**: Three-field form (current, new, confirm)
- **Delete Account Modal**: Single password field with warning

### Toast Notifications
- Success messages for completed actions
- Error messages for failed operations
- Loading states during API calls

## Security Considerations

1. **Password Validation**: Strong password requirements enforced
2. **Authentication**: All operations require valid JWT token
3. **Data Privacy**: Complete removal of user data on account deletion
4. **Session Management**: Automatic logout after account deletion
5. **Input Validation**: Server-side validation for all inputs
6. **Error Handling**: Secure error messages that don't leak sensitive information

## Testing

To test the functionality:

1. **Password Change**:
   - Navigate to Settings → Security tab
   - Click "Change Password"
   - Enter current password and new password
   - Verify validation and success/error handling

2. **Account Deletion**:
   - Navigate to Settings → Security tab
   - Click "Delete Account"
   - Enter password to confirm
   - Verify data removal and logout

## Database Impact

### Collections Affected by Account Deletion
- `users` - User profile data
- `analysishistories` - Analysis history records
- `chats` - Chat conversation records
- `analyses` - Analysis data records

### Data Integrity
- All related data is properly removed
- No orphaned records left in database
- Referential integrity maintained through proper cleanup 