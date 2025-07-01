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

// Municipalities by district mapping
const nepalMunicipalitiesByDistrict = {
  // Province 1 (Koshi)
  'Bhojpur': ['Bhojpur Municipality', 'Dingla Municipality'],
  'Dhankuta': ['Dhankuta Municipality', 'Pakhribas Municipality'],
  'Ilam': ['Ilam Municipality', 'Phidim Municipality'],
  'Jhapa': ['Bhadrapur Municipality', 'Damak Municipality', 'Birtamod Municipality', 'Mechinagar Municipality'],
  'Khotang': ['Diktel Municipality', 'Rupakot Municipality'],
  'Morang': ['Biratnagar Metropolitan', 'Itahari Sub-Metropolitan', 'Dharan Sub-Metropolitan', 'Inaruwa Municipality', 'Biratchowk Municipality'],
  'Okhaldhunga': ['Okhaldhunga Municipality', 'Salleri Municipality'],
  'Panchthar': ['Phidim Municipality', 'Tumbewa Municipality'],
  'Sankhuwasabha': ['Khandbari Municipality', 'Chainpur Municipality'],
  'Solukhumbu': ['Salleri Municipality', 'Namche Bazaar Municipality'],
  'Sunsari': ['Inaruwa Municipality', 'Itahari Sub-Metropolitan', 'Dharan Sub-Metropolitan'],
  'Taplejung': ['Taplejung Municipality', 'Phungling Municipality'],
  'Terhathum': ['Myanglung Municipality', 'Laligurans Municipality'],
  'Udayapur': ['Gaighat Municipality', 'Katari Municipality'],

  // Province 2 (Madhesh)
  'Bara': ['Kalaiya Sub-Metropolitan', 'Jitpur Simara Sub-Metropolitan', 'Simraungadh Municipality'],
  'Dhanusha': ['Janakpur Sub-Metropolitan', 'Dhanushadham Municipality'],
  'Mahottari': ['Jaleshwar Municipality', 'Bardibas Municipality'],
  'Parsa': ['Birgunj Metropolitan', 'Parsagadhi Municipality'],
  'Rautahat': ['Gaur Municipality', 'Chandrapur Municipality'],
  'Saptari': ['Rajbiraj Municipality', 'Hanumannagar Kankalini Municipality'],
  'Sarlahi': ['Malangwa Municipality', 'Haripur Municipality'],
  'Siraha': ['Siraha Municipality', 'Lahan Municipality'],

  // Province 3 (Bagmati)
  'Bhaktapur': ['Bhaktapur Municipality', 'Madhyapur Thimi Municipality'],
  'Chitwan': ['Bharatpur Metropolitan', 'Ratnanagar Municipality', 'Narayangarh Municipality'],
  'Dhading': ['Dhading Besi Municipality', 'Gajuri Municipality'],
  'Dolakha': ['Charikot Municipality', 'Jiri Municipality'],
  'Kavrepalanchok': ['Banepa Municipality', 'Panauti Municipality', 'Dhulikhel Municipality'],
  'Kathmandu': ['Kathmandu Metropolitan', 'Kirtipur Municipality', 'Budhanilkantha Municipality'],
  'Lalitpur': ['Lalitpur Metropolitan', 'Godawari Municipality'],
  'Makwanpur': ['Hetauda Sub-Metropolitan', 'Thaha Municipality'],
  'Nuwakot': ['Bidur Municipality', 'Kakani Municipality'],
  'Ramechhap': ['Manthali Municipality', 'Ramechhap Municipality'],
  'Rasuwa': ['Dhunche Municipality', 'Syabrubesi Municipality'],
  'Sindhuli': ['Sindhulimadi Municipality', 'Kamalamai Municipality'],
  'Sindhupalchok': ['Chautara Sangachokgadhi Municipality', 'Melamchi Municipality'],

  // Province 4 (Gandaki)
  'Baglung': ['Baglung Municipality', 'Galkot Municipality'],
  'Gorkha': ['Gorkha Municipality', 'Prithbinarayan Municipality'],
  'Kaski': ['Pokhara Metropolitan', 'Lekhnath Municipality'],
  'Lamjung': ['Besisahar Municipality', 'Sundarbazar Municipality'],
  'Manang': ['Chame Rural Municipality', 'Manang Ngisyang Rural Municipality'],
  'Mustang': ['Jomsom Rural Municipality', 'Lo Manthang Rural Municipality'],
  'Myagdi': ['Beni Municipality', 'Galeshwor Municipality'],
  'Nawalpur': ['Kawasoti Municipality', 'Gaindakot Municipality'],
  'Parbat': ['Kusma Municipality', 'Phalebas Municipality'],
  'Syangja': ['Syangja Municipality', 'Putalibazar Municipality'],
  'Tanahun': ['Damauli Municipality', 'Byas Municipality'],

  // Province 5 (Lumbini)
  'Arghakhanchi': ['Sandhikharka Municipality', 'Sitganga Municipality'],
  'Banke': ['Nepalgunj Sub-Metropolitan', 'Kohalpur Municipality'],
  'Bardiya': ['Gulariya Municipality', 'Rajapur Municipality'],
  'Dang': ['Ghorahi Sub-Metropolitan', 'Tulsipur Sub-Metropolitan'],
  'Eastern Rukum': ['Rukumkot Municipality', 'Chaurjahari Municipality'],
  'Gulmi': ['Tamghas Municipality', 'Resunga Municipality'],
  'Kapilvastu': ['Taulihawa Municipality', 'Buddhabhumi Municipality'],
  'Palpa': ['Tansen Municipality', 'Rampur Municipality'],
  'Parasi': ['Ramgram Municipality', 'Sunwal Municipality'],
  'Pyuthan': ['Pyuthan Municipality', 'Swargadwari Municipality'],
  'Rolpa': ['Liwang Municipality', 'Rolpa Municipality'],
  'Rupandehi': ['Siddharthanagar Municipality', 'Butwal Sub-Metropolitan', 'Lumbini Sanskritik Municipality'],

  // Province 6 (Karnali)
  'Dailekh': ['Dailekh Municipality', 'Narayan Municipality'],
  'Dolpa': ['Dunai Municipality', 'Dolpa Municipality'],
  'Humla': ['Simikot Rural Municipality', 'Humla Rural Municipality'],
  'Jajarkot': ['Khalanga Municipality', 'Jajarkot Municipality'],
  'Jumla': ['Chandannath Municipality', 'Jumla Municipality'],
  'Kalikot': ['Manma Municipality', 'Kalikot Municipality'],
  'Mugu': ['Gamgadhi Municipality', 'Mugu Municipality'],
  'Salyan': ['Salyan Municipality', 'Sharada Municipality'],
  'Surkhet': ['Birendranagar Municipality', 'Surkhet Municipality'],
  'Western Rukum': ['Musikot Municipality', 'Rukum Municipality'],

  // Province 7 (Sudurpaschim)
  'Achham': ['Mangalsen Municipality', 'Achham Municipality'],
  'Baitadi': ['Dasharathchand Municipality', 'Baitadi Municipality'],
  'Bajhang': ['Chainpur Municipality', 'Bajhang Municipality'],
  'Bajura': ['Martadi Municipality', 'Bajura Municipality'],
  'Dadeldhura': ['Amargadhi Municipality', 'Dadeldhura Municipality'],
  'Darchula': ['Darchula Municipality', 'Darchula Rural Municipality'],
  'Doti': ['Dipayal Municipality', 'Doti Municipality'],
  'Kailali': ['Dhangadhi Sub-Metropolitan', 'Tikapur Municipality'],
  'Kanchanpur': ['Bhimdatta Municipality', 'Krishnapur Municipality']
};

// Get districts for a specific province
const getDistrictsByProvince = (province) => {
  return nepalDistricts[province] || [];
};

// Get municipalities for a specific district
const getMunicipalitiesByDistrict = (district) => {
  return nepalMunicipalitiesByDistrict[district] || [];
};

// Get municipalities for a specific province (all municipalities in that province)
const getMunicipalitiesByProvince = (province) => {
  const districts = getDistrictsByProvince(province);
  const municipalities = [];
  districts.forEach(district => {
    const districtMunicipalities = getMunicipalitiesByDistrict(district);
    municipalities.push(...districtMunicipalities);
  });
  return [...new Set(municipalities)]; // Remove duplicates
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
  municipality: {
    required: 'Municipality is required'
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
  nepalMunicipalitiesByDistrict,
  getDistrictsByProvince,
  getMunicipalitiesByDistrict,
  getMunicipalitiesByProvince,
  defaultNepalSettings,
  nepalValidationRules
}; 