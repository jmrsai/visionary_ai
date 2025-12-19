import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
          <CardDescription>Last updated: July 29, 2024</CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Visionary. We are committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our application.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The
            information we may collect on the Service includes:
          </p>
          <ul>
            <li>
              <strong>Personal Data:</strong> Personally identifiable
              information, such as your name, email address, and demographic
              information, that you voluntarily give to us when you register with
              the Service.
            </li>
            <li>
              <strong>Health & Activity Data:</strong> Information you provide
              through eye tests, exercises, symptom checkers, and other
              health-related features of the app. This data is treated with the
              highest level of security.
            </li>
            <li>
              <strong>Derivative Data:</strong> Information our servers
              automatically collect when you access the Service, such as your IP
              address, your browser type, your operating system, your access
              times, and the pages you have viewed directly before and after
              accessing the Service.
            </li>
          </ul>

          <h2>3. Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with
            a smooth, efficient, and customized experience. Specifically, we may
            use information collected about you via the Service to:
          </p>
          <ul>
            <li>Create and manage your account.</li>
            <li>
              Generate a personal profile of you to make future visits to the
              Service more personalized.
            </li>
            <li>
              Provide you with personalized eye exercise routines and health
              insights.
            </li>
            <li>
              Anonymously use data to train and improve our AI models and
              overall service quality.
            </li>
            <li>Monitor and analyze usage and trends to improve your experience.</li>
          </ul>

          <h2>4. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to
            help protect your personal information. While we have taken
            reasonable steps to secure the personal information you provide to
            us, please be aware that despite our efforts, no security measures
            are perfect or impenetrable, and no method of data transmission can
            be guaranteed against any interception or other type of misuse.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please
            contact us at: privacy@visionary.app
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
