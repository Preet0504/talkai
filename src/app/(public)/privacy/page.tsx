export default function PrivacyPolicy() {
  const lastUpdated = "September 21, 2025";

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
        Privacy Policy
      </h1>
      <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

      {/* Content */}
      <div className="prose prose-gray max-w-none dark:prose-invert mt-8">
        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Meet AI ("we," "our," or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our
              AI-powered video meeting platform and services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Information We Collect
            </h2>

            <h3 className="text-xl font-medium text-foreground mb-3">
              Personal Information
            </h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Name and email address when you create an account</li>
              <li>Profile information and preferences</li>
              <li>Payment information for premium subscriptions</li>
              <li>Communication preferences and settings</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
              Meeting Data
            </h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Video call recordings and transcripts (when enabled)</li>
              <li>AI-generated meeting summaries and insights</li>
              <li>Chat messages and conversation history</li>
              <li>Meeting metadata (duration, participants, timestamps)</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
              Technical Information
            </h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Usage analytics and performance metrics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide and improve our AI-powered meeting services</li>
              <li>Generate meeting summaries and insights using AI</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important service notifications and updates</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Ensure security and prevent fraudulent activities</li>
              <li>Comply with legal obligations and requests</li>
            </ul>
          </section>

          {/* AI and Data Processing */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              AI and Data Processing
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our AI agents process meeting content to provide intelligent
              summaries and insights. This processing includes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Real-time transcription of audio during meetings</li>
              <li>Natural language processing for content analysis</li>
              <li>Generation of structured meeting summaries</li>
              <li>Extraction of action items and key decisions</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              All AI processing is performed securely, and we do not use your
              meeting content to train our models or share it with third parties
              without your consent.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Information Sharing
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell your personal information. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>With your explicit consent</li>
              <li>With service providers who assist in our operations</li>
              <li>To comply with legal obligations or court orders</li>
              <li>To protect our rights, property, or safety</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your
              information, including encryption in transit and at rest, secure
              data centers, regular security audits, and access controls.
              However, no method of transmission over the internet is 100%
              secure.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Portability of your data</li>
              <li>Restriction of processing</li>
              <li>Objection to processing</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Data Retention
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your information for as long as necessary to provide our
              services and comply with legal obligations. Meeting recordings and
              transcripts are retained according to your settings and
              subscription plan. You can delete your account and associated data
              at any time.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or our data
              practices, please contact us at:
            </p>
            <div className="mt-4 text-muted-foreground">
              <p>Email: privacy@meetai.com</p>
              <p>Address: [Your Company Address]</p>
            </div>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new Privacy
              Policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
