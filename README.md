# SkillBridge - Resume Analysis Platform

A comprehensive resume analysis platform that provides AI-powered insights, career recommendations, and learning paths for job seekers.

## 🚀 Features

- **AI-Powered Resume Analysis**: Extract skills, experience, and career insights
- **Career Domain Prediction**: Identify suitable career paths based on skills
- **Learning Gap Analysis**: Find missing skills and recommend learning resources
- **Personality Trait Analysis**: Understand personality indicators from resume content
- **Multi-language Support**: Support for English and Nepali localization
- **Real-time Chat Assistant**: AI-powered career guidance
- **Analytics Dashboard**: Track progress and skill development
- **PDF Report Generation**: Download detailed analysis reports

## 🏗️ Architecture

The project consists of three main components:

### 1. Resume Analyzer (Python Flask API)
- **Location**: `resume-analyzer/`
- **Port**: 5001
- **Features**:
  - NLP-powered skill extraction using spaCy
  - Career domain prediction
  - Learning gap identification
  - Personality trait analysis
  - Local SQLite database for analysis history

### 2. Backend API (Node.js/Express)
- **Location**: `skillbridge-backend/`
- **Port**: 5002
- **Features**:
  - User authentication and authorization
  - Resume upload and management
  - Chat functionality
  - Analytics and dashboard data
  - MongoDB integration

### 3. Frontend (React)
- **Location**: `skillbridge-frontend/`
- **Port**: 5173 (Vite dev server)
- **Features**:
  - Modern React with Vite
  - Tailwind CSS for styling
  - Dark mode support
  - Responsive design
  - Real-time updates

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-project
   ```

2. **Start all services**
   ```bash
   # Windows
   start-services.bat
   
   # Or manually:
   # Terminal 1: Python API
   cd resume-analyzer
   python app.py
   
   # Terminal 2: Backend
   cd skillbridge-backend
   npm install
   npm start
   
   # Terminal 3: Frontend
   cd skillbridge-frontend
   npm install
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5002
   - Python API: http://localhost:5001

## 📁 Project Structure

```
college-project/
├── resume-analyzer/           # Python Flask API
│   ├── app.py                # Main application
│   ├── config.py             # Configuration constants
│   ├── requirements.txt      # Python dependencies
│   └── venv/                 # Virtual environment
├── skillbridge-backend/      # Node.js Backend
│   ├── controllers/          # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   └── server.js            # Main server file
├── skillbridge-frontend/    # React Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   └── utils/          # Utility functions
│   └── package.json
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── start-services.bat      # Windows startup script
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in the respective directories:

**skillbridge-backend/.env**
```env
MONGODB_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your-jwt-secret
PORT=5002
NODE_ENV=development
```

**resume-analyzer/.env**
```env
FLASK_ENV=development
FLASK_DEBUG=1
```

## 🚀 API Endpoints

### Python API (Port 5001)
- `POST /analyze-resume` - Analyze resume text
- `GET /health` - Health check
- `GET /history` - Get analysis history
- `GET /user-stats` - Get user statistics

### Backend API (Port 5002)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/resume/upload` - Upload resume
- `GET /api/dashboard/analytics` - Dashboard analytics
- `POST /api/chat/send` - Send chat message

## 🧹 Recent Optimizations

### Code Cleanup
- ✅ Removed unnecessary test files and documentation
- ✅ Consolidated large constants into separate config file
- ✅ Optimized skill extraction algorithm
- ✅ Added log rotation to prevent large log files
- ✅ Removed unused React components
- ✅ Added comprehensive .gitignore

### Performance Improvements
- ✅ Optimized Python skill extraction with early exits
- ✅ Reduced redundant database queries
- ✅ Improved frontend component structure
- ✅ Added proper error handling and logging

### File Size Reduction
- ✅ Removed 95KB log file
- ✅ Deleted unused test files
- ✅ Removed redundant documentation
- ✅ Cleaned up Python cache files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation in each component directory
- Review the API endpoints documentation
- Check the console logs for debugging information 