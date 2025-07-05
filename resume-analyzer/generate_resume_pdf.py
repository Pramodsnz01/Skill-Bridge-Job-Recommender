from fpdf import FPDF

resume_text = '''
John Doe
Email: john.doe@email.com
Phone: 123-456-7890

Professional Summary:
Motivated software engineer with 2 years of experience in web development and data analysis. Passionate about building scalable applications and learning new technologies.

Skills:
- Python
- JavaScript
- HTML
- CSS
- SQL
- Git
- Agile
- Data Analysis
- Pandas
- NumPy

Experience:
Software Engineer, Tech Solutions Inc. (2022 - Present)
- Developed web applications using Python and JavaScript.
- Collaborated with cross-functional teams to deliver projects on time.
- Utilized SQL and Pandas for data analysis tasks.

Education:
Bachelor of Science in Computer Science, State University (2018 - 2022)

Projects:
- Personal Portfolio Website (React, HTML, CSS)
- Data Analysis on Sales Data (Python, Pandas, NumPy)

Certifications:
- None

Interests:
- Open source
- Machine learning

# Note: This resume is intentionally missing key skills like Docker, Kubernetes, AWS, TensorFlow, and others relevant to Software Development and Data Science domains.
'''

pdf = FPDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.set_font("Arial", size=12)

for line in resume_text.split('\n'):
    pdf.cell(0, 10, line, ln=True)

pdf.output("test_resume_for_gap.pdf")
print("PDF generated: test_resume_for_gap.pdf") 