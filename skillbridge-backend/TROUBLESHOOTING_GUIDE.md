# Resume Analysis Troubleshooting Guide

## Quick Start Checklist

### 1. **Environment Setup**
- [ ] Python Flask API is running on port 5001
- [ ] Node.js backend is running on port 5000
- [ ] MongoDB is running and accessible
- [ ] All dependencies are installed

### 2. **Dependencies Installation**

#### Node.js Backend
```bash
cd skillbridge-backend
npm install
npm install mammoth  # For DOCX support
```

#### Python Flask API
```bash
cd resume-analyzer
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 3. **Start Services**

#### Terminal 1 - Python API
```bash
cd resume-analyzer
python app.py
```

#### Terminal 2 - Node.js Backend
```bash
cd skillbridge-backend
npm run dev
```

#### Terminal 3 - Frontend
```bash
cd skillbridge-frontend
npm run dev
```

## Common Issues and Solutions

### Issue 1: "Analysis service unavailable"

**Symptoms:**
- Error message: "Analysis service unavailable"
- Analysis fails immediately

**Causes:**
1. Python Flask API not running
2. Wrong port configuration
3. Network connectivity issues

**Solutions:**
1. **Check if Python API is running:**
   ```bash
   curl http://localhost:5001/health
   ```

2. **Verify port configuration:**
   - Check `PYTHON_API_URL` in environment variables
   - Default should be `http://localhost:5001`

3. **Start Python API:**
   ```bash
   cd resume-analyzer
   python app.py
   ```

### Issue 2: "Failed to extract text from resume"

**Symptoms:**
- Error during text extraction
- Analysis fails at text extraction step

**Causes:**
1. Unsupported file format
2. Corrupted PDF file
3. Missing dependencies

**Solutions:**
1. **Check file format support:**
   - ✅ PDF files
   - ✅ DOCX files
   - ❌ DOC files (not supported)

2. **Install missing dependencies:**
   ```bash
   npm install mammoth pdf-parse
   ```

3. **Test with a simple PDF:**
   - Use a text-based PDF (not scanned)
   - Ensure PDF contains extractable text

### Issue 3: "Analysis request timed out"

**Symptoms:**
- Analysis takes too long
- Timeout error after 30 seconds

**Causes:**
1. Large PDF files
2. Python API processing slowly
3. Network latency

**Solutions:**
1. **Reduce file size:**
   - Compress PDF files
   - Use text-based PDFs instead of scanned

2. **Increase timeout (if needed):**
   ```javascript
   // In analyzeController.js
   const REQUEST_TIMEOUT = 60000; // 60 seconds
   ```

3. **Check Python API performance:**
   - Monitor CPU/memory usage
   - Consider optimizing the analysis algorithms

### Issue 4: "No text content extracted from resume"

**Symptoms:**
- Empty text after extraction
- Analysis fails with "No text content" error

**Causes:**
1. Scanned PDF (image-based)
2. Protected PDF
3. Corrupted file

**Solutions:**
1. **Use OCR for scanned PDFs:**
   - Convert scanned PDFs to text-based PDFs
   - Use online OCR tools

2. **Check PDF properties:**
   - Ensure PDF is not password-protected
   - Verify PDF contains selectable text

3. **Test with known good PDF:**
   - Use a simple text-based PDF for testing

### Issue 5: "Python API analysis failed"

**Symptoms:**
- Python API returns error
- Analysis fails during ML processing

**Causes:**
1. Missing spaCy model
2. Python dependencies not installed
3. Memory issues

**Solutions:**
1. **Install spaCy model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

2. **Check Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Test Python API directly:**
   ```bash
   curl -X POST http://localhost:5001/analyze-resume \
     -H "Content-Type: application/json" \
     -d '{"text": "John Doe, Software Developer, JavaScript, Python"}'
   ```

## Debugging Steps

### Step 1: Run the Test Script
```bash
cd skillbridge-backend
node test-analyze.js
```

This will test:
- Python API health
- Text extraction
- Full analysis flow
- Backend connectivity

### Step 2: Check Logs

#### Node.js Backend Logs
Look for these log messages:
```
Starting analysis for resume ID: xxx
Found resume: filename.pdf, file path: /path/to/file
Extracting text from file: /path/to/file
Successfully extracted 1234 characters from resume
Sending text to Python API: http://localhost:5001/analyze-resume
Python API response received: { skills: 5, domains: 2, gaps: 1 }
Analysis completed successfully for resume: xxx, processing time: 2500ms
```

#### Python API Logs
Check for:
- Flask server startup messages
- Request processing logs
- Error messages

### Step 3: Manual Testing

#### Test Python API Health
```bash
curl http://localhost:5001/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Resume Analyzer API is running"
}
```

#### Test Python API Analysis
```bash
curl -X POST http://localhost:5001/analyze-resume \
  -H "Content-Type: application/json" \
  -d '{
    "text": "John Doe, Software Developer with 5 years experience in JavaScript, React, Node.js, Python, and SQL. Worked at Tech Corp from 2019-2023."
  }'
```

Expected response:
```json
{
  "extracted_skills": ["javascript", "react", "node.js", "python", "sql"],
  "experience_years": {"total_years": 5, "mentions": [5]},
  "predicted_career_domains": ["Software Development"],
  "learning_gaps": [...],
  "analysis_summary": {...}
}
```

### Step 4: Check File Upload

#### Test File Upload
```bash
curl -X POST http://localhost:5000/api/resumes/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@test-resume.pdf"
```

## Performance Optimization

### 1. **File Size Limits**
- Maximum file size: 5MB
- Recommended: 1-2MB for faster processing

### 2. **Caching**
- Analysis results are cached for 24 hours
- Subsequent requests return cached results

### 3. **Timeout Configuration**
- Default timeout: 30 seconds
- Adjust based on your needs

## Monitoring and Logging

### 1. **Enable Debug Logging**
Add to your environment:
```bash
DEBUG=skillbridge:*
NODE_ENV=development
```

### 2. **Monitor Performance**
- Track processing times
- Monitor memory usage
- Check API response times

### 3. **Error Tracking**
- Log all errors with context
- Monitor error rates
- Set up alerts for critical failures

## Support

If you're still experiencing issues:

1. **Check the test script output** for specific error messages
2. **Verify all services are running** on correct ports
3. **Test with a simple PDF** to isolate the issue
4. **Check the logs** for detailed error information
5. **Ensure all dependencies** are properly installed

## Quick Fixes

### Reset Everything
```bash
# Stop all services
# Clear node_modules and reinstall
cd skillbridge-backend
rm -rf node_modules package-lock.json
npm install

# Clear Python virtual environment
cd ../resume-analyzer
rm -rf venv
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Restart all services
```

### Test with Minimal Setup
```bash
# Test Python API only
cd resume-analyzer
python app.py

# In another terminal
curl http://localhost:5001/health
```

This should help you identify and resolve the issues with your resume analysis feature. 