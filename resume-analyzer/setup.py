#!/usr/bin/env python3
"""
Setup script for Resume Analyzer Flask API
Automates the installation and setup process
"""

import os
import sys
import subprocess
import platform

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python version {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def create_virtual_environment():
    """Create a virtual environment"""
    if os.path.exists("venv"):
        print("✅ Virtual environment already exists")
        return True
    
    return run_command("python -m venv venv", "Creating virtual environment")

def activate_virtual_environment():
    """Activate virtual environment based on OS"""
    if platform.system() == "Windows":
        activate_script = "venv\\Scripts\\activate"
    else:
        activate_script = "source venv/bin/activate"
    
    print(f"📝 To activate virtual environment, run: {activate_script}")
    return activate_script

def install_dependencies():
    """Install Python dependencies"""
    # Determine the pip command based on OS
    if platform.system() == "Windows":
        pip_cmd = "venv\\Scripts\\pip"
    else:
        pip_cmd = "venv/bin/pip"
    
    return run_command(f"{pip_cmd} install -r requirements.txt", "Installing dependencies")

def download_spacy_model():
    """Download spaCy model"""
    if platform.system() == "Windows":
        python_cmd = "venv\\Scripts\\python"
    else:
        python_cmd = "venv/bin/python"
    
    return run_command(f"{python_cmd} -m spacy download en_core_web_sm", "Downloading spaCy model")

def create_sample_files():
    """Create sample files for testing"""
    print("📁 Creating sample files...")
    
    # Create a sample resume file
    sample_resume = """JOHN DOE
Software Developer
john.doe@email.com | (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software developer with 5 years of experience in web development, 
proficient in Python, JavaScript, React, and Node.js.

TECHNICAL SKILLS
Programming Languages: Python, JavaScript, Java, SQL
Frameworks: React, Node.js, Express.js, Django
Databases: MongoDB, PostgreSQL, MySQL
Cloud: AWS, Docker, Git

WORK EXPERIENCE
Senior Software Developer | TechCorp Inc. | 2020 - Present
• Developed web applications using React and Node.js
• Implemented RESTful APIs and microservices
• Collaborated with cross-functional teams

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2014 - 2018
"""
    
    with open("sample_resume.txt", "w", encoding="utf-8") as f:
        f.write(sample_resume)
    
    print("✅ Sample files created")

def main():
    """Main setup function"""
    print("🚀 Resume Analyzer Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create virtual environment
    if not create_virtual_environment():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Download spaCy model
    if not download_spacy_model():
        sys.exit(1)
    
    # Create sample files
    create_sample_files()
    
    # Get activation command
    activate_cmd = activate_virtual_environment()
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print(f"1. Activate virtual environment: {activate_cmd}")
    print("2. Start the Flask server: python app.py")
    print("3. Open test.html in your browser or run: python test_analyzer.py")
    print("\n🌐 The API will be available at: http://localhost:5000")
    print("📖 For more information, see README.md")

if __name__ == "__main__":
    main() 