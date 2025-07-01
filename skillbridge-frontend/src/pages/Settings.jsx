import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { changePassword, deleteAccount } from '../services/authService';
import Toast from '../components/Toast';

// Error Boundary Component
class SettingsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Settings component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Something went wrong</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  There was an error loading the settings page. Please try refreshing the page.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [error, setError] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const fileInputRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '9812345678',
    location: 'Kathmandu, Nepal',
    bio: 'Experienced software developer with passion for creating innovative solutions.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    experience: '5 years',
    education: "Bachelor's in Computer Science",
    address: 'Thamel, Kathmandu',
    profilePicture: null,
    profilePictureUrl: 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=JD'
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // New delete password state
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState('');

  // Enhanced tabs with new features
  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤', description: 'Personal information and skills' },
    { id: 'security', name: 'Security', icon: '🔒', description: 'Password and account security' },
    { id: 'activity', name: 'Activity', icon: '📊', description: 'Login history and account activity' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️', description: 'App settings and preferences' }
  ];

  // Load user profile on component mount
  useEffect(() => {
    console.log('Settings component mounted');
    loadUserProfile();
    loadActivityLogs();
    
    let timeoutId;
    if (loading) {
      timeoutId = setTimeout(() => {
        if (loading) {
          setError('Loading timeout. Please check your connection and try again.');
          setLoading(false);
        }
      }, 30000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && hasChanges && !saving) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      // Set new timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSaveProfile();
      }, 2000); // Auto-save after 2 seconds of no changes
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [profileData, autoSaveEnabled, hasChanges, saving]);

  // Check for changes
  useEffect(() => {
    if (originalData) {
      const hasDataChanges = JSON.stringify(profileData) !== JSON.stringify(originalData);
      setHasChanges(hasDataChanges);
    }
  }, [profileData, originalData]);

  // Real-time validation for touched fields
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const newErrors = {};
      Object.keys(touched).forEach(field => {
        if (touched[field]) {
          const error = validateField(field, profileData[field]);
          if (error) {
            newErrors[field] = error;
          }
        }
      });
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
  }, [profileData, touched]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading user profile...');
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      // For testing purposes, if no token, use mock data
      if (!token) {
        console.log('No token found, using mock data for testing');
        const mockUserData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '9812345678',
          location: 'Kathmandu, Nepal',
          bio: 'Experienced software developer with passion for creating innovative solutions.',
          skills: ['JavaScript', 'React', 'Node.js', 'Python'],
          experience: '5 years',
          education: "Bachelor's in Computer Science",
          address: 'Thamel, Kathmandu',
          currency: 'NPR',
          language: 'en',
          profilePictureUrl: 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=JD'
        };
        
        console.log('Setting mock profile data:', mockUserData);
        setProfileData(mockUserData);
        setOriginalData(mockUserData);
        setLoading(false);
        return;
      }

      console.log('Making API call to getUserProfile...');
      const response = await getUserProfile();
      console.log('API response:', response);
      
      if (response.success && response.data && response.data.user) {
        const user = response.data.user;
        console.log('User data received:', user);
        
        // Map all possible fields from the user object
        const userData = {
          firstName: user.firstName || user.name?.split(' ')[0] || '',
          lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phone || '',
          location: user.location || user.city || user.province || '',
          bio: user.bio || user.about || '',
          skills: user.skills || [],
          experience: user.experience || '',
          education: user.education || '',
          address: user.address || '',
          currency: user.currency || 'NPR',
          language: user.language || 'en',
          profilePictureUrl: user.profilePictureUrl || 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=JD'
        };
        
        console.log('Processed user data:', userData);
        setProfileData(userData);
        setOriginalData(userData);
        setLoading(false);
      } else {
        console.log('API response indicates failure:', response);
        throw new Error(response.message || 'Failed to load profile data');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to load profile data. Please try again.';

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Profile not found. Please contact support.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  const loadActivityLogs = async () => {
    // Mock activity logs for demonstration
    const mockLogs = [
      {
        id: 1,
        action: 'Login',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        ip: '192.168.1.1',
        location: 'Kathmandu, Nepal',
        device: 'Chrome on Windows 10',
        status: 'success'
      },
      {
        id: 2,
        action: 'Profile Updated',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        ip: '192.168.1.1',
        location: 'Kathmandu, Nepal',
        device: 'Chrome on Windows 10',
        status: 'success'
      },
      {
        id: 3,
        action: 'Login',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        ip: '192.168.1.1',
        location: 'Kathmandu, Nepal',
        device: 'Chrome on Windows 10',
        status: 'success'
      }
    ];
    setActivityLogs(mockLogs);
  };

  // Enhanced phone validation for Nepali numbers
  const validateNepaliPhone = (phone) => {
    if (!phone) return true; // Phone is optional
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const patterns = [
      /^98\d{8}$/, /^97\d{8}$/, /^96\d{8}$/, /^95\d{8}$/, /^94\d{8}$/,
      /^01\d{7}$/, /^02\d{7}$/, /^03\d{7}$/, /^04\d{7}$/, /^05\d{7}$/,
      /^06\d{7}$/, /^07\d{7}$/, /^08\d{7}$/, /^09\d{7}$/
    ];
    return patterns.some(pattern => pattern.test(cleanPhone));
  };

  // Enhanced validation functions with more comprehensive rules
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value || value.trim().length === 0) {
          return 'First name is required';
        }
        if (value.trim().length < 2) {
          return 'First name must be at least 2 characters';
        }
        if (value.trim().length > 50) {
          return 'First name cannot exceed 50 characters';
        }
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          return 'First name can only contain letters and spaces';
        }
        break;
      case 'lastName':
        if (!value || value.trim().length === 0) {
          return 'Last name is required';
        }
        if (value.trim().length < 2) {
          return 'Last name must be at least 2 characters';
        }
        if (value.trim().length > 50) {
          return 'Last name cannot exceed 50 characters';
        }
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          return 'Last name can only contain letters and spaces';
        }
        break;
      case 'email':
        if (!value || value.trim().length === 0) {
          return 'Email address is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return 'Please enter a valid email address';
        }
        if (value.trim().length > 100) {
          return 'Email address cannot exceed 100 characters';
        }
        break;
      case 'phone':
        if (value && value.trim().length > 0) {
          if (!validateNepaliPhone(value)) {
            return 'Please enter a valid Nepali phone number (e.g., 98xxxxxxxx)';
          }
          if (value.trim().length > 15) {
            return 'Phone number cannot exceed 15 characters';
          }
        }
        break;
      case 'skills':
        if (!value || value.length === 0) {
          return 'At least one skill is required';
        }
        if (value.some(skill => !skill.trim())) {
          return 'Skills cannot be empty';
        }
        if (value.some(skill => skill.trim().length < 2)) {
          return 'Each skill must be at least 2 characters';
        }
        if (value.some(skill => skill.trim().length > 30)) {
          return 'Each skill cannot exceed 30 characters';
        }
        if (value.length > 10) {
          return 'You can add maximum 10 skills';
        }
        // Check for duplicate skills (case-insensitive)
        const skillSet = new Set(value.map(skill => skill.trim().toLowerCase()));
        if (skillSet.size !== value.length) {
          return 'Duplicate skills are not allowed';
        }
        break;
      case 'experience':
        if (value && value.trim().length > 0) {
          const experienceRegex = /^\d+\s*years?$/i;
          if (!experienceRegex.test(value.trim())) {
            return 'Experience must be in format "X years" (e.g., "5 years")';
          }
          const years = parseInt(value);
          if (years < 0 || years > 50) {
            return 'Experience must be between 0 and 50 years';
          }
        }
        break;
      case 'education':
        if (!value || value.trim().length === 0) {
          return 'Education is required';
        }
        if (value.trim().length < 5) {
          return 'Education must be at least 5 characters';
        }
        if (value.trim().length > 200) {
          return 'Education cannot exceed 200 characters';
        }
        break;
      case 'bio':
        if (value && value.trim().length > 0) {
          if (value.trim().length < 10) {
            return 'Bio must be at least 10 characters';
          }
          if (value.trim().length > 500) {
            return 'Bio cannot exceed 500 characters';
          }
        }
        break;
      case 'address':
        if (value && value.trim().length > 0) {
          if (value.trim().length < 5) {
            return 'Address must be at least 5 characters';
          }
          if (value.trim().length > 200) {
            return 'Address cannot exceed 200 characters';
          }
        }
        break;
      case 'location':
        if (value && value.trim().length > 0) {
          if (value.trim().length < 2) {
            return 'Location must be at least 2 characters';
          }
          if (value.trim().length > 100) {
            return 'Location cannot exceed 100 characters';
          }
        }
        break;
      default:
        return '';
    }
    return '';
  };

  // Password validation
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('One number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('One special character');
    }
    return errors;
  };

  // Pure validation (no setState)
  const getFormErrors = () => {
    const newErrors = {};
    // Validate all required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'skills', 'education'];
    requiredFields.forEach(field => {
      const error = validateField(field, profileData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    // Validate optional fields if they have values
    const optionalFields = ['phone', 'experience', 'bio', 'address', 'location'];
    optionalFields.forEach(field => {
      if (profileData[field]) {
        const error = validateField(field, profileData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });
    return newErrors;
  };

  // Use useMemo to keep the save button state updated in real-time
  const isFormValid = useMemo(() => {
    // Form is valid if there are no errors and there are changes
    return Object.keys(getFormErrors()).length === 0 && hasChanges;
  }, [profileData, hasChanges]);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSkillChange = (skills) => {
    // Filter out empty skills and trim whitespace
    const cleanSkills = skills.filter(skill => skill && skill.trim().length > 0);
    
    setProfileData(prev => ({
      ...prev,
      skills: cleanSkills
    }));
    
    // Mark skills field as touched
    setTouched(prev => ({
      ...prev,
      skills: true
    }));
    
    // Clear skills error when user starts typing
    if (errors.skills) {
      setErrors(prev => ({
        ...prev,
        skills: ''
      }));
    }
  };

  const addSkill = (skill) => {
    if (skill && skill.trim() && !profileData.skills.includes(skill.trim())) {
      handleSkillChange([...profileData.skills, skill.trim()]);
    }
  };

  const removeSkill = (skillToRemove) => {
    handleSkillChange(profileData.skills.filter(skill => skill !== skillToRemove));
  };

  // Profile picture upload
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setToast({
          message: 'Please select a valid image file',
          type: 'error'
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setToast({
          message: 'Image size must be less than 5MB',
          type: 'error'
        });
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: file,
          profilePictureUrl: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    console.log('Starting profile save...');
    
    // Validate form before saving
    const errorsObj = getFormErrors();
    setErrors(errorsObj);
    
    if (Object.keys(errorsObj).length > 0) {
      console.log('Validation errors found:', errorsObj);
      setToast({
        message: 'Please fix the validation errors before saving',
        type: 'error'
      });
      return;
    }
    
    try {
      setSaving(true);
      console.log('Saving profile data:', profileData);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      
      if (!token) {
        // For testing purposes, simulate successful save
        console.log('No token found, simulating successful save');
        setTimeout(() => {
          setOriginalData(profileData);
          setHasChanges(false);
          setSaving(false);
          setToast({
            message: 'Profile updated successfully!',
            type: 'success'
          });
        }, 1000);
        return;
      }

      const response = await updateUserProfile(profileData);
      console.log('Update response:', response);
      
      if (response.success) {
        setOriginalData(profileData);
        setHasChanges(false);
        setToast({
          message: 'Profile updated successfully!',
          type: 'success'
        });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setToast({
        message: error.message || 'Failed to save profile. Please try again.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalData) {
      setProfileData(originalData);
      setErrors({});
      setTouched({});
      setHasChanges(false);
      setToast({
        message: 'Changes reset to original values',
        type: 'info'
      });
    }
  };

  // Password change handlers
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear password errors when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePasswordSubmit = async () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const passwordValidation = validatePassword(passwordData.newPassword);
      if (passwordValidation.length > 0) {
        errors.newPassword = `Password must contain: ${passwordValidation.join(', ')}`;
      }
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        setSaving(true);
        await changePassword(passwordData.currentPassword, passwordData.newPassword);
        
        setToast({
          message: 'Password changed successfully!',
          type: 'success'
        });
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordErrors({});
      } catch (error) {
        setToast({
          message: error.message || 'Failed to change password. Please try again.',
          type: 'error'
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeletePasswordError('Password is required to delete your account');
      return;
    }

    try {
      setSaving(true);
      await deleteAccount(deletePassword);
      
      setToast({
        message: 'Account deleted successfully. You will be redirected to the home page.',
        type: 'success'
      });
      
      // Clear local storage and redirect
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }, 2000);
      
    } catch (error) {
      setToast({
        message: error.message || 'Failed to delete account. Please try again.',
        type: 'error'
      });
      setDeletePasswordError(error.message || 'Failed to delete account');
    } finally {
      setSaving(false);
    }
  };

  const renderProfileTab = () => {
    // Safety check to prevent crashes
    if (!profileData) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile data...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleProfileChange('firstName', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, firstName: true }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                  errors.firstName && touched.firstName ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your first name"
                maxLength={50}
              />
              {errors.firstName && touched.firstName && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleProfileChange('lastName', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, lastName: true }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                  errors.lastName && touched.lastName ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your last name"
                maxLength={50}
              />
              {errors.lastName && touched.lastName && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                  errors.email && touched.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                  errors.phone && touched.phone ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="98xxxxxxxx (Nepali format)"
              />
              {errors.phone && touched.phone && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience
              </label>
              <input
                type="text"
                value={profileData.experience}
                onChange={(e) => handleProfileChange('experience', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, experience: true }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                  errors.experience && touched.experience ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., 5 years"
              />
              {errors.experience && touched.experience && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.experience}</p>
              )}
            </div>

            {/* Education */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Education *
              </label>
              <input
                type="text"
                value={profileData.education}
                onChange={(e) => handleProfileChange('education', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, education: true }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                  errors.education && touched.education ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., Bachelor's in Computer Science"
                maxLength={200}
              />
              {errors.education && touched.education && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.education}</p>
              )}
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills *
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full flex items-center space-x-1"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a skill (e.g., JavaScript)"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value.trim()) {
                        addSkill(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      if (input.value.trim()) {
                        addSkill(input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
                {errors.skills && touched.skills && (
                  <p className="text-red-500 dark:text-red-400 text-sm">{errors.skills}</p>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Press Enter or click Add to add skills. Click × to remove.
                </p>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleProfileChange('location', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, location: true }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                  errors.location && touched.location ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., Kathmandu, Nepal"
                maxLength={100}
              />
              {errors.location && touched.location && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => handleProfileChange('address', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, address: true }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                  errors.address && touched.address ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your address"
                maxLength={200}
              />
              {errors.address && touched.address && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, bio: true }))}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 resize-none ${
                  errors.bio && touched.bio ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
              {errors.bio && touched.bio && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.bio}</p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {profileData.bio.length}/500 characters
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <button
                onClick={loadUserProfile}
                disabled={loading}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {hasChanges ? (
                  <span className="text-orange-600 dark:text-orange-400">• Unsaved changes</span>
                ) : (
                  <span className="text-green-600 dark:text-green-400">• All changes saved</span>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={!isFormValid || saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Account Settings</h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>Account management features are coming soon. For now, you can update your profile information in the Profile tab.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Change Password</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Update your password to keep your account secure. Make sure to use a strong password.
        </p>
        
        <button
          onClick={() => setShowPasswordModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Change Password
        </button>
      </div>

      {/* Account Deletion Section */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-6">Delete Account</h3>
        <div className="space-y-4">
          <p className="text-red-700 dark:text-red-300">
            <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </p>
          <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
            <li>• All your profile information will be deleted</li>
            <li>• All your analysis history will be removed</li>
            <li>• All your chat history will be deleted</li>
            <li>• You will lose access to all your data</li>
          </ul>
          
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'profile':
          return renderProfileTab();
        case 'security':
          return renderSecurityTab();
        case 'account':
          return renderAccountTab();
        default:
          return renderProfileTab();
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Content</h3>
          <p className="text-gray-600 dark:text-gray-400">There was an error loading this tab. Please try refreshing the page.</p>
        </div>
      );
    }
  };

  return (
    <SettingsErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {console.log('Settings render state:', { loading, error, hasProfileData: !!profileData })}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Simple Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
              <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-900 dark:text-white mb-4">
                Settings
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 text-center">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-lg text-gray-600 dark:text-gray-400">Loading settings...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Settings</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button
                  onClick={loadUserProfile}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Main Content - Only show when not loading and no error */}
          {!loading && !error && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex">
                {/* Sidebar */}
                <div className="w-64 border-r border-gray-200 dark:border-gray-700">
                  <nav className="p-4 space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          activeTab === tab.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="mr-3">{tab.icon}</span>
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                      passwordErrors.currentPassword ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter current password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                      passwordErrors.newPassword ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                      passwordErrors.confirmPassword ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordErrors({});
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Changing...</span>
                    </>
                  ) : (
                    <span>Change Password</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-red-900 dark:text-red-200">Delete Account</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-red-700 dark:text-red-300">
                  This action cannot be undone. Please enter your password to confirm account deletion.
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value);
                      setDeletePasswordError('');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                      deletePasswordError ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your password"
                  />
                  {deletePasswordError && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">{deletePasswordError}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeletePasswordError('');
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Account</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingsErrorBoundary>
  );
};

export default Settings; 