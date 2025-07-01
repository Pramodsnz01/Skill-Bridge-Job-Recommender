const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ 
      success: false,
      message: 'Please check your input and try again',
      errors: errorMessages 
    });
  }
  next();
};

const registerValidation = [
  body('name', 'Name is required and must be at least 2 characters long')
    .not().isEmpty().trim().escape()
    .isLength({ min: 2, max: 50 }),
  body('email', 'Please enter a valid email address')
    .isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  // Required Nepal-specific fields
  body('phone', 'Phone number is required')
    .not().isEmpty().trim()
    .custom((value) => {
      const phoneRegex = /^(\+977)?[9][0-9]{9}$|^[0][1-9][0-9]{7}$/;
      if (!phoneRegex.test(value)) {
        throw new Error('Please enter a valid Nepali phone number');
      }
      return true;
    }),
  body('address', 'Address is required')
    .not().isEmpty().trim()
    .isLength({ max: 200 })
    .withMessage('Address cannot be more than 200 characters'),
  body('city', 'City is required')
    .not().isEmpty().trim()
    .isLength({ max: 50 })
    .withMessage('City cannot be more than 50 characters'),
  body('district', 'District is required')
    .not().isEmpty().trim()
    .isLength({ max: 50 })
    .withMessage('District cannot be more than 50 characters'),
  body('province', 'Province is required')
    .not().isEmpty().trim()
    .isIn(['province1', 'province2', 'province3', 'province4', 'province5', 'province6', 'province7'])
    .withMessage('Please select a valid province'),
  handleValidationErrors,
];

const loginValidation = [
  body('email', 'Please enter a valid email address')
    .isEmail().normalizeEmail(),
  body('password', 'Password is required')
    .not().isEmpty(),
  handleValidationErrors,
];

const changePasswordValidation = [
  body('currentPassword', 'Current password is required')
    .not().isEmpty(),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors,
];

const deleteAccountValidation = [
  body('password', 'Password is required to delete account')
    .not().isEmpty(),
  handleValidationErrors,
];

const idParamValidation = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return Promise.reject('Invalid ID format');
    }
    return true;
  }),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  deleteAccountValidation,
  idParamValidation,
}; 