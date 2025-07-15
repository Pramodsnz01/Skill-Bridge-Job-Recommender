import React from 'react';

const effectiveDate = new Date().toISOString().slice(0, 10);

const PrivacyPolicy = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-100">
    <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
    <p className="mb-4">Effective Date: <strong>{effectiveDate}</strong></p>
    <p className="mb-4">Welcome to SkillBridge (“we”, “us”, or “our”). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, applications, and related services (collectively, the “Service”).</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
    <ul className="list-disc ml-6 mb-4">
      <li><strong>Personal Information:</strong> Name, email address, contact details, profile information, uploaded documents (e.g., resumes).</li>
      <li><strong>Usage Data:</strong> IP address, browser type, device information, pages visited, date and time of access.</li>
      <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance your experience and analyze usage.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>To provide, operate, and maintain the Service</li>
      <li>To personalize your experience</li>
      <li>To analyze and improve the Service</li>
      <li>To communicate with you</li>
      <li>To ensure security and prevent fraud</li>
      <li>To comply with legal obligations</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2">3. How We Share Your Information</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>We do <strong>not</strong> sell your personal information.</li>
      <li>We may share your information with service providers and partners who assist in operating the Service (under confidentiality agreements).</li>
      <li>We may disclose information to law enforcement or regulatory authorities if required by law.</li>
      <li>Other parties with your consent.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2">4. Data Security</h2>
    <p className="mb-4">We implement appropriate technical and organizational measures to protect your information from unauthorized access, disclosure, alteration, or destruction.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">5. Data Retention</h2>
    <p className="mb-4">We retain your information only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">6. Your Rights</h2>
    <p className="mb-4">Depending on your jurisdiction, you may have the right to access, correct, or delete your personal information, object to or restrict processing, withdraw consent, or lodge a complaint with a supervisory authority.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">7. Children’s Privacy</h2>
    <p className="mb-4">Our Service is not intended for children under 16. We do not knowingly collect personal information from children.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">8. Changes to This Policy</h2>
    <p className="mb-4">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date.</p>
    <p className="text-xs text-gray-400 mt-8">This Privacy Policy is provided for informational purposes and should be reviewed and customized for your specific data practices and legal requirements.</p>
  </div>
);

export default PrivacyPolicy; 