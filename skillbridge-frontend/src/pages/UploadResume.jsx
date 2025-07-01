import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '../services/resumeService';
import { analyzeResumeWithProgress } from '../services/analyzeService';
import { useAuth } from '../context/AuthContext';
import { formatToNepaliRupees } from '../utils/nepalLocalization';

const UploadIcon = () => (
  <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 transition-colors duration-300" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path
      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FileInfo = ({ file, onClear }) => (
  <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm transition-colors duration-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300">
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="ml-4">
          <p className="text-sm font-semibold text-gray-800 dark:text-white transition-colors duration-300">{file.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{ (file.size / 1024 / 1024).toFixed(2) } MB</p>
        </div>
      </div>
      <button onClick={onClear} className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);

const StatusTracker = ({ status, message }) => {
  const steps = ['Uploading', 'Analyzing', 'Success'];
  const currentStepIndex = status === 'uploading' ? 0 : status === 'analyzing' ? 1 : 2;

  if (status === 'idle' || status === 'error') return null;

  return (
    <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm transition-colors duration-300">
      <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3 text-center transition-colors duration-300">{message}</p>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              index < currentStepIndex ? 'bg-green-500 dark:bg-green-400 text-white' : 
              index === currentStepIndex ? 'bg-blue-500 dark:bg-blue-400 text-white animate-pulse' : 
              'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
            }`}>
              {index < currentStepIndex ? '✓' : index + 1}
            </div>
            <span className={`ml-2 text-sm transition-colors duration-300 ${
              index <= currentStepIndex ? 'text-gray-700 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'
            }`}>{step}</span>
            {index < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-600 mx-2 transition-colors duration-300"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  
  const [uploadedResume, setUploadedResume] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState('');

  const fileInputRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxFileSize = 5 * 1024 * 1024;

  useEffect(() => {
    if (file) {
      setError('');
      setUploadedResume(null);
    }
  }, [file]);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!allowedFileTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please use PDF, DOC, or DOCX.');
      return;
    }
    if (selectedFile.size > maxFileSize) {
      setError(`File too large. Max size is 5MB.`);
      return;
    }
    setFile(selectedFile);
  };

  const handleDragEvents = (e, over) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(over);
  };
  
  const handleDrop = (e) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    if (!isAuthenticated) {
      setError('You must be logged in to upload a resume.');
      return;
    }
    
    setError('');
    setIsUploading(true);
    setUploadedResume(null);

    try {
      const response = await resumeService.uploadResume(file);
      if (response.success && response.data) {
        setUploadedResume(response.data);
        setFile(null); // Clear the selected file
      } else {
        throw new Error(response.message || 'Server failed to process the upload.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError('Upload error: ' + err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.error) {
        setError('Upload error: ' + err.response.data.error);
      } else {
        setError(err.message || 'An unexpected error occurred during upload.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedResume?._id) {
      setError('No uploaded resume found to analyze.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    console.log('🔍 Starting analysis for resume:', uploadedResume._id);
    
    try {
      await analyzeResumeWithProgress(uploadedResume._id, (status, data, errorMsg) => {
        console.log('📊 Analysis progress:', { status, hasData: !!data, errorMsg });
        switch (status) {
          case 'processing':
            setAnalysisMessage('Analyzing skills and experience...');
            break;
          case 'completed':
            setAnalysisMessage('Analysis complete! Redirecting...');
            console.log('✅ Analysis completed successfully, redirecting...');
            setTimeout(() => {
              navigate(`/results/${uploadedResume._id}`);
            }, 1500);
            break;
          case 'failed':
            console.error('❌ Analysis failed:', errorMsg);
            setError('Analysis error: ' + (errorMsg || 'The analysis process failed.'));
            setIsAnalyzing(false);
            break;
        }
      });
    } catch (err) {
      console.error('❌ Analysis error caught:', err);
      console.error('❌ Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response && err.response.data && err.response.data.message) {
        setError('Analysis error: ' + err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.error) {
        setError('Analysis error: ' + err.response.data.error);
      } else {
        setError(err.message || 'An unexpected error occurred during analysis.');
      }
    } finally {
      setTimeout(() => setIsAnalyzing(false), 1600);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 sm:py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl transition-colors duration-300">Resume Analyzer</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Get instant AI-powered feedback on your skills and career path.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 transition-colors duration-300">Upload Your Resume</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors duration-300">Step 1: Upload your file. Step 2: Analyze it.</p>
              
              {!uploadedResume && (
                <>
                  <div
                    onDragEnter={(e) => handleDragEvents(e, true)}
                    onDragLeave={(e) => handleDragEvents(e, false)}
                    onDragOver={(e) => handleDragEvents(e, true)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                      isDragOver 
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <UploadIcon />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                          <span className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200">
                            Click to upload
                          </span>{' '}
                          or drag and drop
                        </span>
                        <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          PDF, DOC, or DOCX (MAX. 5MB)
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        ref={fileInputRef}
                      />
                    </div>
                  </div>

                  {file && <FileInfo file={file} onClear={() => setFile(null)} />}

                  {error && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md transition-colors duration-300">
                      {error}
                    </div>
                  )}

                  <div className="mt-6">
                    <button
                      onClick={handleUpload}
                      disabled={!file || isUploading}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </div>
                      ) : (
                        'Upload Resume'
                      )}
                    </button>
                  </div>
                </>
              )}

              {uploadedResume && (
                <>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-600 rounded-lg transition-colors duration-300">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 transition-colors duration-300">
                          Resume uploaded successfully!
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300 transition-colors duration-300">
                          {uploadedResume.originalName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <StatusTracker 
                    status={isAnalyzing ? 'analyzing' : 'idle'} 
                    message={analysisMessage || 'Ready to analyze your resume'} 
                  />

                  {error && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md transition-colors duration-300">
                      {error}
                    </div>
                  )}

                  <div className="mt-6">
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </div>
                      ) : (
                        'Analyze Resume'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-300">What you'll get:</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white transition-colors duration-300">Skill Analysis</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Extract and analyze your technical and soft skills</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white transition-colors duration-300">Career Recommendations</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Get personalized career path suggestions</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white transition-colors duration-300">Learning Paths</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Discover courses to improve your skills</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                      <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white transition-colors duration-300">Salary Insights</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Get salary expectations in Nepali Rupees (NPR)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                      <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white transition-colors duration-300">Nepal Job Market</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Tailored for the Nepali job market and opportunities</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
                      <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white transition-colors duration-300">Detailed Report</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Download a comprehensive PDF report with Nepal-specific insights</p>
                  </div>
                </div>
              </div>

              {/* Nepal-specific information */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm">🇳🇵</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Optimized for Nepal
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Our analysis is tailored for the Nepali job market, including local salary ranges, 
                      industry trends, and career opportunities specific to Nepal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResume; 