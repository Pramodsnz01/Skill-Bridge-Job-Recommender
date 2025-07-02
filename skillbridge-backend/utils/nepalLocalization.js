// Nepal Localization Utilities for Backend

// Phone number validation for Nepal
const validateNepaliPhone = (phone) => {
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
const formatNepaliPhone = (phone) => {
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
const nepalProvinces = [
  { value: 'province1', label: 'Province 1 (Koshi)' },
  { value: 'province2', label: 'Province 2 (Madhesh)' },
  { value: 'province3', label: 'Province 3 (Bagmati)' },
  { value: 'province4', label: 'Province 4 (Gandaki)' },
  { value: 'province5', label: 'Province 5 (Lumbini)' },
  { value: 'province6', label: 'Province 6 (Karnali)' },
  { value: 'province7', label: 'Province 7 (Sudurpaschim)' }
];

// Major cities in Nepal
const nepalCities = [
  'Kathmandu', 'Pokhara', 'Lalitpur', 'Bharatpur', 'Biratnagar', 'Birgunj',
  'Dharan', 'Butwal', 'Dhangadhi', 'Nepalgunj', 'Itahari', 'Hetauda',
  'Janakpur', 'Dhankuta', 'Tansen', 'Damak', 'Dharan', 'Ghorahi',
  'Tikapur', 'Kirtipur', 'Tulsipur', 'Bhadrapur', 'Rajbiraj', 'Lahan',
  'Gulariya', 'Siddharthanagar', 'Birendranagar', 'Madhyapur Thimi',
  'Bhimdatta', 'Lekhnath', 'Kirtipur', 'Ratnanagar', 'Buddhabhumi',
  'Gaur', 'Siraha', 'Lamahi', 'Tansen', 'Malangwa', 'Banepa',
  'Rajbiraj', 'Panauti', 'Gaur', 'Tikapur', 'Kirtipur', 'Ratnanagar'
];

// Districts by province
const nepalDistricts = {
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
const getDistrictsByProvince = (province) => {
  return nepalDistricts[province] || [];
};

// Default Nepal settings
const defaultNepalSettings = {
  country: 'Nepal',
  currency: 'NPR',
  dateFormat: 'DD-MM-YYYY',
  timezone: 'Asia/Kathmandu'
};

// Nepal-specific validation rules
const nepalValidationRules = {
  phone: {
    required: 'Phone number is required',
    pattern: 'Please enter a valid Nepali phone number (e.g., 98xxxxxxxx)'
  },
  address: {
    required: 'Address is required'
  },
  city: {
    required: 'City is required'
  },
  district: {
    required: 'District is required'
  },
  province: {
    required: 'Province is required'
  }
};

module.exports = {
  validateNepaliPhone,
  formatNepaliPhone,
  nepalProvinces,
  nepalCities,
  nepalDistricts,
  getDistrictsByProvince,
  defaultNepalSettings,
  nepalValidationRules
}; 