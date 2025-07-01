from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import nltk
import re
import json
from datetime import datetime
import os
import logging
import sqlite3
from contextlib import contextmanager
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('resume_analyzer.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

# SQLite Database Setup
DATABASE_PATH = 'resume_analysis_history.db'

def init_database():
    """Initialize SQLite database with required tables"""
    logger.info("DATABASE: Initializing SQLite database...")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Create analysis history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS analysis_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_identifier TEXT,
                analysis_data TEXT,
                analysis_summary TEXT,
                processing_time REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create user sessions table for anonymous tracking
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT UNIQUE,
                first_analysis_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_analysis_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                total_analyses INTEGER DEFAULT 1
            )
        ''')
        
        conn.commit()
        logger.info("DATABASE: Database initialized successfully")

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    try:
        yield conn
    finally:
        conn.close()

def save_analysis_to_history(user_identifier, analysis_data, analysis_summary, processing_time):
    """Save analysis result to local database"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO analysis_history 
                (user_identifier, analysis_data, analysis_summary, processing_time)
                VALUES (?, ?, ?, ?)
            ''', (
                user_identifier,
                json.dumps(analysis_data),
                json.dumps(analysis_summary),
                processing_time
            ))
            conn.commit()
            logger.info(f"DATABASE: Analysis saved for user {user_identifier}")
            return True
    except Exception as e:
        logger.error(f"DATABASE: Failed to save analysis: {e}")
        return False

def get_analysis_history(user_identifier, limit=10):
    """Retrieve analysis history for a user"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM analysis_history 
                WHERE user_identifier = ? 
                ORDER BY created_at DESC 
                LIMIT ?
            ''', (user_identifier, limit))
            
            rows = cursor.fetchall()
            history = []
            for row in rows:
                history.append({
                    'id': row['id'],
                    'analysis_summary': json.loads(row['analysis_summary']),
                    'processing_time': row['processing_time'],
                    'created_at': row['created_at']
                })
            
            logger.info(f"DATABASE: Retrieved {len(history)} analyses for user {user_identifier}")
            return history
    except Exception as e:
        logger.error(f"DATABASE: Failed to retrieve history: {e}")
        return []

def get_user_stats(user_identifier):
    """Get user statistics from analysis history"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT 
                    COUNT(*) as total_analyses,
                    AVG(processing_time) as avg_processing_time,
                    MIN(created_at) as first_analysis,
                    MAX(created_at) as last_analysis
                FROM analysis_history 
                WHERE user_identifier = ?
            ''', (user_identifier,))
            
            row = cursor.fetchone()
            if row:
                return {
                    'total_analyses': row['total_analyses'],
                    'avg_processing_time': round(row['avg_processing_time'], 2) if row['avg_processing_time'] else 0,
                    'first_analysis': row['first_analysis'],
                    'last_analysis': row['last_analysis']
                }
            return None
    except Exception as e:
        logger.error(f"DATABASE: Failed to get user stats: {e}")
        return None

def generate_session_id():
    """Generate a unique session ID for anonymous users"""
    return str(uuid.uuid4())

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    logger.info("Downloading NLTK punkt tokenizer...")
    nltk.download('punkt')

try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    logger.info("Downloading NLTK averaged perceptron tagger...")
    nltk.download('averaged_perceptron_tagger')

app = Flask(__name__)
CORS(app)

# Load spaCy model
try:
    logger.info("Loading spaCy model...")
    nlp = spacy.load("en_core_web_sm")
    logger.info("SUCCESS: spaCy model loaded successfully")
except OSError:
    logger.warning("spaCy model not found. Downloading...")
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")
    logger.info("SUCCESS: spaCy model downloaded and loaded successfully")

# Career domains and their associated keywords
CAREER_DOMAINS = {
    "Software Development": [
        "python", "javascript", "java", "c++", "react", "node.js", "angular", "vue.js",
        "sql", "mongodb", "aws", "docker", "kubernetes", "git", "agile", "scrum",
        "api", "rest", "graphql", "microservices", "machine learning", "ai", "typescript",
        "php", "ruby", "go", "rust", "swift", "kotlin", "flutter", "react native",
        "django", "flask", "express", "spring", "laravel", "rails", "asp.net",
        "postgresql", "mysql", "redis", "elasticsearch", "jenkins", "travis ci",
        "terraform", "ansible", "prometheus", "grafana", "nginx", "apache"
    ],
    "Data Science": [
        "python", "r", "sql", "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn",
        "tensorflow", "pytorch", "jupyter", "spark", "hadoop", "tableau", "power bi",
        "statistics", "machine learning", "deep learning", "nlp", "computer vision",
        "keras", "xgboost", "lightgbm", "plotly", "bokeh", "d3.js", "apache kafka",
        "elasticsearch", "mongodb", "cassandra", "hive", "pig", "hbase", "zookeeper",
        "airflow", "mlflow", "kubeflow", "fastai", "transformers", "bert", "gpt"
    ],
    "Marketing": [
        "digital marketing", "seo", "sem", "social media", "content marketing",
        "email marketing", "google analytics", "facebook ads", "google ads",
        "branding", "market research", "customer acquisition", "conversion optimization",
        "hubspot", "mailchimp", "buffer", "hootsuite", "canva", "figma", "adobe creative suite",
        "google tag manager", "hotjar", "mixpanel", "amplitude", "segment", "zapier",
        "influencer marketing", "affiliate marketing", "retargeting", "a/b testing",
        "customer journey mapping", "persona development", "competitive analysis"
    ],
    "Finance": [
        "financial modeling", "excel", "vba", "bloomberg", "reuters", "risk management",
        "investment analysis", "portfolio management", "accounting", "audit",
        "financial planning", "trading", "derivatives", "fixed income", "equity research",
        "credit analysis", "financial statement analysis", "valuation", "mergers and acquisitions",
        "private equity", "venture capital", "hedge funds", "investment banking",
        "sap", "oracle", "quickbooks", "xero", "sage", "matlab", "r", "python",
        "quantitative analysis", "algorithmic trading", "fintech", "blockchain"
    ],
    "Healthcare": [
        "patient care", "medical terminology", "epic", "cerner", "clinical research",
        "healthcare administration", "nursing", "pharmacy", "medical coding",
        "healthcare analytics", "telemedicine", "healthcare compliance", "hipaa",
        "electronic health records", "medical billing", "healthcare informatics",
        "clinical trials", "drug development", "medical devices", "healthcare policy",
        "public health", "epidemiology", "biostatistics", "medical imaging",
        "laboratory management", "healthcare quality", "patient safety", "healthcare finance"
    ],
    "Education": [
        "teaching", "curriculum development", "student assessment", "classroom management",
        "educational technology", "special education", "adult education", "online learning",
        "academic advising", "educational research", "instructional design", "lms",
        "blackboard", "canvas", "moodle", "google classroom", "zoom", "teams",
        "educational psychology", "learning analytics", "student engagement", "assessment design",
        "educational leadership", "school administration", "higher education", "k-12 education"
    ],
    "Design & Creative": [
        "ui/ux design", "graphic design", "web design", "product design", "illustration",
        "adobe creative suite", "photoshop", "illustrator", "indesign", "figma", "sketch",
        "xd", "prototyping", "wireframing", "user research", "usability testing",
        "design systems", "typography", "color theory", "brand identity", "logo design",
        "print design", "digital art", "3d modeling", "animation", "video editing",
        "motion graphics", "interaction design", "information architecture"
    ],
    "Sales & Business Development": [
        "sales", "business development", "account management", "customer relationship management",
        "crm", "salesforce", "hubspot crm", "pipedrive", "lead generation", "prospecting",
        "negotiation", "presentation skills", "consultative selling", "solution selling",
        "b2b sales", "b2c sales", "inside sales", "outside sales", "sales operations",
        "sales analytics", "sales forecasting", "territory management", "channel sales",
        "partnership development", "market expansion", "competitive analysis"
    ],
    "Human Resources": [
        "recruitment", "talent acquisition", "hr management", "employee relations",
        "performance management", "compensation and benefits", "training and development",
        "workforce planning", "hr analytics", "employee engagement", "diversity and inclusion",
        "hr policies", "labor law", "workplace safety", "hr information systems",
        "workday", "bamboo hr", "gusto", "adp", "payroll", "benefits administration",
        "organizational development", "change management", "hr strategy"
    ],
    "Operations & Supply Chain": [
        "operations management", "supply chain management", "logistics", "inventory management",
        "procurement", "vendor management", "quality assurance", "six sigma", "lean",
        "process improvement", "project management", "sap", "oracle", "erp systems",
        "warehouse management", "transportation", "distribution", "manufacturing",
        "production planning", "capacity planning", "demand forecasting", "cost analysis"
    ],
    "Cybersecurity": [
        "network security", "information security", "cybersecurity", "penetration testing",
        "vulnerability assessment", "security auditing", "incident response", "threat hunting",
        "security operations", "siem", "splunk", "qradar", "firewall", "ids/ips",
        "encryption", "authentication", "authorization", "compliance", "gdpr", "sox",
        "pci dss", "nist", "iso 27001", "ethical hacking", "malware analysis",
        "digital forensics", "security architecture", "zero trust"
    ],
    "Cloud & DevOps": [
        "aws", "azure", "google cloud", "docker", "kubernetes", "jenkins", "gitlab ci",
        "github actions", "terraform", "ansible", "chef", "puppet", "prometheus",
        "grafana", "elk stack", "nginx", "apache", "linux", "bash", "python",
        "infrastructure as code", "continuous integration", "continuous deployment",
        "microservices", "serverless", "containerization", "orchestration", "monitoring"
    ]
}

# Enhanced skills database with skill levels and categories
SKILLS_DATABASE = {
    "Technical Skills": {
        "Programming Languages": [
            "python", "javascript", "java", "c++", "c#", "php", "ruby", "go", "rust",
            "swift", "kotlin", "typescript", "scala", "r", "matlab", "perl", "bash"
        ],
        "Web Technologies": [
            "html", "css", "react", "angular", "vue.js", "node.js", "express", "django",
            "flask", "spring", "laravel", "rails", "asp.net", "jquery", "bootstrap"
        ],
        "Databases": [
            "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra",
            "oracle", "sql server", "sqlite", "dynamodb", "firebase"
        ],
        "Cloud & DevOps": [
            "aws", "azure", "google cloud", "docker", "kubernetes", "jenkins", "git",
            "terraform", "ansible", "prometheus", "grafana", "nginx", "apache"
        ],
        "Data Science": [
            "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "tensorflow",
            "pytorch", "jupyter", "spark", "hadoop", "tableau", "power bi"
        ]
    },
    "Soft Skills": {
        "Leadership": [
            "leadership", "team management", "mentoring", "coaching", "decision making",
            "strategic thinking", "vision", "inspiration", "delegation"
        ],
        "Communication": [
            "communication", "presentation", "public speaking", "writing", "listening",
            "interpersonal skills", "negotiation", "influence", "storytelling"
        ],
        "Problem Solving": [
            "problem solving", "critical thinking", "analytical skills", "creativity",
            "innovation", "research", "troubleshooting", "debugging"
        ],
        "Project Management": [
            "project management", "agile", "scrum", "kanban", "waterfall", "risk management",
            "budgeting", "planning", "coordination", "timeline management"
        ],
        "Personal Effectiveness": [
            "time management", "organization", "adaptability", "flexibility", "resilience",
            "stress management", "self-motivation", "initiative", "attention to detail"
        ]
    },
    "Business Skills": {
        "Sales & Marketing": [
            "sales", "marketing", "customer service", "business development", "account management",
            "lead generation", "branding", "market research", "digital marketing"
        ],
        "Finance & Accounting": [
            "financial analysis", "accounting", "budgeting", "forecasting", "cost analysis",
            "financial modeling", "audit", "compliance", "tax preparation"
        ],
        "Operations": [
            "operations management", "supply chain", "logistics", "quality assurance",
            "process improvement", "six sigma", "lean", "inventory management"
        ],
        "Human Resources": [
            "recruitment", "talent acquisition", "hr management", "employee relations",
            "training", "performance management", "compensation", "benefits"
        ]
    }
}

# Personality traits and their indicators
PERSONALITY_INDICATORS = {
    "Analytical": [
        "analyze", "analysis", "data", "research", "investigation", "examination",
        "evaluation", "assessment", "metrics", "statistics", "measurement", "testing"
    ],
    "Creative": [
        "design", "creative", "innovation", "artistic", "imaginative", "original",
        "unique", "inventive", "artistic", "visual", "aesthetic", "branding"
    ],
    "Leadership": [
        "lead", "leadership", "manage", "management", "supervise", "direct",
        "coordinate", "oversee", "mentor", "coach", "guide", "inspire"
    ],
    "Collaborative": [
        "team", "collaborate", "coordinate", "partner", "work with", "support",
        "assist", "help", "cooperate", "teamwork", "group", "collective"
    ],
    "Detail-Oriented": [
        "detail", "precise", "accurate", "thorough", "meticulous", "careful",
        "quality", "standards", "compliance", "audit", "review", "check"
    ],
    "Adaptable": [
        "adapt", "flexible", "change", "evolve", "learn", "grow", "develop",
        "improve", "enhance", "upgrade", "modernize", "transform"
    ]
}

# Learning resources database (free resources)
LEARNING_RESOURCES = {
    "Software Development": {
        "Beginner": [
            "freeCodeCamp - Complete Web Development Bootcamp",
            "The Odin Project - Full Stack JavaScript",
            "Harvard CS50 - Introduction to Computer Science",
            "MIT OpenCourseWare - Programming Courses",
            "Khan Academy - Computer Programming"
        ],
        "Intermediate": [
            "MDN Web Docs - Advanced JavaScript",
            "Real Python - Python Tutorials",
            "Node.js Official Documentation",
            "React Official Tutorial",
            "Django Official Documentation"
        ],
        "Advanced": [
            "System Design Primer - GitHub",
            "Design Patterns - Gang of Four",
            "Clean Code - Robert Martin",
            "Refactoring - Martin Fowler",
            "Effective Java - Joshua Bloch"
        ]
    },
    "Data Science": {
        "Beginner": [
            "Kaggle Learn - Python, SQL, Machine Learning",
            "DataCamp - Free Python for Data Science",
            "Coursera - Machine Learning (Stanford)",
            "edX - Data Science Fundamentals",
            "Google Data Analytics Certificate"
        ],
        "Intermediate": [
            "Fast.ai - Practical Deep Learning",
            "Andrew Ng - Deep Learning Specialization",
            "StatQuest - Statistics and Machine Learning",
            "Towards Data Science - Medium",
            "Analytics Vidhya - Data Science Blog"
        ],
        "Advanced": [
            "Elements of Statistical Learning",
            "Pattern Recognition and Machine Learning",
            "Deep Learning - Ian Goodfellow",
            "Hands-On Machine Learning - Aurélien Géron",
            "Python for Data Analysis - Wes McKinney"
        ]
    },
    "Marketing": {
        "Beginner": [
            "Google Digital Garage - Digital Marketing",
            "HubSpot Academy - Inbound Marketing",
            "Facebook Blueprint - Social Media Marketing",
            "Google Analytics Academy",
            "Coursera - Digital Marketing Specialization"
        ],
        "Intermediate": [
            "Neil Patel - Digital Marketing Blog",
            "Backlinko - SEO Training",
            "Buffer - Social Media Strategy",
            "Moz - SEO Learning Center",
            "Content Marketing Institute"
        ],
        "Advanced": [
            "Marketing Analytics - Wharton",
            "Growth Hacking - Sean Ellis",
            "Conversion Rate Optimization - CXL",
            "Advanced Google Analytics",
            "Marketing Attribution Models"
        ]
    },
    "Finance": {
        "Beginner": [
            "Investopedia - Financial Education",
            "Khan Academy - Finance & Capital Markets",
            "Coursera - Financial Markets (Yale)",
            "edX - Introduction to Corporate Finance",
            "Bloomberg Market Concepts"
        ],
        "Intermediate": [
            "CFA Institute - Investment Foundations",
            "Wall Street Prep - Financial Modeling",
            "Breaking Into Wall Street - Excel & Financial Modeling",
            "Corporate Finance Institute - Free Courses",
            "Investing.com - Market Analysis"
        ],
        "Advanced": [
            "Aswath Damodaran - Valuation",
            "Risk Management - Coursera",
            "Quantitative Finance - MIT OpenCourseWare",
            "Financial Engineering - Columbia",
            "Advanced Corporate Finance - Harvard"
        ]
    },
    "Healthcare": {
        "Beginner": [
            "Coursera - Healthcare IT Fundamentals",
            "edX - Introduction to Health Informatics",
            "NIH - Clinical Research Training",
            "WHO - Public Health Courses",
            "Khan Academy - Health & Medicine"
        ],
        "Intermediate": [
            "Johns Hopkins - Epidemiology",
            "Stanford - Healthcare Innovation",
            "Harvard - Healthcare Management",
            "Mayo Clinic - Clinical Skills",
            "CDC - Public Health Training"
        ],
        "Advanced": [
            "Clinical Trials - NIH",
            "Healthcare Analytics - MIT",
            "Medical Informatics - Stanford",
            "Healthcare Policy - Harvard",
            "Biostatistics - Johns Hopkins"
        ]
    },
    "Education": {
        "Beginner": [
            "Coursera - Learning How to Learn",
            "edX - Introduction to Teaching",
            "MIT OpenCourseWare - Education",
            "Khan Academy - Teacher Resources",
            "Google for Education - Teacher Center"
        ],
        "Intermediate": [
            "Harvard - Education Leadership",
            "Stanford - Educational Psychology",
            "Columbia - Curriculum Development",
            "Berkeley - Educational Technology",
            "Yale - Teaching Methods"
        ],
        "Advanced": [
            "Educational Research - MIT",
            "Learning Sciences - Stanford",
            "Educational Policy - Harvard",
            "Assessment Design - Columbia",
            "Educational Leadership - Yale"
        ]
    }
}

# Common skills database (expanded)
COMMON_SKILLS = [
    # Technical Skills
    "leadership", "communication", "project management", "teamwork", "problem solving",
    "critical thinking", "time management", "organization", "adaptability", "creativity",
    "analytical skills", "research", "writing", "presentation", "negotiation",
    "customer service", "sales", "marketing", "finance", "accounting", "human resources",
    "operations", "logistics", "supply chain", "quality assurance", "compliance",
    "data analysis", "statistics", "programming", "web development", "mobile development",
    "database management", "cloud computing", "cybersecurity", "network administration",
    "system administration", "devops", "agile", "scrum", "lean", "six sigma",
    
    # Additional Technical Skills
    "machine learning", "artificial intelligence", "deep learning", "nlp", "computer vision",
    "blockchain", "iot", "robotics", "automation", "api development", "microservices",
    "serverless", "containerization", "kubernetes", "docker", "terraform", "ansible",
    "jenkins", "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "slack", "teams", "zoom", "webex", "trello", "asana", "notion",
    
    # Business Skills
    "business development", "strategy", "consulting", "change management", "risk management",
    "budgeting", "forecasting", "financial modeling", "investment analysis", "portfolio management",
    "market research", "competitive analysis", "product management", "brand management",
    "digital transformation", "innovation", "entrepreneurship", "startup", "venture capital",
    "private equity", "investment banking", "trading", "derivatives", "fixed income",
    
    # Creative Skills
    "graphic design", "ui/ux design", "web design", "product design", "illustration",
    "photography", "video editing", "animation", "motion graphics", "3d modeling",
    "typography", "color theory", "layout design", "brand identity", "logo design",
    "print design", "digital art", "visual communication", "storytelling", "content creation"
]

def extract_skills(text):
    """Extract skills from resume text"""
    logger.info("ANALYZING: Extracting skills from text...")
    doc = nlp(text.lower())
    
    # Extract noun phrases and named entities
    skills = set()
    
    # Look for technical skills
    for token in doc:
        if token.pos_ in ['NOUN', 'PROPN'] and len(token.text) > 2:
            skills.add(token.text.lower())
    
    # Look for skill patterns
    skill_patterns = [
        r'\b(?:proficient in|skilled in|experience with|knowledge of)\s+([^,\.]+)',
        r'\b(?:expertise in|specialized in|certified in)\s+([^,\.]+)',
        r'\b(?:programming languages?|languages?|technologies?|tools?|frameworks?|databases?):\s*([^\.]+)',
    ]
    
    for pattern in skill_patterns:
        matches = re.findall(pattern, text.lower())
        for match in matches:
            skills.update([skill.strip() for skill in match.split(',')])
    
    # Filter skills against common skills database
    filtered_skills = [skill for skill in skills if skill in COMMON_SKILLS or any(skill in domain_skills for domain_skills in CAREER_DOMAINS.values())]
    
    logger.info(f"SUCCESS: Extracted {len(filtered_skills)} skills: {filtered_skills[:10]}...")
    return list(set(filtered_skills))

def extract_experience_years(text):
    """Extract years of experience from resume text"""
    logger.info("ANALYZING: Extracting experience years from text...")
    # Look for experience patterns
    experience_patterns = [
        r'(\d+)\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)',
        r'(?:experience|exp)\s*(?:of\s+)?(\d+)\s*(?:years?|yrs?)',
        r'(\d+)\s*(?:years?|yrs?)\s*(?:in\s+)?(?:the\s+)?(?:field|industry|role)',
    ]
    
    total_years = 0
    experience_mentions = []
    
    for pattern in experience_patterns:
        matches = re.findall(pattern, text.lower())
        for match in matches:
            years = int(match)
            total_years += years
            experience_mentions.append(years)
    
    # If no explicit years found, try to estimate from work history
    if total_years == 0:
        # Look for date ranges
        date_patterns = [
            r'(\d{4})\s*[-–]\s*(\d{4}|\bpresent\b)',
            r'(\d{4})\s*[-–]\s*(\d{2})',
        ]
        
        for pattern in date_patterns:
            matches = re.findall(pattern, text.lower())
            for match in matches:
                if len(match) == 2:
                    start_year = int(match[0])
                    end_year = int(match[1]) if match[1].isdigit() else datetime.now().year
                    years = end_year - start_year
                    if 0 <= years <= 50:  # Reasonable range
                        total_years += years
    
    logger.info(f"SUCCESS: Extracted {total_years} total years of experience")
    return {
        "total_years": total_years,
        "mentions": experience_mentions
    }

def extract_keywords(text):
    """Extract important keywords from resume text"""
    logger.info("ANALYZING: Extracting keywords from text...")
    doc = nlp(text.lower())
    
    # Extract nouns, proper nouns, and adjectives
    keywords = []
    
    for token in doc:
        if (token.pos_ in ['NOUN', 'PROPN', 'ADJ'] and 
            len(token.text) > 3 and 
            not token.is_stop and
            not token.text.isdigit()):
            keywords.append(token.text.lower())
    
    # Get most common keywords
    from collections import Counter
    keyword_counts = Counter(keywords)
    top_keywords = [word for word, count in keyword_counts.most_common(20)]
    
    logger.info(f"SUCCESS: Extracted {len(top_keywords)} keywords")
    return top_keywords

def predict_career_domains(text, skills):
    """Predict career domains based on skills and text content"""
    logger.info("ANALYZING: Predicting career domains...")
    text_lower = text.lower()
    domain_scores = {}
    
    for domain, keywords in CAREER_DOMAINS.items():
        score = 0
        for keyword in keywords:
            if keyword in text_lower:
                score += 1
            if keyword in skills:
                score += 2  # Higher weight for skills
        
        if score > 0:
            domain_scores[domain] = score
    
    # Sort by score and return top domains
    sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1], reverse=True)
    predicted_domains = [domain for domain, score in sorted_domains[:3]]
    
    logger.info(f"SUCCESS: Predicted career domains: {predicted_domains}")
    return predicted_domains

def identify_learning_gaps(skills, predicted_domains):
    """Identify potential learning gaps based on skills and predicted domains"""
    logger.info("ANALYZING: Identifying learning gaps...")
    gaps = []
    
    for domain in predicted_domains:
        if domain in CAREER_DOMAINS:
            domain_skills = set(CAREER_DOMAINS[domain])
            user_skills = set(skills)
            missing_skills = domain_skills - user_skills
            
            if missing_skills:
                gaps.append({
                    "domain": domain,
                    "missing_skills": list(missing_skills)[:5],  # Top 5 missing skills
                    "priority": "High" if len(missing_skills) > 5 else "Medium"
                })
    
    logger.info(f"SUCCESS: Identified {len(gaps)} learning gaps")
    return gaps

def analyze_personality_traits(text):
    """Analyze personality traits from resume text"""
    logger.info("ANALYZING: Analyzing personality traits...")
    text_lower = text.lower()
    trait_scores = {}
    
    for trait, indicators in PERSONALITY_INDICATORS.items():
        score = 0
        for indicator in indicators:
            if indicator in text_lower:
                score += 1
        
        if score > 0:
            trait_scores[trait] = score
    
    # Sort by score and return top traits
    sorted_traits = sorted(trait_scores.items(), key=lambda x: x[1], reverse=True)
    top_traits = [trait for trait, score in sorted_traits[:3]]
    
    logger.info(f"SUCCESS: Identified personality traits: {top_traits}")
    return top_traits

def categorize_skills(skills):
    """Categorize skills into technical, soft, and business skills"""
    logger.info("ANALYZING: Categorizing skills...")
    
    categorized_skills = {
        "Technical Skills": [],
        "Soft Skills": [],
        "Business Skills": []
    }
    
    for skill in skills:
        skill_lower = skill.lower()
        categorized = False
        
        # Check technical skills
        for category, subcategories in SKILLS_DATABASE["Technical Skills"].items():
            for subcategory_skills in subcategories:
                if skill_lower in subcategory_skills or any(s in skill_lower for s in subcategory_skills):
                    categorized_skills["Technical Skills"].append(skill)
                    categorized = True
                    break
            if categorized:
                break
        
        # Check soft skills
        if not categorized:
            for category, subcategories in SKILLS_DATABASE["Soft Skills"].items():
                for subcategory_skills in subcategories:
                    if skill_lower in subcategory_skills or any(s in skill_lower for s in subcategory_skills):
                        categorized_skills["Soft Skills"].append(skill)
                        categorized = True
                        break
                if categorized:
                    break
        
        # Check business skills
        if not categorized:
            for category, subcategories in SKILLS_DATABASE["Business Skills"].items():
                for subcategory_skills in subcategories:
                    if skill_lower in subcategory_skills or any(s in skill_lower for s in subcategory_skills):
                        categorized_skills["Business Skills"].append(skill)
                        categorized = True
                        break
                if categorized:
                    break
    
    logger.info(f"SUCCESS: Categorized skills: {sum(len(skills) for skills in categorized_skills.values())} total")
    return categorized_skills

def generate_learning_recommendations(skills, predicted_domains, experience_years):
    """Generate personalized learning recommendations"""
    logger.info("ANALYZING: Generating learning recommendations...")
    
    recommendations = []
    
    # Determine skill level based on experience
    if experience_years < 2:
        skill_level = "Beginner"
    elif experience_years < 5:
        skill_level = "Intermediate"
    else:
        skill_level = "Advanced"
    
    # Generate recommendations for each predicted domain
    for domain in predicted_domains[:2]:  # Top 2 domains
        if domain in LEARNING_RESOURCES:
            domain_resources = LEARNING_RESOURCES[domain]
            
            # Get resources for current skill level
            if skill_level in domain_resources:
                resources = domain_resources[skill_level]
                recommendations.append({
                    "domain": domain,
                    "skill_level": skill_level,
                    "resources": resources[:3],  # Top 3 resources
                    "priority": "High" if domain == predicted_domains[0] else "Medium"
                })
            
            # Also suggest next level resources
            next_level = "Intermediate" if skill_level == "Beginner" else "Advanced" if skill_level == "Intermediate" else "Advanced"
            if next_level in domain_resources and next_level != skill_level:
                next_resources = domain_resources[next_level]
                recommendations.append({
                    "domain": domain,
                    "skill_level": next_level,
                    "resources": next_resources[:2],  # Top 2 resources for next level
                    "priority": "Medium",
                    "note": f"Next level recommendations for {domain}"
                })
    
    # Add general skill development recommendations
    general_recommendations = [
        "LinkedIn Learning - Professional Development",
        "Coursera - Career Development Specializations",
        "edX - Professional Certificate Programs",
        "YouTube - Industry Expert Channels",
        "Podcasts - Industry-specific shows"
    ]
    
    recommendations.append({
        "domain": "General Development",
        "skill_level": "All Levels",
        "resources": general_recommendations,
        "priority": "Low",
        "note": "General professional development resources"
    })
    
    logger.info(f"SUCCESS: Generated {len(recommendations)} learning recommendation sets")
    return recommendations

def calculate_skill_match_score(skills, domain):
    """Calculate skill match score for a specific domain"""
    if domain not in CAREER_DOMAINS:
        return 0
    
    domain_skills = set(CAREER_DOMAINS[domain])
    user_skills = set(skills)
    
    if not domain_skills:
        return 0
    
    matched_skills = domain_skills.intersection(user_skills)
    match_percentage = (len(matched_skills) / len(domain_skills)) * 100
    
    return round(match_percentage, 1)

def extract_education_info(text):
    """Extract education information from resume text"""
    logger.info("ANALYZING: Extracting education information...")
    
    education_patterns = [
        r'\b(?:bachelor|master|phd|doctorate|associate|diploma|certificate)\s+(?:of|in|degree)?\s*[^,\.]+',
        r'\b(?:university|college|institute|school)\s+of\s+[^,\.]+',
        r'\b(?:computer science|engineering|business|marketing|finance|healthcare|education)\s+(?:degree|major|field)',
        r'\b(?:gpa|grade point average)\s*[:\-]?\s*(\d+\.?\d*)',
        r'\b(?:graduated|completed|earned)\s+(?:in|from|at)\s+\d{4}'
    ]
    
    education_info = {
        "degrees": [],
        "institutions": [],
        "fields_of_study": [],
        "graduation_years": [],
        "gpa": None
    }
    
    for pattern in education_patterns:
        matches = re.findall(pattern, text.lower())
        for match in matches:
            if 'gpa' in pattern:
                try:
                    education_info["gpa"] = float(match)
                except:
                    pass
            elif 'graduated' in pattern or 'completed' in pattern:
                # Extract year
                year_match = re.search(r'\d{4}', match)
                if year_match:
                    education_info["graduation_years"].append(int(year_match.group()))
            else:
                if 'university' in match or 'college' in match or 'institute' in match:
                    education_info["institutions"].append(match.strip())
                elif any(degree in match for degree in ['bachelor', 'master', 'phd', 'doctorate', 'associate']):
                    education_info["degrees"].append(match.strip())
                else:
                    education_info["fields_of_study"].append(match.strip())
    
    # Remove duplicates
    for key in education_info:
        if isinstance(education_info[key], list):
            education_info[key] = list(set(education_info[key]))
    
    logger.info(f"SUCCESS: Extracted education info: {len(education_info['degrees'])} degrees, {len(education_info['institutions'])} institutions")
    return education_info

@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    """Main endpoint for resume analysis"""
    request_id = f"req_{int(datetime.now().timestamp())}_{hash(str(datetime.now())) % 10000}"
    start_time = datetime.now()
    
    logger.info(f"STARTING: [{request_id}] Starting resume analysis...")
    
    try:
        # Get input from request
        if request.is_json:
            data = request.get_json()
            text = data.get('text', '')
            user_identifier = data.get('user_identifier', generate_session_id())
            logger.info(f"RECEIVED: [{request_id}] Received JSON request with text length: {len(text)}")
        else:
            # Handle form data or file upload
            text = request.form.get('text', '')
            user_identifier = request.form.get('user_identifier', generate_session_id())
            if 'file' in request.files:
                file = request.files['file']
                if file.filename:
                    text = file.read().decode('utf-8')
            logger.info(f"RECEIVED: [{request_id}] Received form data with text length: {len(text)}")
        
        if not text:
            logger.error(f"ERROR: [{request_id}] No text content provided")
            return jsonify({
                'error': 'No text content provided. Please provide text or upload a file.'
            }), 400
        
        logger.info(f"PROCESSING: [{request_id}] Processing text: {text[:100]}...")
        
        # Perform analysis
        logger.info(f"ANALYZING: [{request_id}] Starting analysis pipeline...")
        
        skills = extract_skills(text)
        experience = extract_experience_years(text)
        keywords = extract_keywords(text)
        predicted_domains = predict_career_domains(text, skills)
        learning_gaps = identify_learning_gaps(skills, predicted_domains)
        
        # Enhanced analysis features
        personality_traits = analyze_personality_traits(text)
        categorized_skills = categorize_skills(skills)
        learning_recommendations = generate_learning_recommendations(skills, predicted_domains, experience['total_years'])
        education_info = extract_education_info(text)
        
        # Calculate skill match scores for predicted domains
        domain_match_scores = {}
        for domain in predicted_domains:
            domain_match_scores[domain] = calculate_skill_match_score(skills, domain)
        
        # Prepare enhanced response
        analysis_result = {
            'extracted_skills': skills,
            'categorized_skills': categorized_skills,
            'experience_years': experience,
            'keywords': keywords,
            'predicted_career_domains': predicted_domains,
            'domain_match_scores': domain_match_scores,
            'learning_gaps': learning_gaps,
            'personality_traits': personality_traits,
            'learning_recommendations': learning_recommendations,
            'education_info': education_info,
            'analysis_summary': {
                'total_skills_found': len(skills),
                'years_experience': experience['total_years'],
                'top_domain': predicted_domains[0] if predicted_domains else 'Unknown',
                'top_domain_match': domain_match_scores.get(predicted_domains[0], 0) if predicted_domains else 0,
                'gaps_identified': len(learning_gaps),
                'personality_traits_count': len(personality_traits),
                'education_level': len(education_info['degrees']),
                'skill_categories': {k: len(v) for k, v in categorized_skills.items()}
            }
        }
        
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        # Save analysis to local database history
        save_success = save_analysis_to_history(
            user_identifier, 
            analysis_result, 
            analysis_result['analysis_summary'], 
            processing_time
        )
        
        # Add user session info to response
        analysis_result['user_session'] = {
            'user_identifier': user_identifier,
            'analysis_saved': save_success,
            'processing_time': processing_time
        }
        
        logger.info(f"COMPLETED: [{request_id}] Analysis completed successfully in {processing_time:.2f}ms")
        logger.info(f"RESULTS: [{request_id}] Results: {len(skills)} skills, {len(predicted_domains)} domains, {len(learning_gaps)} gaps")
        
        return jsonify(analysis_result)
        
    except Exception as e:
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        logger.error(f"ERROR: [{request_id}] Analysis failed after {processing_time:.2f}ms: {str(e)}")
        return jsonify({
            'error': f'Analysis failed: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    logger.info("HEALTH: Health check requested")
    return jsonify({
        'status': 'healthy',
        'message': 'Enhanced Resume Analyzer API is running',
        'timestamp': datetime.now().isoformat(),
        'spacy_model': 'en_core_web_sm',
        'nltk_data': 'available',
        'database': 'sqlite_local',
        'features': {
            'career_domains': len(CAREER_DOMAINS),
            'skill_categories': len(SKILLS_DATABASE),
            'personality_traits': len(PERSONALITY_INDICATORS),
            'learning_resources': len(LEARNING_RESOURCES),
            'total_skills': len(COMMON_SKILLS),
            'local_history': True,
            'user_sessions': True
        },
        'endpoints': {
            'POST /analyze-resume': 'Enhanced resume analysis with personality, skills categorization, learning recommendations, and local history',
            'POST /skill-analysis': 'Detailed skill analysis and categorization',
            'GET /history': 'Get analysis history for a user',
            'GET /user-stats': 'Get user statistics and analytics',
            'POST /generate-session': 'Generate new session ID for anonymous users',
            'GET /health': 'Health check and feature information'
        }
    })

@app.route('/skill-analysis', methods=['POST'])
def detailed_skill_analysis():
    """Detailed skill analysis endpoint"""
    request_id = f"skill_analysis_{int(datetime.now().timestamp())}_{hash(str(datetime.now())) % 10000}"
    start_time = datetime.now()
    
    logger.info(f"STARTING: [{request_id}] Starting detailed skill analysis...")
    
    try:
        # Get input from request
        if request.is_json:
            data = request.get_json()
            text = data.get('text', '')
        else:
            text = request.form.get('text', '')
        
        if not text:
            return jsonify({
                'error': 'No text content provided'
            }), 400
        
        # Perform detailed skill analysis
        skills = extract_skills(text)
        categorized_skills = categorize_skills(skills)
        
        # Calculate skill distribution
        skill_distribution = {
            'total_skills': len(skills),
            'technical_skills': len(categorized_skills['Technical Skills']),
            'soft_skills': len(categorized_skills['Soft Skills']),
            'business_skills': len(categorized_skills['Business Skills']),
            'uncategorized': len(skills) - sum(len(cat) for cat in categorized_skills.values())
        }
        
        # Calculate skill strength scores
        skill_strength = {}
        for category, skill_list in categorized_skills.items():
            if skill_list:
                # Calculate based on frequency and relevance
                strength_score = min(100, len(skill_list) * 10)  # Simple scoring
                skill_strength[category] = strength_score
        
        # Generate skill development recommendations
        development_areas = []
        for category, skills_list in categorized_skills.items():
            if len(skills_list) < 3:  # Less than 3 skills in category
                development_areas.append({
                    'category': category,
                    'current_count': len(skills_list),
                    'recommended_minimum': 3,
                    'priority': 'High' if category == 'Technical Skills' else 'Medium'
                })
        
        analysis_result = {
            'skills': skills,
            'categorized_skills': categorized_skills,
            'skill_distribution': skill_distribution,
            'skill_strength': skill_strength,
            'development_areas': development_areas,
            'analysis_metadata': {
                'processing_time': (datetime.now() - start_time).total_seconds() * 1000,
                'request_id': request_id,
                'text_length': len(text)
            }
        }
        
        logger.info(f"COMPLETED: [{request_id}] Skill analysis completed successfully")
        return jsonify(analysis_result)
        
    except Exception as e:
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        logger.error(f"ERROR: [{request_id}] Skill analysis failed after {processing_time:.2f}ms: {str(e)}")
        return jsonify({
            'error': f'Skill analysis failed: {str(e)}'
        }), 500

@app.route('/history', methods=['GET'])
def get_analysis_history_endpoint():
    """Get analysis history for a user"""
    try:
        user_identifier = request.headers.get('X-User-Identifier')
        limit = int(request.args.get('limit', 10))
        
        if not user_identifier:
            return jsonify({
                'error': 'X-User-Identifier header is required'
            }), 400
        
        if limit > 50:  # Prevent excessive queries
            limit = 50
        
        history = get_analysis_history(user_identifier, limit)
        user_stats = get_user_stats(user_identifier)
        
        return jsonify({
            'success': True,
            'user_identifier': user_identifier,
            'history': history,
            'user_stats': user_stats,
            'total_analyses': len(history)
        })
        
    except Exception as e:
        logger.error(f"ERROR: Failed to get history: {e}")
        return jsonify({
            'error': f'Failed to retrieve history: {str(e)}'
        }), 500

@app.route('/user-stats', methods=['GET'])
def get_user_stats_endpoint():
    """Get user statistics"""
    try:
        user_identifier = request.args.get('user_identifier')
        
        if not user_identifier:
            return jsonify({
                'error': 'user_identifier parameter is required'
            }), 400
        
        user_stats = get_user_stats(user_identifier)
        
        if user_stats:
            return jsonify({
                'success': True,
                'user_identifier': user_identifier,
                'stats': user_stats
            })
        else:
            return jsonify({
                'success': False,
                'message': 'No analysis history found for this user'
            }), 404
        
    except Exception as e:
        logger.error(f"ERROR: Failed to get user stats: {e}")
        return jsonify({
            'error': f'Failed to retrieve user stats: {str(e)}'
        }), 500

@app.route('/generate-session', methods=['POST'])
def generate_session_endpoint():
    """Generate a new session ID for anonymous users"""
    try:
        session_id = generate_session_id()
        return jsonify({
            'success': True,
            'session_id': session_id,
            'message': 'New session created successfully'
        })
    except Exception as e:
        logger.error(f"ERROR: Failed to generate session: {e}")
        return jsonify({
            'error': f'Failed to generate session: {str(e)}'
        }), 500

@app.route('/dashboard', methods=['GET'])
def user_dashboard():
    """User dashboard analytics endpoint"""
    try:
        user_identifier = request.headers.get('X-User-Identifier')
        limit = int(request.args.get('limit', 50))
        if not user_identifier:
            return jsonify({'error': 'X-User-Identifier header is required'}), 400
        if limit > 100:
            limit = 100
        
        # Get history
        history_rows = []
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM analysis_history 
                WHERE user_identifier = ? 
                ORDER BY created_at ASC 
                LIMIT ?
            ''', (user_identifier, limit))
            history_rows = cursor.fetchall()
        
        if not history_rows:
            return jsonify({'success': False, 'message': 'No analysis history found for this user'}), 404
        
        # Comprehensive analytics aggregation
        total_analyses = len(history_rows)
        first_analysis = history_rows[0]['created_at']
        last_analysis = history_rows[-1]['created_at']
        
        # Initialize analytics containers
        total_skills_found = 0
        all_domains = []
        all_experience = []
        all_personality_traits = []
        all_learning_gaps = []
        all_skills = []
        all_categorized_skills = {'Technical Skills': [], 'Soft Skills': [], 'Business Skills': []}
        
        # Time series data
        skills_per_analysis = []
        experience_per_analysis = []
        domains_per_analysis = []
        personality_per_analysis = []
        gaps_per_analysis = []
        education_per_analysis = []
        match_scores_per_analysis = []
        
        # Process each analysis
        for row in history_rows:
            try:
                analysis_data = json.loads(row['analysis_data'])
                summary = json.loads(row['analysis_summary'])
                
                # Basic metrics
                skills_count = summary.get('total_skills_found', 0)
                total_skills_found += skills_count
                skills_per_analysis.append(skills_count)
                
                exp = summary.get('years_experience', 0)
                all_experience.append(exp)
                experience_per_analysis.append(exp)
                
                # Domains
                domains = analysis_data.get('predicted_career_domains', [])
                all_domains.extend(domains)
                domains_per_analysis.append(domains)
                
                # Personality traits
                personality_traits = analysis_data.get('personality_traits', [])
                all_personality_traits.extend(personality_traits)
                personality_per_analysis.append(personality_traits)
                
                # Learning gaps
                learning_gaps = analysis_data.get('learning_gaps', [])
                all_learning_gaps.extend(learning_gaps)
                gaps_per_analysis.append(len(learning_gaps))
                
                # Skills categorization
                categorized_skills = analysis_data.get('categorized_skills', {})
                for category, skills in categorized_skills.items():
                    if category in all_categorized_skills:
                        all_categorized_skills[category].extend(skills)
                
                # All skills
                extracted_skills = analysis_data.get('extracted_skills', [])
                all_skills.extend(extracted_skills)
                
                # Education
                education_info = analysis_data.get('education_info', {})
                education_count = len(education_info.get('degrees', []))
                education_per_analysis.append(education_count)
                
                # Domain match scores
                domain_scores = analysis_data.get('domain_match_scores', {})
                if domain_scores:
                    avg_score = sum(domain_scores.values()) / len(domain_scores)
                    match_scores_per_analysis.append(round(avg_score, 2))
                else:
                    match_scores_per_analysis.append(0)
                    
            except Exception as e:
                logger.error(f"Error processing analysis row: {e}")
                continue
        
        # Calculate comprehensive analytics
        from collections import Counter
        
        # Domain frequency
        domain_counts = Counter(all_domains)
        career_domains = [
            {'domain': domain, 'count': count, 'percentage': round((count / total_analyses) * 100, 1)}
            for domain, count in domain_counts.most_common()
        ]
        
        # Personality trait frequency
        personality_counts = Counter(all_personality_traits)
        personality_insights = [
            {'trait': trait, 'count': count, 'percentage': round((count / total_analyses) * 100, 1)}
            for trait, count in personality_counts.most_common()
        ]
        
        # Skill frequency
        skill_counts = Counter(all_skills)
        top_skills = [
            {'skill': skill, 'count': count, 'percentage': round((count / total_analyses) * 100, 1)}
            for skill, count in skill_counts.most_common(10)
        ]
        
        # Categorized skill distribution
        skill_distribution = {
            'technical_skills': len(all_categorized_skills['Technical Skills']),
            'soft_skills': len(all_categorized_skills['Soft Skills']),
            'business_skills': len(all_categorized_skills['Business Skills']),
            'total_unique_skills': len(set(all_skills))
        }
        
        # Learning gap analysis
        gap_domains = Counter([gap.get('domain', 'Unknown') for gap in all_learning_gaps])
        learning_gap_insights = [
            {'domain': domain, 'count': count}
            for domain, count in gap_domains.most_common()
        ]
        
        # Progress metrics
        avg_experience = round(sum(all_experience) / total_analyses, 2) if total_analyses else 0
        avg_skills_per_analysis = round(total_skills_found / total_analyses, 2) if total_analyses else 0
        avg_gaps_per_analysis = round(sum(gaps_per_analysis) / total_analyses, 2) if total_analyses else 0
        avg_match_score = round(sum(match_scores_per_analysis) / len(match_scores_per_analysis), 2) if match_scores_per_analysis else 0
        
        # Trends analysis
        if len(skills_per_analysis) > 1:
            skills_trend = "increasing" if skills_per_analysis[-1] > skills_per_analysis[0] else "decreasing"
            experience_trend = "increasing" if experience_per_analysis[-1] > experience_per_analysis[0] else "decreasing"
        else:
            skills_trend = "stable"
            experience_trend = "stable"
        
        # Calculate consistency score (unique domain combinations)
        unique_domain_combinations = set()
        for domains in domains_per_analysis:
            if domains:  # Only add non-empty lists
                unique_domain_combinations.add(tuple(sorted(domains)))  # Convert to tuple for hashing
        consistency_score = round((len(unique_domain_combinations) / total_analyses) * 100, 1) if total_analyses else 0
        
        # Detailed analytics object
        detailed_analytics = {
            'time_series': {
                'skills_per_analysis': skills_per_analysis,
                'experience_per_analysis': experience_per_analysis,
                'gaps_per_analysis': gaps_per_analysis,
                'education_per_analysis': education_per_analysis,
                'match_scores_per_analysis': match_scores_per_analysis
            },
            'skill_insights': {
                'top_skills': top_skills,
                'skill_distribution': skill_distribution,
                'skills_trend': skills_trend,
                'avg_skills_per_analysis': avg_skills_per_analysis
            },
            'domain_insights': {
                'career_domains': career_domains,
                'domains_per_analysis': domains_per_analysis,
                'avg_match_score': avg_match_score
            },
            'personality_insights': {
                'personality_traits': personality_insights,
                'personality_per_analysis': personality_per_analysis
            },
            'learning_insights': {
                'learning_gap_insights': learning_gap_insights,
                'avg_gaps_per_analysis': avg_gaps_per_analysis,
                'total_gaps_identified': len(all_learning_gaps)
            },
            'progress_metrics': {
                'skills_trend': skills_trend,
                'experience_trend': experience_trend,
                'consistency_score': consistency_score
            }
        }
        
        # --- Resume Analysis Trend ---
        resume_analysis_trend = {
            'dates': [row['created_at'] for row in history_rows],
            'skills_per_analysis': skills_per_analysis,
            'gaps_per_analysis': gaps_per_analysis,
            'experience_per_analysis': experience_per_analysis,
            'match_scores_per_analysis': match_scores_per_analysis
        }

        # --- Top Skills Distribution ---
        top_skills_distribution = top_skills  # Already sorted by count

        # --- Career Domains (frequency and trend) ---
        career_domains_trend = {
            'domain_counts': career_domains,
            'domains_per_analysis': domains_per_analysis
        }

        # --- Skill Gaps by Priority (by count) ---
        skill_gaps_by_priority = sorted(learning_gap_insights, key=lambda x: x['count'], reverse=True)

        # --- Top Skills Found (most frequent skills) ---
        top_skills_found = top_skills[:5]

        # --- Recent Skill Gaps (from most recent analyses) ---
        recent_skill_gaps = []
        for row in reversed(history_rows[-5:]):
            try:
                analysis_data = json.loads(row['analysis_data'])
                gaps = analysis_data.get('learning_gaps', [])
                for gap in gaps:
                    recent_skill_gaps.append({
                        'domain': gap.get('domain', 'Unknown'),
                        'skill': gap.get('skill', 'Unknown'),
                        'priority': gap.get('priority', 'N/A'),
                        'created_at': row['created_at']
                    })
            except Exception:
                continue
        # Limit to 10 most recent gaps
        recent_skill_gaps = recent_skill_gaps[:10]

        # Add these sections to the dashboard response
        dashboard = {
            'user_identifier': user_identifier,
            'time_period': {
                'first_analysis': first_analysis,
                'last_analysis': last_analysis,
                'days_active': (datetime.fromisoformat(last_analysis.replace('Z', '+00:00')) - 
                               datetime.fromisoformat(first_analysis.replace('Z', '+00:00'))).days
            },
            'overview': {
                'total_analyses': total_analyses,
                'total_skills_found': total_skills_found,
                'avg_experience': avg_experience,
                'avg_skills_per_analysis': avg_skills_per_analysis,
                'avg_gaps_per_analysis': avg_gaps_per_analysis,
                'avg_match_score': avg_match_score
            },
            'career_domains': career_domains,
            'detailed_analytics': detailed_analytics,
            # --- New explicit analytics sections ---
            'resume_analysis_trend': resume_analysis_trend,
            'top_skills_distribution': top_skills_distribution,
            'career_domains_trend': career_domains_trend,
            'skill_gaps_by_priority': skill_gaps_by_priority,
            'top_skills_found': top_skills_found,
            'recent_skill_gaps': recent_skill_gaps
        }
        
        return jsonify({'success': True, 'dashboard': dashboard})
        
    except Exception as e:
        logger.error(f"ERROR: Failed to get dashboard: {e}")
        return jsonify({'error': f'Failed to retrieve dashboard: {str(e)}'}), 500

if __name__ == '__main__':
    logger.info("STARTING: Starting Enhanced Resume Analyzer API...")
    
    # Initialize database
    init_database()
    
    logger.info("FEATURES: Enhanced features available:")
    logger.info(f"  - {len(CAREER_DOMAINS)} Career Domains")
    logger.info(f"  - {len(SKILLS_DATABASE)} Skill Categories")
    logger.info(f"  - {len(PERSONALITY_INDICATORS)} Personality Traits")
    logger.info(f"  - {len(LEARNING_RESOURCES)} Learning Resource Categories")
    logger.info("ENDPOINTS: Available endpoints:")
    logger.info("  - POST /analyze-resume - Enhanced resume analysis with personality, skills categorization, and learning recommendations")
    logger.info("  - POST /skill-analysis - Detailed skill analysis and categorization")
    logger.info("  - GET  /history - Get analysis history for a user")
    logger.info("  - GET  /user-stats - Get user statistics")
    logger.info("  - POST /generate-session - Generate new session ID")
    logger.info("  - GET  /health - Health check and feature information")
    logger.info("  - GET  /dashboard - User dashboard analytics")
    app.run(host='0.0.0.0', port=5001) 