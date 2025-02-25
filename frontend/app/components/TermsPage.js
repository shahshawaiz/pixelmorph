import Layout from './Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-white">Terms of Service</h1>

        <p className="text-gray-300 leading-relaxed mb-6">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <p className="text-gray-300 leading-relaxed mb-6">
          Please read these Terms of Service ("Terms") carefully before using the PixelMorph image processing service ("Service") operated by PixelMorph Inc. ("we," "us," or "our"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, then you may not access the Service.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          By accessing or using the Service, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms. If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">2. Use of the Service</h2>

        <h3 className="text-xl font-semibold mb-2 text-white">2.1. Permitted Use</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          You may use the Service for lawful purposes only. You agree not to use the Service:
        </p>
        <ul className="list-disc pl-5 text-gray-300 space-y-2 mb-4">
          <li>To upload, process, or share any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or otherwise objectionable.</li>
          <li>To infringe upon the intellectual property rights of others, including copyrights, trademarks, and patents.</li>
          <li>To upload, process, or share any content that contains viruses, malware, or other harmful code.</li>
          <li>To impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity.</li>
          <li>To interfere with or disrupt the Service or servers or networks connected to the Service.</li>
          <li>To violate any applicable laws or regulations.</li>
          <li>To collect or store personal data about other users without their express consent.</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2 text-white">2.2. User Content</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          You are solely responsible for the content you upload to the Service ("User Content"). You retain ownership of your User Content, but by uploading it to the Service, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display your User Content solely for the purpose of providing the Service. You represent and warrant that you have all necessary rights to grant us this license.
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          We do not claim ownership of your User Content; however, we strictly prohibit any activities that infringe upon intellectual property rights.
        </p>

        {/* If your service does not require an account, you may remove the following section */}
        {/* <h3 className="text-xl font-semibold mb-2 text-white">2.3. Account (If Applicable)</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          If the Service requires you to create an account, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
        </p> */}

        <h2 className="text-2xl font-semibold mb-4 text-white">3. Intellectual Property</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          The Service and its original content, features, and functionality are and will remain the exclusive property of PixelMorph Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">4. Disclaimer of Warranties</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          The Service is provided "as is" and "as available" without warranty of any kind, express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, secure, or free of viruses or other harmful components, nor do we warrant the accuracy, completeness, or reliability of any results obtained from the use of the Service.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">5. Limitation of Liability</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          In no event shall PixelMorph Inc., its directors, officers, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from: (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, even if we have been advised of the possibility of such damages.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">6. Governing Law</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">7. Changes to Terms</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white">8. Contact Us</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          If you have any questions about these Terms, please contact us at support@pixelmorph.com.
        </p>
      </div>
    </Layout>
  );
};

export default TermsOfService;
