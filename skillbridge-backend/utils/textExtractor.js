const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Validate extracted text content
 * @param {string} text - Extracted text
 * @param {string} fileType - Type of file (PDF, DOCX, etc.)
 * @returns {Object} - Validation result
 */
const validateExtractedText = (text, fileType) => {
    if (!text || typeof text !== 'string') {
        return {
            isValid: false,
            error: 'No text content extracted from file'
        };
    }

    const trimmedText = text.trim();
    
    if (trimmedText.length === 0) {
        return {
            isValid: false,
            error: 'Extracted text is empty'
        };
    }

    // Check for minimum content length
    if (trimmedText.length < 50) {
        return {
            isValid: false,
            error: 'Extracted text is too short. The file may be corrupted or contain only images.'
        };
    }

    // Check for common resume keywords to ensure it's actually a resume
    const resumeKeywords = [
        'experience', 'education', 'skills', 'work', 'job', 'position',
        'university', 'college', 'degree', 'certification', 'project',
        'responsibilities', 'achievements', 'employment', 'career'
    ];

    const textLower = trimmedText.toLowerCase();
    const foundKeywords = resumeKeywords.filter(keyword => textLower.includes(keyword));
    
    if (foundKeywords.length < 2) {
        return {
            isValid: false,
            error: 'File does not appear to be a resume. Please upload a valid resume document.'
        };
    }

    return {
        isValid: true,
        text: trimmedText,
        keywordCount: foundKeywords.length
    };
};

/**
 * Extract text content from a PDF file with improved error handling
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
const extractTextFromPDF = async (filePath) => {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error('PDF file not found');
        }

        // Check file size
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
            throw new Error('PDF file is empty');
        }

        if (stats.size > 10 * 1024 * 1024) { // 10MB limit
            throw new Error('PDF file is too large (max 10MB)');
        }

        // Read the PDF file
        const dataBuffer = fs.readFileSync(filePath);
        
        // Parse the PDF with options for better compatibility
        const options = {
            normalizeWhitespace: true,
            disableCombineTextItems: false
        };
        
        const data = await pdfParse(dataBuffer, options);
        
        // Validate extracted text
        const validation = validateExtractedText(data.text, 'PDF');
        if (!validation.isValid) {
            throw new Error(validation.error);
        }
        
        console.log(`✅ PDF text extraction successful: ${validation.text.length} characters, ${validation.keywordCount} resume keywords found`);
        return validation.text;
        
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        
        // Provide specific error messages for common issues
        if (error.message.includes('bad XRef entry')) {
            throw new Error('PDF file is corrupted or has an invalid structure. Please try uploading a different PDF file.');
        } else if (error.message.includes('Invalid PDF')) {
            throw new Error('Invalid PDF format. Please ensure the file is a valid PDF document.');
        } else if (error.message.includes('Password')) {
            throw new Error('PDF is password protected. Please remove the password and try again.');
        } else if (error.message.includes('No text content')) {
            throw new Error('PDF appears to be an image or scanned document. Please upload a text-based PDF or convert scanned documents to text.');
        } else {
            throw new Error(`Failed to extract text from PDF: ${error.message}`);
        }
    }
};

/**
 * Extract text content from a DOCX file with improved validation
 * @param {string} filePath - Path to the DOCX file
 * @returns {Promise<string>} - Extracted text content
 */
const extractTextFromDOCX = async (filePath) => {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error('DOCX file not found');
        }

        const result = await mammoth.extractRawText({ path: filePath });
        
        // Validate extracted text
        const validation = validateExtractedText(result.value, 'DOCX');
        if (!validation.isValid) {
            throw new Error(validation.error);
        }
        
        console.log(`✅ DOCX text extraction successful: ${validation.text.length} characters, ${validation.keywordCount} resume keywords found`);
        return validation.text;
        
    } catch (error) {
        console.error('Error extracting text from DOCX:', error);
        throw new Error(`Failed to extract text from DOCX: ${error.message}`);
    }
};

/**
 * Extract text content from a plain text file with validation
 * @param {string} filePath - Path to the text file
 * @returns {Promise<string>} - Extracted text content
 */
const extractTextFromTXT = async (filePath) => {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error('Text file not found');
        }

        const text = fs.readFileSync(filePath, 'utf8');
        
        // Validate extracted text
        const validation = validateExtractedText(text, 'TXT');
        if (!validation.isValid) {
            throw new Error(validation.error);
        }
        
        console.log(`✅ TXT text extraction successful: ${validation.text.length} characters, ${validation.keywordCount} resume keywords found`);
        return validation.text;
        
    } catch (error) {
        console.error('Error extracting text from TXT:', error);
        throw new Error(`Failed to extract text from TXT: ${error.message}`);
    }
};

/**
 * Extract text from a file based on its MIME type with comprehensive validation
 * @param {string} filePath - Path to the file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - Extracted text content
 */
const extractTextFromFile = async (filePath, mimeType) => {
    try {
        console.log(`📄 Extracting text from file: ${filePath}, MIME type: ${mimeType}`);
        
        // Validate file exists
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found on server');
        }

        let extractedText;
        
        if (mimeType === 'application/pdf') {
            extractedText = await extractTextFromPDF(filePath);
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            extractedText = await extractTextFromDOCX(filePath);
        } else if (mimeType === 'text/plain' || mimeType === 'text/txt') {
            extractedText = await extractTextFromTXT(filePath);
        } else if (mimeType === 'application/msword') {
            throw new Error('DOC file parsing not yet implemented. Please convert to PDF or DOCX format.');
        } else {
            throw new Error(`Unsupported file type: ${mimeType}. Please upload a PDF, DOCX, or TXT file.`);
        }

        // Final validation
        const finalValidation = validateExtractedText(extractedText, 'FINAL');
        if (!finalValidation.isValid) {
            throw new Error(finalValidation.error);
        }

        console.log(`✅ Text extraction completed successfully: ${extractedText.length} characters extracted`);
        return extractedText;
        
    } catch (error) {
        console.error('❌ Error extracting text from file:', error);
        throw error;
    }
};

module.exports = {
    extractTextFromPDF,
    extractTextFromDOCX,
    extractTextFromTXT,
    extractTextFromFile,
    validateExtractedText
}; 