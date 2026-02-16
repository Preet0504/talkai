export default function TermsOfService() {
  const lastUpdated = "September 21, 2025";

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
        Terms of Service
      </h1>
      <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

      {/* Content */}
      <div className="prose prose-gray max-w-none dark:prose-invert mt-8">
        <div className="space-y-8">
          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Agreement to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Meet AI&apos;s services, you agree to be
              bound by these Terms of Service and all applicable laws and
              regulations. If you do not agree with any of these terms, you are
              prohibited from using our services.
            </p>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Description of Service
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Meet AI provides an AI-powered video meeting platform that enables
              users to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                Create and manage custom AI agents for customer conversations
              </li>
              <li>Conduct video calls with AI agent participation</li>
              <li>Generate automatic meeting summaries and transcripts</li>
              <li>Access conversation analytics and insights</li>
              <li>Integrate with business workflows and systems</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              User Accounts
            </h2>

            <h3 className="text-xl font-medium text-foreground mb-3">
              Account Creation
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To use our services, you must create an account with accurate and
              complete information. You are responsible for maintaining the
              security of your account credentials.
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">
              Account Responsibilities
            </h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate and current information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
              <li>Use the service only for lawful purposes</li>
            </ul>
          </section>

          {/* Subscription Plans */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Subscription Plans and Billing
            </h2>

            <h3 className="text-xl font-medium text-foreground mb-3">
              Free Tier
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We offer a free tier with limited features, including up to 2 AI
              agents and 1 meeting per month.
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">
              Premium Plans
            </h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                Subscription fees are billed in advance on a monthly or annual
                basis
              </li>
              <li>All payments are non-refundable except as required by law</li>
              <li>
                We reserve the right to change pricing with 30 days notice
              </li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You may cancel your subscription at any time</li>
            </ul>
          </section>

          {/* Usage Guidelines */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Acceptable Use
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree not to use our services to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malicious code or conduct security attacks</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Share inappropriate, offensive, or illegal content</li>
              <li>Attempt to reverse engineer our software</li>
              <li>Use the service for competitive intelligence gathering</li>
            </ul>
          </section>

          {/* AI Usage */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              AI Services and Content
            </h2>

            <h3 className="text-xl font-medium text-foreground mb-3">
              AI-Generated Content
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our AI agents generate summaries, insights, and responses based on
              meeting content. While we strive for accuracy, AI-generated
              content may contain errors or inaccuracies.
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">
              User Responsibility
            </h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Review and verify all AI-generated content before use</li>
              <li>Do not rely solely on AI outputs for critical decisions</li>
              <li>
                Ensure appropriate consent for recording and processing
                conversations
              </li>
              <li>
                Comply with applicable laws regarding AI use in your
                jurisdiction
              </li>
            </ul>
          </section>

          {/* Data and Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Data and Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your use of our services is also governed by our Privacy Policy.
              By using our services, you consent to our data practices as
              described in the Privacy Policy.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You retain ownership of your content and data</li>
              <li>We process data only as necessary to provide our services</li>
              <li>
                Meeting recordings and transcripts are encrypted and secure
              </li>
              <li>You can delete your data and account at any time</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Meet AI platform, including software, algorithms, and user
              interface, is protected by intellectual property laws.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                We grant you a limited, non-exclusive license to use our
                services
              </li>
              <li>You may not copy, modify, or distribute our software</li>
              <li>You retain rights to your original content and data</li>
              <li>Respect third-party intellectual property rights</li>
            </ul>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Service Availability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain high service availability but cannot
              guarantee uninterrupted service. We may perform maintenance,
              updates, or modifications that temporarily affect service
              availability. We are not liable for any service interruptions or
              downtime.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Meet AI shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, including but not limited to loss of profits,
              data, use, or other intangible losses resulting from your use of
              our services.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may terminate or suspend your account and access to our
              services at any time for violations of these terms or for any
              other reason at our sole discretion.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You may terminate your account at any time by contacting us. Upon
              termination, your right to use our services ceases immediately.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Changes to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. We will
              notify users of significant changes via email or through our
              platform. Continued use of our services after changes constitutes
              acceptance of the modified terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Governing Law
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms are governed by and construed in accordance with the
              laws of [Your Jurisdiction]. Any disputes arising from these terms
              or our services shall be resolved in the courts of [Your
              Jurisdiction].
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these Terms of Service, please contact
              us:
            </p>
            <div className="mt-4 text-muted-foreground">
              <p>Email: legal@meetai.com</p>
              <p>Address: [Your Company Address]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
