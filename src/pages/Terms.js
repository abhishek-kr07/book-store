import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="container my-5">
      <h1 className="mb-4">Terms and Conditions</h1>
      
      <div className="card">
        <div className="card-body">
          <h2 className="h5 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using QuickDesk, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
          </p>
          
          <h2 className="h5 mb-3 mt-4">2. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for all activities that occur under your account.
          </p>
          <p>
            We reserve the right to disable any user account if, in our opinion, you have violated any provision of these Terms.
          </p>
          
          <h2 className="h5 mb-3 mt-4">3. Privacy Policy</h2>
          <p>
            Your use of QuickDesk is also governed by our Privacy Policy, which is incorporated into these Terms by reference.
          </p>
          
          <h2 className="h5 mb-3 mt-4">4. User Content</h2>
          <p>
            You retain ownership of any content you submit, post, or display on or through QuickDesk. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute it in any media.
          </p>
          <p>
            You are solely responsible for your content and the consequences of sharing it. You represent and warrant that you own or have the necessary rights to the content you share.
          </p>
          
          <h2 className="h5 mb-3 mt-4">5. Prohibited Activities</h2>
          <p>
            You agree not to engage in any of the following activities:
          </p>
          <ul>
            <li>Violating any applicable laws or regulations</li>
            <li>Impersonating any person or entity</li>
            <li>Interfering with or disrupting the service</li>
            <li>Attempting to gain unauthorized access to any part of the service</li>
            <li>Using the service for any illegal or unauthorized purpose</li>
            <li>Posting content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
          </ul>
          
          <h2 className="h5 mb-3 mt-4">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, QuickDesk shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of the service.
          </p>
          
          <h2 className="h5 mb-3 mt-4">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the new Terms on the service. Your continued use of the service after such changes constitutes your acceptance of the new Terms.
          </p>
          
          <h2 className="h5 mb-3 mt-4">8. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the service at our sole discretion, without prior notice or liability, for any reason, including breach of these Terms.
          </p>
          
          <h2 className="h5 mb-3 mt-4">9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which QuickDesk operates, without regard to its conflict of law provisions.
          </p>
          
          <h2 className="h5 mb-3 mt-4">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@quickdesk.example.com.
          </p>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <Link to="/register" className="btn btn-primary">Back to Registration</Link>
      </div>
    </div>
  );
};

export default Terms;