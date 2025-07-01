import jsPDF from 'jspdf';
import { formatToNepaliRupees } from '../utils/nepalLocalization';

class PDFService {
  constructor() {
    this.doc = null;
    this.pageWidth = 210;
    this.pageHeight = 297;
    this.margin = 20;
    this.lineHeight = 7;
    this.currentY = 0;
  }

  generateAnalysisReport(analysis, user) {
    this.doc = new jsPDF();
    this.currentY = this.margin;

    // Add header
    this.addHeader();
    
    // Add user information
    this.addUserInfo(user);
    
    // Add summary statistics
    this.addSummaryStats(analysis);
    
    // Add extracted skills
    this.addExtractedSkills(analysis);
    
    // Add career recommendations
    this.addCareerRecommendations(analysis);
    
    // Add learning gaps
    this.addLearningGaps(analysis);
    
    // Add suggested careers (mock data)
    this.addSuggestedCareers();
    
    // Add learning paths (mock data)
    this.addLearningPaths();
    
    // Add footer
    this.addFooter();

    return this.doc;
  }

  addHeader() {
    // Add background color for header
    this.doc.setFillColor(44, 62, 80);
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');
    
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Resume Analysis Report', this.pageWidth / 2, 25, { align: 'center' });
    
    this.currentY = 50;
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, this.pageWidth / 2, this.currentY, { align: 'center' });
    
    this.currentY += 20;
  }

  addSectionHeader(title) {
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(44, 62, 80);
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 10;

    // Add underline
    this.doc.setDrawColor(44, 62, 80);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 15;
  }

  addUserInfo(user) {
    this.addSectionHeader('User Information');
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(60, 60, 60);
    
    const userInfo = [
      `Name: ${user?.name || 'Not provided'}`,
      `Email: ${user?.email || 'Not provided'}`,
      `Analysis Date: ${new Date().toLocaleDateString()}`,
    ];

    userInfo.forEach(info => {
      this.doc.text(info, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    });

    this.currentY += 10;
  }

  addSummaryStats(analysis) {
    this.addSectionHeader('Summary Statistics');
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(60, 60, 60);

    const stats = [
      { label: 'Total Skills Found', value: analysis.analysisSummary?.totalSkillsFound || analysis.extractedSkills?.length || 0, color: [52, 152, 219] },
      { label: 'Years of Experience', value: analysis.analysisSummary?.yearsExperience || 'N/A', color: [46, 204, 113] },
      { label: 'Learning Gaps', value: analysis.analysisSummary?.gapsIdentified || analysis.learningGaps?.length || 0, color: [155, 89, 182] },
      { label: 'Career Domains', value: analysis.predictedCareerDomains?.length || 0, color: [230, 126, 34] },
    ];

    // Create a visual stats grid
    const colWidth = (this.pageWidth - 2 * this.margin) / 2;
    const rowHeight = 25;
    let col = 0;
    let row = 0;

    stats.forEach((stat, index) => {
      const x = this.margin + (col * colWidth);
      const y = this.currentY + (row * rowHeight);
      
      // Draw background rectangle
      this.doc.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
      this.doc.rect(x, y, colWidth - 5, rowHeight - 5, 'F');
      
      // Add text
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(stat.value.toString(), x + 5, y + 10);
      
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(stat.label, x + 5, y + 18);
      
      col++;
      if (col >= 2) {
        col = 0;
        row++;
      }
    });

    this.currentY += (row + 1) * rowHeight + 15;
  }

  addExtractedSkills(analysis) {
    this.addSectionHeader('Extracted Skills');
    
    if (!analysis.extractedSkills || analysis.extractedSkills.length === 0) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('No skills were extracted from the resume.', this.margin, this.currentY);
      this.currentY += 15;
      return;
    }

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(60, 60, 60);

    const skillsPerLine = 3;
    const skillWidth = (this.pageWidth - 2 * this.margin) / skillsPerLine;
    
    for (let i = 0; i < analysis.extractedSkills.length; i += skillsPerLine) {
      const lineSkills = analysis.extractedSkills.slice(i, i + skillsPerLine);
      
      lineSkills.forEach((skill, index) => {
        const x = this.margin + (index * skillWidth);
        
        // Draw skill tag background
        this.doc.setFillColor(52, 152, 219);
        this.doc.roundedRect(x, this.currentY - 3, skillWidth - 5, 8, 2, 2, 'F');
        
        // Add skill text
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(8);
        this.doc.text(skill, x + 3, this.currentY + 2);
      });
      
      this.currentY += 12;
      
      // Check if we need a new page
      if (this.currentY > this.pageHeight - 50) {
        this.doc.addPage();
        this.currentY = this.margin;
      }
    }

    this.currentY += 10;
  }

  addCareerRecommendations(analysis) {
    this.addSectionHeader('Career Recommendations');
    
    if (!analysis.predictedCareerDomains || analysis.predictedCareerDomains.length === 0) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('No career domains were identified.', this.margin, this.currentY);
      this.currentY += 15;
      return;
    }

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(60, 60, 60);

    analysis.predictedCareerDomains.forEach((domain, index) => {
      // Check if we need a new page
      if (this.currentY > this.pageHeight - 50) {
        this.doc.addPage();
        this.currentY = this.margin;
      }

      // Draw domain box
      this.doc.setFillColor(155, 89, 182);
      this.doc.rect(this.margin, this.currentY - 3, this.pageWidth - 2 * this.margin, 12, 'F');
      
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(255, 255, 255);
      this.doc.text(`${index + 1}. ${domain}`, this.margin + 5, this.currentY + 5);
      
      this.currentY += 20;
    });

    this.currentY += 10;
  }

  addLearningGaps(analysis) {
    this.addSectionHeader('Learning Gaps & Recommendations');
    
    if (!analysis.learningGaps || analysis.learningGaps.length === 0) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('No significant learning gaps were identified.', this.margin, this.currentY);
      this.currentY += 15;
      return;
    }

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(60, 60, 60);

    analysis.learningGaps.forEach((gap, index) => {
      // Check if we need a new page
      if (this.currentY > this.pageHeight - 80) {
        this.doc.addPage();
        this.currentY = this.margin;
      }

      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${index + 1}. ${gap.domain} (${gap.priority} Priority)`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('Missing Skills:', this.margin + 5, this.currentY);
      this.currentY += this.lineHeight;

      if (gap.missingSkills && gap.missingSkills.length > 0) {
        gap.missingSkills.forEach(skill => {
          this.doc.text(`   • ${skill}`, this.margin + 10, this.currentY);
          this.currentY += this.lineHeight;
        });
      }

      this.currentY += 5;
    });

    this.currentY += 10;
  }

  addSuggestedCareers() {
    this.addSectionHeader('Suggested Careers');
    
    const suggestedCareers = [
      {
        title: 'Full Stack Developer',
        company: 'Tech Companies',
        salary: { min: 80000, max: 120000 },
        match: 95,
        skills: ['JavaScript', 'React', 'Node.js', 'Python']
      },
      {
        title: 'Data Scientist',
        company: 'Analytics Firms',
        salary: { min: 90000, max: 140000 },
        match: 88,
        skills: ['Python', 'Machine Learning', 'Statistics', 'SQL']
      },
      {
        title: 'DevOps Engineer',
        company: 'Cloud Platforms',
        salary: { min: 85000, max: 130000 },
        match: 82,
        skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD']
      }
    ];

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(60, 60, 60);

    suggestedCareers.forEach((career, index) => {
      if (this.currentY > this.pageHeight - 60) {
        this.doc.addPage();
        this.currentY = this.margin;
      }

      // Career title
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(11);
      this.doc.text(`${index + 1}. ${career.title}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;

      // Company and salary
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      this.doc.text(`Company: ${career.company}`, this.margin + 5, this.currentY);
      
      // Format salary in Nepali Rupees
      const salaryRange = `${formatToNepaliRupees(career.salary.min)} - ${formatToNepaliRupees(career.salary.max)}`;
      this.doc.text(`Salary: ${salaryRange}`, this.margin + 80, this.currentY);
      this.currentY += this.lineHeight;

      // Match percentage
      this.doc.text(`Match: ${career.match}%`, this.margin + 5, this.currentY);
      this.currentY += this.lineHeight;

      // Skills
      this.doc.text('Skills:', this.margin + 5, this.currentY);
      this.currentY += this.lineHeight;
      
      career.skills.forEach(skill => {
        this.doc.text(`   • ${skill}`, this.margin + 10, this.currentY);
        this.currentY += this.lineHeight;
      });

      this.currentY += 5;
    });

    this.currentY += 10;
  }

  addLearningPaths() {
    this.addSectionHeader('Recommended Learning Paths');
    
    const learningPaths = [
      {
        title: 'Advanced React Development',
        platform: 'Udemy',
        duration: '20 hours',
        level: 'Intermediate',
        price: 2999, // Price in NPR
        rating: 4.8,
        skills: ['React Hooks', 'Context API', 'Performance Optimization']
      },
      {
        title: 'Machine Learning Fundamentals',
        platform: 'Coursera',
        duration: '12 weeks',
        level: 'Beginner',
        price: 0, // Free course
        rating: 4.6,
        skills: ['Python', 'Scikit-learn', 'Data Preprocessing']
      },
      {
        title: 'AWS Cloud Practitioner',
        platform: 'AWS Training',
        duration: '15 hours',
        level: 'Beginner',
        price: 0, // Free course
        rating: 4.7,
        skills: ['AWS Services', 'Cloud Architecture', 'Security']
      }
    ];

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(60, 60, 60);

    learningPaths.forEach((path, index) => {
      if (this.currentY > this.pageHeight - 80) {
        this.doc.addPage();
        this.currentY = this.margin;
      }

      // Course title
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(11);
      this.doc.text(`${index + 1}. ${path.title}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;

      // Course details
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      this.doc.text(`Platform: ${path.platform}`, this.margin + 5, this.currentY);
      this.doc.text(`Duration: ${path.duration}`, this.margin + 60, this.currentY);
      this.currentY += this.lineHeight;

      this.doc.text(`Level: ${path.level}`, this.margin + 5, this.currentY);
      
      // Format price in Nepali Rupees
      const priceText = path.price === 0 ? 'Free' : formatToNepaliRupees(path.price);
      this.doc.text(`Price: ${priceText}`, this.margin + 60, this.currentY);
      this.currentY += this.lineHeight;

      this.doc.text(`Rating: ${path.rating}/5`, this.margin + 5, this.currentY);
      this.currentY += this.lineHeight;

      // Skills covered
      this.doc.text('Skills Covered:', this.margin + 5, this.currentY);
      this.currentY += this.lineHeight;
      
      path.skills.forEach(skill => {
        this.doc.text(`   • ${skill}`, this.margin + 10, this.currentY);
        this.currentY += this.lineHeight;
      });

      this.currentY += 5;
    });

    this.currentY += 10;
  }

  addFooter() {
    const footerY = this.pageHeight - 20;
    
    // Add footer background
    this.doc.setFillColor(44, 62, 80);
    this.doc.rect(0, footerY - 5, this.pageWidth, 25, 'F');
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('Generated by SkillBridge Resume Analyzer', this.pageWidth / 2, footerY + 5, { align: 'center' });
    
    // Add page numbers
    const pageCount = this.doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.text(`Page ${i} of ${pageCount}`, this.pageWidth - this.margin, footerY + 5, { align: 'right' });
    }
  }

  downloadReport(analysis, user, filename = 'resume-analysis-report.pdf') {
    const doc = this.generateAnalysisReport(analysis, user);
    doc.save(filename);
  }
}

export default new PDFService(); 