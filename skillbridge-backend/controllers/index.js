// Export all controllers from this file
// Example: const userController = require('./userController');
// module.exports = { userController };

const authController = require('./authController');
const resumeController = require('./resumeController');
const analyzeController = require('./analyzeController');

module.exports = { 
    authController, 
    resumeController, 
    analyzeController 
}; 