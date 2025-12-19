import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
          <CardDescription>Last updated: July 29, 2024</CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Agreement to Terms</h2>
          <p>
            By using our application, Visionary, you agree to be bound by
            these Terms of Service. If you do not agree to these Terms, do not
            use the Service.
          </p>

          <h2>2. Medical Disclaimer</h2>
          <p>
            <strong>
              Visionary is not a medical device and does not provide medical
              advice.
            </strong>
          </p>
          <p>
            The Service is intended for informational and educational purposes
            only. The tests, exercises, and AI-powered insights are designed to
            help you monitor and understand your eye health, but they are not a
            substitute for professional medical advice, diagnosis, or treatment.
            Always seek the advice of your physician or other qualified health
            provider with any questions you may have regarding a medical
-           condition.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            You are responsible for safeguarding your account and for any
            activities or actions under your account. You agree to notify us
            immediately of any unauthorized use of your account.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality
            are and will remain the exclusive property of Visionary Inc. and its
            licensors.
          </p>

          <h2>5. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall Visionary, nor its directors, employees, partners,
            agents, suppliers, or affiliates, be liable for any indirect,
            incidental, special, consequential or punitive damages, including
            without limitation, loss of profits, data, use, goodwill, or other
            intangible losses, resulting from your access to or use of or
            inability to access or use the Service.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            legal@visionary.app
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
