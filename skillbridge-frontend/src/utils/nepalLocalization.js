// Nepal Localization Utilities

// Currency formatting for Nepali Rupees
export const formatToNepaliRupees = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rs. 0.00';
  }
  
  const numAmount = parseFloat(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
  
  return formatted.replace('NPR', 'Rs.');
};

// Convert USD to NPR (approximate rate)
export const convertUSDToNPR = (usdAmount) => {
  const exchangeRate = 133.50; // Approximate USD to NPR rate
  return usdAmount * exchangeRate;
};

// Phone number validation for Nepal
export const validateNepaliPhone = (phone) => {
  // Remove spaces, dashes, and other characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Nepal phone number patterns
  const patterns = [
    /^98\d{8}$/, // Mobile numbers starting with 98
    /^97\d{8}$/, // Mobile numbers starting with 97
    /^96\d{8}$/, // Mobile numbers starting with 96
    /^95\d{8}$/, // Mobile numbers starting with 95
    /^94\d{8}$/, // Mobile numbers starting with 94
    /^01\d{7}$/, // Landline numbers starting with 01
    /^02\d{7}$/, // Landline numbers starting with 02
    /^03\d{7}$/, // Landline numbers starting with 03
    /^04\d{7}$/, // Landline numbers starting with 04
    /^05\d{7}$/, // Landline numbers starting with 05
    /^06\d{7}$/, // Landline numbers starting with 06
    /^07\d{7}$/, // Landline numbers starting with 07
    /^08\d{7}$/, // Landline numbers starting with 08
    /^09\d{7}$/, // Landline numbers starting with 09
  ];
  
  return patterns.some(pattern => pattern.test(cleanPhone));
};

// Format Nepali phone number
export const formatNepaliPhone = (phone) => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleanPhone.length === 10) {
    // Mobile numbers
    if (cleanPhone.startsWith('98') || cleanPhone.startsWith('97') || 
        cleanPhone.startsWith('96') || cleanPhone.startsWith('95') || 
        cleanPhone.startsWith('94')) {
      return `${cleanPhone.slice(0, 2)}-${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
    }
    // Landline numbers
    else if (cleanPhone.startsWith('0')) {
      return `${cleanPhone.slice(0, 2)}-${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
    }
  }
  
  return phone;
};

// Nepal provinces data
export const nepalProvinces = [
  { value: 'province1', label: 'Province 1 (Koshi)' },
  { value: 'province2', label: 'Province 2 (Madhesh)' },
  { value: 'province3', label: 'Province 3 (Bagmati)' },
  { value: 'province4', label: 'Province 4 (Gandaki)' },
  { value: 'province5', label: 'Province 5 (Lumbini)' },
  { value: 'province6', label: 'Province 6 (Karnali)' },
  { value: 'province7', label: 'Province 7 (Sudurpaschim)' }
];

// Date formatting for Nepal
export const formatNepaliDate = (date, format = 'DD-MM-YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  if (format === 'DD-MM-YYYY') {
    return `${day}-${month}-${year}`;
  } else if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }
  
  return `${day}-${month}-${year}`;
};

// Get current date in Nepali format
export const getCurrentNepaliDate = () => {
  return formatNepaliDate(new Date());
};

// Nepal-specific validation rules
export const nepalValidationRules = {
  phone: {
    required: 'फोन नम्बर आवश्यक छ',
    pattern: 'मान्य फोन नम्बर प्रविष्ट गर्नुहोस् (उदाहरण: 98xxxxxxxx)'
  },
  address: {
    required: 'ठेगाना आवश्यक छ'
  },
  city: {
    required: 'शहर आवश्यक छ'
  },
  district: {
    required: 'जिल्ला आवश्यक छ'
  },
  province: {
    required: 'प्रान्त आवश्यक छ'
  }
};

// Default Nepal settings
export const defaultNepalSettings = {
  country: 'Nepal',
  currency: 'NPR',
  dateFormat: 'DD-MM-YYYY',
  timezone: 'Asia/Kathmandu'
};

// Add back the nepalDistricts mapping for province to districts
export const nepalDistricts = {
  province1: [
    'Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaldhunga', 'Panchthar', 'Sankhuwasabha', 'Solukhumbu', 'Sunsari', 'Taplejung', 'Terhathum', 'Udayapur'
  ],
  province2: [
    'Bara', 'Dhanusha', 'Mahottari', 'Parsa', 'Rautahat', 'Saptari', 'Sarlahi', 'Siraha'
  ],
  province3: [
    'Bhaktapur', 'Chitwan', 'Dhading', 'Dolakha', 'Kavrepalanchok', 'Kathmandu', 'Lalitpur', 'Makwanpur', 'Nuwakot', 'Ramechhap', 'Rasuwa', 'Sindhuli', 'Sindhupalchok'
  ],
  province4: [
    'Baglung', 'Gorkha', 'Kaski', 'Lamjung', 'Manang', 'Mustang', 'Myagdi', 'Nawalpur', 'Parbat', 'Syangja', 'Tanahun'
  ],
  province5: [
    'Arghakhanchi', 'Banke', 'Bardiya', 'Dang', 'Eastern Rukum', 'Gulmi', 'Kapilvastu', 'Palpa', 'Parasi', 'Pyuthan', 'Rolpa', 'Rupandehi'
  ],
  province6: [
    'Dailekh', 'Dolpa', 'Humla', 'Jajarkot', 'Jumla', 'Kalikot', 'Mugu', 'Salyan', 'Surkhet', 'Western Rukum'
  ],
  province7: [
    'Achham', 'Baitadi', 'Bajhang', 'Bajura', 'Dadeldhura', 'Darchula', 'Doti', 'Kailali', 'Kanchanpur'
  ]
};

// Get districts for a specific province
export const getDistrictsByProvince = (province) => {
  return nepalDistricts[province] || [];
};

// Format currency input for display
export const formatCurrencyInput = (value) => {
  if (!value) return '';
  
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = numericValue.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  return numericValue;
};

// Parse currency input to number
export const parseCurrencyInput = (value) => {
  if (!value) return 0;
  
  const numericValue = value.replace(/[^\d.]/g, '');
  return parseFloat(numericValue) || 0;
};

// Nepal-specific formatters
export const nepalFormatters = {
  currency: formatToNepaliRupees,
  phone: formatNepaliPhone,
  date: formatNepaliDate,
  currencyInput: formatCurrencyInput,
  parseCurrency: parseCurrencyInput
};

export default {
  formatToNepaliRupees,
  convertUSDToNPR,
  validateNepaliPhone,
  formatNepaliPhone,
  nepalProvinces,
  nepalDistricts,
  formatNepaliDate,
  getCurrentNepaliDate,
  nepalValidationRules,
  defaultNepalSettings,
  getDistrictsByProvince,
  nepalFormatters
}; 