import Layout from './Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>

        <p className="text-gray-300 leading-relaxed mb-6">
          Last Updated: {new Date().toLocaleDateString()}  {/* ALWAYS include a last updated date */}
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          This Privacy Policy describes how PixelMorph ("we," "us," or "our") collects, uses, and shares information about you when you use our image processing services ("Services").  We are committed to protecting your privacy.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>

        <h3 className="text-xl font-semibold mb-2 text-white">1.1. Information You Provide to Us</h3>
        <ul className="list-disc pl-5 text-gray-300 space-y-2 mb-4">
          <li>
            <strong>Images:</strong> When you use our Services, you upload images to our servers for processing. We temporarily store these images to perform the requested operations (background removal, watermark removal).
          </li>
          <li>
            <strong>Optional Account Information (If Applicable):</strong>  If you choose to create an account, we may collect information such as your email address, username, and password.  *If you don't have accounts, remove this section.*
          </li>
          <li>
            <strong>Other Information (If Applicable):</strong> If user can contact you in some way add it.
          </li>
        </ul>
        <h3 className="text-xl font-semibold mb-2 text-white">1.2. Information We Collect Automatically</h3>
        <ul className="list-disc pl-5 text-gray-300 space-y-2 mb-4">
          <li>
            <strong>Usage Data:</strong> We may collect information about how you use our Services, such as the types of features you use, the frequency of your use, and the time spent on our platform.
          </li>
          <li>
            <strong>Device Information:</strong> We may collect information about the device you use to access our Services, including the device type, operating system, browser type, and IP address.  *This is crucial for security and troubleshooting.*
          </li>
          <li>
            <strong>Cookies and Similar Technologies:</strong> We may use cookies and similar technologies (e.g., web beacons, pixels) to collect information about your browsing activity and preferences.  You can control cookies through your browser settings. *See the "Cookies" section below for more details.*
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
        <ul className="list-disc pl-5 text-gray-300 space-y-2 mb-4">
          <li>
            <strong>To Provide and Improve Our Services:</strong> We use the images you upload to perform the requested image processing.  We use usage and device information to improve our Services, fix bugs, and develop new features.
          </li>
          <li>
            <strong>To Communicate with You (If Applicable):</strong> If you have an account or have provided contact information, we may use your information to send you updates, respond to inquiries, or provide customer support.
          </li>
          <li>
            <strong>For Security Purposes:</strong> We use information to protect the security and integrity of our Services, prevent fraud, and comply with legal obligations.
          </li>
          <li>
             <strong>To Personalize Your Experience (If Applicable):</strong> If you collect information about user's preferencies use this section.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Share Your Information</h2>
        <ul className="list-disc pl-5 text-gray-300 space-y-2 mb-4">
          <li>
            <strong>With Third-Party Service Providers:</strong> We may share your information with third-party service providers who assist us in providing our Services, such as cloud storage providers (e.g., AWS, Google Cloud) and analytics providers (e.g., Google Analytics).  *These providers are contractually obligated to protect your information.*  **You MUST list the specific providers you use.**
          </li>
          <li>
            <strong>For Legal Reasons:</strong> We may disclose your information if required by law, such as in response to a subpoena, court order, or other legal process.  We may also disclose your information if we believe it is necessary to protect our rights, property, or safety, or the rights, property, or safety of others.
          </li>
          <li>
            <strong>In Connection with a Business Transaction:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
          </li>
          <li>
            <strong>With Your Consent:</strong> We may share your information with other third parties with your consent.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Retention</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          We retain the images you upload for a limited time necessary to process them.  Processed images and uploaded images are typically deleted from our servers within [Specify Timeframe - e.g., 24 hours, 7 days].  Other information (usage data, device information) may be retained for longer periods as necessary for legitimate business purposes, such as improving our Services and complying with legal obligations.  *Be specific about retention periods.*
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">5. Your Rights and Choices</h2>
         <ul className="list-disc pl-5 text-gray-300 space-y-2 mb-4">
          <li>
            <strong>Access and Correction:</strong> You may have the right to access and correct the personal information we hold about you.  Contact us at [Your Contact Email] to make such requests.
          </li>
          <li>
            <strong>Deletion:</strong> You may have the right to request that we delete your personal information.  Note that we may need to retain certain information for legal or legitimate business purposes.
          </li>
          <li>
            <strong>Objection and Restriction:</strong> You may have the right to object to or restrict our processing of your personal information.
          </li>
           <li>
            <strong>Data Portability:</strong> You may have the right to receive a copy of your personal information in a structured, commonly used, and machine-readable format.
          </li>
            *These rights depend on applicable law (e.g., GDPR, CCPA).  Tailor this section to the jurisdictions where you operate.*
         </ul>
        <h2 className="text-2xl font-semibold mb-4 text-white">6. Cookies</h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          We use cookies and similar technologies to collect information about your browsing activity and preferences.  A cookie is a small text file that is stored on your device.  You can control cookies through your browser settings.  Most browsers allow you to block or delete cookies.  However, blocking cookies may affect your ability to use our Services.
           *If you use cookies, you MUST have a dedicated section explaining them, including:*
           *  **Types of cookies used (e.g., session, persistent, first-party, third-party)**
           *  **Purposes of cookies (e.g., analytics, functionality, advertising)**
           *  **How to manage cookies (with links to browser instructions)**
           * **If you do not use cookies, remove this section and in section 1.2 just say so**
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">7. Security</h2>

        <p className="text-gray-300 leading-relaxed mb-4">
          We take reasonable measures to protect your information from unauthorized access, use, or disclosure.  These measures may include encryption, access controls, and data security policies. However, no method of transmission over the internet or method of electronic storage is completely secure. *Be realistic about security limitations.*
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">8. Children's Privacy</h2>
         <p className="text-gray-300 leading-relaxed mb-4">
          Our service is intended for a general audience and we do not knowingly collect personal information from children under 16. If you are under 16 do not use or provide any information on this website.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">9. Changes to this Privacy Policy</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          We may update this Privacy Policy from time to time.  We will post any changes on this page and update the "Last Updated" date.  We encourage you to review this Privacy Policy periodically.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Us</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          If you have any questions about this Privacy Policy, please contact us at: [Your Contact Email]
        </p>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;