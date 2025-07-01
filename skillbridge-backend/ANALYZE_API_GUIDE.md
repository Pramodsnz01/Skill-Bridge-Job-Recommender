# Resume Analysis API Guide

## Overview

The Resume Analysis API provides endpoints to analyze uploaded resumes using AI-powered text extraction and analysis. The system extracts text from PDF files, sends it to a Python ML API for analysis, and stores the results in MongoDB.

## Endpoints

### 1. Analyze Resume
**POST** `/api/analyze/:id`

Analyzes a resume by ID, extracting text and sending it to the Python ML API for analysis.

#### Parameters
- `id` (path parameter): Resume ID to analyze

#### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Request Body
None required

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Resume analysis completed successfully",
  "data": {
    "_id": "analysis_id",
    "resume": "resume_id",
    "user": "user_id",
    "extractedSkills": ["python", "javascript", "react"],
    "experienceYears": {
      "totalYears": 5,
      "mentions": [3, 2]
    },
    "keywords": ["software", "development", "web"],
    "predictedCareerDomains": ["Software Development", "Data Science"],
    "learningGaps": [
      {
        "domain": "Software Development",
        "missingSkills": ["docker", "kubernetes"],
        "priority": "High"
      }
    ],
    "analysisSummary": {
      "totalSkillsFound": 15,
      "yearsExperience": 5,
      "topDomain": "Software Development",
      "gapsIdentified": 2
    },
    "status": "completed",
    "processingTime": 2500
  },
  "processingTime": 2500
}
```

**Cached Response (200)**
```json
{
  "success": true,
  "message": "Analysis retrieved from cache",
  "data": { /* analysis data */ },
  "cached": true
}
```

**Error Responses**

- **404**: Resume not found
- **400**: Text extraction failed
- **503**: Analysis service unavailable/timeout
- **500**: Internal server error

### 2. Get Analysis Results
**GET** `/api/analyze/:id`

Retrieves the latest analysis results for a resume.

#### Parameters
- `id` (path parameter): Resume ID

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Response

**Success (200)**
```json
{
  "success": true,
  "data": {
    /* Same structure as analyze response data */
  }
}
```

**Error Responses**
- **404**: Resume or analysis not found
- **500**: Internal server error

## Error Handling

### Timeout Handling
- Request timeout: 30 seconds
- Returns 503 status with timeout message

### ML Service Failures
- Connection errors
- Service unavailable
- Analysis processing errors
- All return appropriate error messages

### File Processing Errors
- PDF parsing failures
- Unsupported file types
- Empty text content
- File not found errors

## Data Models

### Analysis Schema
```javascript
{
  resume: ObjectId,           // Reference to Resume
  user: ObjectId,            // Reference to User
  extractedSkills: [String], // Array of extracted skills
  experienceYears: {
    totalYears: Number,
    mentions: [Number]
  },
  keywords: [String],        // Important keywords
  predictedCareerDomains: [String], // Career domain predictions
  learningGaps: [{
    domain: String,
    missingSkills: [String],
    priority: String // 'High', 'Medium', 'Low'
  }],
  analysisSummary: {
    totalSkillsFound: Number,
    yearsExperience: Number,
    topDomain: String,
    gapsIdentified: Number
  },
  status: String,            // 'pending', 'processing', 'completed', 'failed'
  errorMessage: String,      // Error details if failed
  processingTime: Number     // Processing time in milliseconds
}
```

## Configuration

### Environment Variables
```bash
PYTHON_API_URL=http://localhost:5000  # Python ML API URL
MONGODB_URI=mongodb://localhost:27017/skillbridge
```

### Timeouts
- Request timeout: 30 seconds
- Analysis cache: 24 hours

## Usage Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

// Analyze a resume
const analyzeResume = async (resumeId, token) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/analyze/${resumeId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Analysis failed:', error.response?.data || error.message);
    throw error;
  }
};

// Get analysis results
const getAnalysis = async (resumeId, token) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/analyze/${resumeId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to get analysis:', error.response?.data || error.message);
    throw error;
  }
};
```

### cURL Examples
```bash
# Analyze resume
curl -X POST http://localhost:5000/api/analyze/resume_id \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json"

# Get analysis results
curl -X GET http://localhost:5000/api/analyze/resume_id \
  -H "Authorization: Bearer your_token"
```

## Testing

### Test Script
Use the provided `test-analyze.js` script to test the endpoints:

```bash
node test-analyze.js
```

### Manual Testing
1. Upload a resume using the upload endpoint
2. Get the resume ID from the response
3. Use the analyze endpoint with the resume ID
4. Check the analysis results

## Dependencies

### Required Packages
- `axios`: HTTP client for Python API communication
- `pdf-parse`: PDF text extraction
- `mongoose`: MongoDB ODM
- `express`: Web framework

### Python API Requirements
- Flask server running on configured port
- `/analyze-resume` endpoint accepting POST requests
- JSON response with analysis data

## Security Considerations

- All endpoints require JWT authentication
- User can only access their own resumes
- File path validation prevents directory traversal
- Request size limits prevent abuse
- Timeout limits prevent hanging requests

## Monitoring

### Logs to Monitor
- Text extraction errors
- Python API communication failures
- Processing time metrics
- Error rates and types

### Health Checks
- Python API availability
- MongoDB connection status
- File system access
- Memory usage

## Troubleshooting

### Common Issues

1. **Python API not responding**
   - Check if Python server is running
   - Verify PYTHON_API_URL configuration
   - Check network connectivity

2. **PDF parsing errors**
   - Verify PDF file integrity
   - Check file permissions
   - Ensure pdf-parse package is installed

3. **MongoDB connection issues**
   - Verify MongoDB is running
   - Check connection string
   - Ensure proper authentication

4. **Timeout errors**
   - Increase REQUEST_TIMEOUT if needed
   - Check Python API performance
   - Monitor server resources 