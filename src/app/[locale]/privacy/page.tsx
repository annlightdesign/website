import { getTranslations } from 'next-intl/server';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Ann Light Design Privacy Policy and data collection guidelines.',
};

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('common'); // Assuming 'common' namespace for basic translations if any

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Shield className="w-10 h-10 text-muted-foreground opacity-50" />
          <h1 className="text-4xl font-light tracking-widest uppercase">Privacy Policy</h1>
        </div>

        <div className="space-y-10 text-muted-foreground font-light leading-relaxed">
          <section>
            <h2 className="text-xl text-foreground font-medium mb-4 uppercase tracking-wider">1. Overview</h2>
            <p>
              At Ann Light Design, we are committed to maintaining the trust and confidence of our visitors to our web site. 
              In this Privacy Policy, we provide detailed information on when and why we collect your personal and non-personal data, 
              how we use it, the limited conditions under which we may disclose it to others, and how we keep it secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-foreground font-medium mb-4 uppercase tracking-wider">2. Analytics & Server Logs</h2>
            <p>
              When someone visits our website, we use our own proprietary server logging system to collect standard internet log 
              information and details of visitor behavior patterns. We do this to find out things such as the number of visitors to 
              various parts of the site, which types of devices are used, and general geographic regions (such as City or Country).
            </p>
            <p className="mt-4">
              <strong>Data Collected:</strong> This includes your IP address, browser type, operating system, and the specific pages 
              you visit. This information is completely anonymous and is strictly processed in a way which does not publicly identify anyone. 
              We do not make any attempt to find out the personal identities of those visiting our website. We collect this data 
              specifically to ensure the security of our platform and to optimize the user experience dynamically.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-foreground font-medium mb-4 uppercase tracking-wider">3. Information Submitted Voluntarily</h2>
            <p>
              If you use our Contact form or Project Inquiry features, the data you enter (such as Name, Email, and Phone) is stored 
              securely in our database solely for the purpose of communicating with you regarding your inquiry. We do not sell, rent, 
              or trade email lists with other companies and businesses for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-foreground font-medium mb-4 uppercase tracking-wider">4. Third Parties</h2>
            <p>
              Because we value your privacy, we intentionally avoid injecting invasive third-party tracking scripts (such as Google Analytics 
              or Facebook Pixels) onto our platform. Any analytics are kept strictly internal via our secure server environment.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-foreground font-medium mb-4 uppercase tracking-wider">5. Access to Your Personal Information</h2>
            <p>
              You are entitled to view, amend, or delete the personal information that we hold. Email your request to our data protection 
              team at <a href="mailto:ann.light.design@gmail.com" className="text-foreground border-b border-foreground/30 hover:border-foreground transition-colors">ann.light.design@gmail.com</a>.
            </p>
          </section>

          <section className="pt-10 border-t border-border/40 text-sm">
            <p>Last updated: April 2026</p>
          </section>
        </div>
      </div>
    </div>
  );
}
