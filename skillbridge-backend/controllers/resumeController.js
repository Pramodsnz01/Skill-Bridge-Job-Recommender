const Resume = require('../models/Resume');
const path = require('path');
const fs = require('fs');

// Upload resume
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            console.error('Validation failed: No file uploaded');
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
                errors: ['No file uploaded']
            });
        }

        // Create resume record in database
        const resume = new Resume({
            user: req.user._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype
        });

        await resume.save();

        res.status(201).json({
            success: true,
            message: 'Resume uploaded successfully',
            data: {
                _id: resume._id,
                filename: resume.filename,
                originalName: resume.originalName,
                fileSize: resume.fileSize,
                uploadDate: resume.uploadDate,
                status: resume.status
            }
        });

    } catch (error) {
        console.error('Upload resume error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading resume'
        });
    }
};

// Get user's resumes
const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: resumes
        });

    } catch (error) {
        console.error('Get user resumes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching resumes'
        });
    }
};

// Delete resume
const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        
        const resume = await Resume.findOne({ 
            _id: id, 
            user: req.user._id 
        });

        if (!resume) {
            console.error('Delete resume failed: Resume not found for id', id);
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
                errors: ['Resume not found']
            });
        }

        // Delete file from filesystem
        if (fs.existsSync(resume.filePath)) {
            fs.unlinkSync(resume.filePath);
        }

        // Delete from database
        await Resume.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Resume deleted successfully'
        });

    } catch (error) {
        console.error('Delete resume error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting resume'
        });
    }
};

module.exports = {
    uploadResume,
    getUserResumes,
    deleteResume
}; 