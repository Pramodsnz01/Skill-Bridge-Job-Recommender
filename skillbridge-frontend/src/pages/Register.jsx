import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NepalFormField from '../components/ui/NepalFormField';
import { validateNepaliPhone, fetchProvinces, fetchDistrictsByProvince, fetchMunicipalitiesByDistrict } from '../utils/nepalLocalization';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    municipality: '',
    district: '',
    province: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Dynamic location data
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [locationError, setLocationError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Fetch provinces on mount
  useEffect(() => {
    setLoadingProvinces(true);
    fetchProvinces()
      .then(data => setProvinces(data))
      .catch(() => setLocationError('Failed to load provinces'))
      .finally(() => setLoadingProvinces(false));
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (formData.province) {
      setLoadingDistricts(true);
      setDistricts([]);
      setMunicipalities([]);
      setFormData(prev => ({ ...prev, district: '', municipality: '' }));
      fetchDistrictsByProvince(formData.province)
        .then(data => setDistricts(data))
        .catch(() => setLocationError('Failed to load districts'))
        .finally(() => setLoadingDistricts(false));
    } else {
      setDistricts([]);
      setMunicipalities([]);
      setFormData(prev => ({ ...prev, district: '', municipality: '' }));
    }
  }, [formData.province]);

  // Fetch municipalities when district changes
  useEffect(() => {
    if (formData.district) {
      setLoadingMunicipalities(true);
      setMunicipalities([]);
      setFormData(prev => ({ ...prev, municipality: '' }));
      fetchMunicipalitiesByDistrict(formData.district)
        .then(data => setMunicipalities(data))
        .catch(() => setLocationError('Failed to load municipalities'))
        .finally(() => setLoadingMunicipalities(false));
    } else {
      setMunicipalities([]);
      setFormData(prev => ({ ...prev, municipality: '' }));
    }
  }, [formData.district]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('');
    }
    // Clear location error
    if (locationError) {
      setLocationError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    // Phone validation - make it required and validate format
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validateNepaliPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Nepali phone number';
    }
    if (!formData.province) {
      newErrors.province = 'Province is required';
    }
    if (!formData.district) {
      newErrors.district = 'District is required';
    }
    if (!formData.municipality) {
      newErrors.municipality = 'Municipality is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    setApiError('');
    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        municipality: formData.municipality,
        district: formData.district,
        province: formData.province,
      });
      if (result.success) {
        navigate('/dashboard');
      } else {
        setApiError(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {apiError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
            </div>
          )}
          {locationError && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">{locationError}</p>
            </div>
          )}
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <NepalFormField
                type="text"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
                disabled={isLoading}
                placeholder="Enter your first name"
              />
              <NepalFormField
                type="text"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
                disabled={isLoading}
                placeholder="Enter your last name"
              />
            </div>
            {/* Email Field */}
            <NepalFormField
              type="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              disabled={isLoading}
              placeholder="Enter your email address"
            />
            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <NepalFormField
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                disabled={isLoading}
                placeholder="Enter your password"
              />
              <NepalFormField
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                disabled={isLoading}
                placeholder="Confirm your password"
              />
            </div>
            {/* Phone Field */}
            <NepalFormField
              type="phone"
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
              disabled={isLoading}
              placeholder="98xxxxxxxx"
            />
            {/* Address Field */}
            <NepalFormField
              type="text"
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              required
              disabled={isLoading}
              placeholder="Enter your address"
            />
            {/* Location Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <NepalFormField
                type="province"
                label="Province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                error={errors.province}
                required
                disabled={isLoading || loadingProvinces}
                options={provinces.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ') }))}
                loading={loadingProvinces}
              />
              <NepalFormField
                type="district"
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
                error={errors.district}
                required
                disabled={isLoading || !formData.province || loadingDistricts}
                options={districts.map(d => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1).replace(/-/g, ' ') }))}
                loading={loadingDistricts}
              />
              <NepalFormField
                type="municipality"
                label="Municipality"
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                error={errors.municipality}
                required
                disabled={isLoading || !formData.district || loadingMunicipalities}
                options={municipalities.map(m => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }))}
                loading={loadingMunicipalities}
              />
            </div>
          </div>
          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              disabled={isLoading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Terms and Conditions
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 