'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, Shield, Users, Briefcase } from 'lucide-react';
import { getPageDictionary } from '@/translations';
import { type LocalizedPageProps } from '@/lib/navigation';
import { AnimatedBackground } from '@/components/shared/animated-background';

export default function TermsOfServicePage({ params }: LocalizedPageProps) {
  const [dictionary, setDictionary] = useState<any>({});
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setLang(resolvedParams.lang);
      
      try {
        const dict = await getPageDictionary('terms', resolvedParams.lang);
        setDictionary(dict);
      } catch (error) {
        console.error('Failed to load dictionary:', error);
      }
    };

    resolveParams();
  }, [params]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/40 dark:from-background dark:via-background dark:to-emerald-950/30 relative">
      <AnimatedBackground />
      
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {dictionary?.terms?.backToHome || 'Back to Home'}
          </Link>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <FileText className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {dictionary?.terms?.title || 'Terms of Service'}
            </h1>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {dictionary?.terms?.lastUpdated?.replace('{date}', new Date().toLocaleDateString()) || `Last updated: ${new Date().toLocaleDateString()}`}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 space-y-8">
          
          {/* Section 1: Agreement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-emerald-600" />
              1. {dictionary?.terms?.sections?.agreement?.title || 'Agreement to Terms'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.terms?.sections?.agreement?.content?.[0] || "By accessing and using Huntier (\"we,\" \"our,\" or \"us\"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {dictionary?.terms?.sections?.agreement?.content?.[1] || "These Terms of Service govern your use of our AI-powered cross-border HR platform that connects skilled professionals with global opportunities."}
            </p>
          </section>

          {/* Section 2: Service Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-emerald-600" />
              2. {dictionary?.terms?.sections?.serviceDescription?.title || 'Service Description'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.terms?.sections?.serviceDescription?.intro || 'Huntier provides an online platform that offers:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              {dictionary?.terms?.sections?.serviceDescription?.services?.map((service: string, index: number) => (
                <li key={index}>{service}</li>
              )) || [
                <li key="1">Job search and application services</li>,
                <li key="2">AI-powered resume optimization tools</li>,
                <li key="3">AI mock interview preparation</li>,
                <li key="4">Professional profile creation and management</li>,
                <li key="5">Cross-border recruitment solutions</li>,
                <li key="6">Career guidance and skill assessment tools</li>
              ]}
            </ul>
          </section>

          {/* Section 3: User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-emerald-600" />
              3. {dictionary?.terms?.sections?.userAccounts?.title || 'User Accounts and Registration'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.terms?.sections?.userAccounts?.intro || 'To access certain features of our service, you must register for an account. You agree to:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              {dictionary?.terms?.sections?.userAccounts?.requirements?.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              )) || [
                <li key="1">Provide accurate, current, and complete information during the registration process</li>,
                <li key="2">Maintain the security of your password and identification</li>,
                <li key="3">Notify us immediately of any unauthorized access to your account</li>,
                <li key="4">Accept responsibility for all activities that occur under your account</li>
              ]}
            </ul>
          </section>

          {/* Section 4: User Conduct */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. {dictionary?.terms?.sections?.userConduct?.title || 'User Conduct and Prohibited Uses'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.terms?.sections?.userConduct?.intro || 'You agree not to use the service to:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              {dictionary?.terms?.sections?.userConduct?.prohibitions?.map((prohibition: string, index: number) => (
                <li key={index}>{prohibition}</li>
              )) || [
                <li key="1">Upload false, misleading, or fraudulent information</li>,
                <li key="2">Violate any applicable laws or regulations</li>,
                <li key="3">Harass, abuse, or harm other users</li>,
                <li key="4">Spam or send unsolicited communications</li>,
                <li key="5">Attempt to gain unauthorized access to our systems</li>,
                <li key="6">Use automated systems to access the service without permission</li>
              ]}
            </ul>
          </section>

          {/* Section 5: AI Services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. {dictionary?.terms?.sections?.aiServices?.title || 'AI-Powered Services'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.terms?.sections?.aiServices?.intro || 'Our AI services, including resume optimization and mock interviews, are provided "as is." While we strive for accuracy:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              {dictionary?.terms?.sections?.aiServices?.disclaimers?.map((disclaimer: string, index: number) => (
                <li key={index}>{disclaimer}</li>
              )) || [
                <li key="1">AI suggestions are recommendations, not guarantees of employment success</li>,
                <li key="2">Users should review and verify all AI-generated content</li>,
                <li key="3">We continuously improve our AI models but cannot guarantee perfection</li>,
                <li key="4">Users retain ownership of their uploaded content and data</li>
              ]}
            </ul>
          </section>

          {/* Section 6: Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. {dictionary?.terms?.sections?.privacy?.title || 'Privacy and Data Protection'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your privacy is important to us. Please review our{' '}
              <Link href={`/${lang}/privacy`} className="text-emerald-600 hover:text-emerald-700 underline">
                {dictionary?.terms?.sections?.privacy?.privacyLinkText || 'Privacy Policy'}
              </Link>
              {' '}to understand how we collect, use, and protect your information.
            </p>
          </section>

          {/* Section 7: Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. {dictionary?.terms?.sections?.termination?.title || 'Termination'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {dictionary?.terms?.sections?.termination?.content || 'We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.'}
            </p>
          </section>

          {/* Section 8: Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. {dictionary?.terms?.sections?.disclaimers?.title || 'Disclaimers and Limitation of Liability'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.terms?.sections?.disclaimers?.intro || 'The service is provided "as is" without warranties of any kind. We do not guarantee:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              {dictionary?.terms?.sections?.disclaimers?.noGuarantees?.map((guarantee: string, index: number) => (
                <li key={index}>{guarantee}</li>
              )) || [
                <li key="1">Employment opportunities or job placement success</li>,
                <li key="2">Continuous, uninterrupted service availability</li>,
                <li key="3">Error-free operation of our platform</li>,
                <li key="4">Specific outcomes from using our AI services</li>
              ]}
            </ul>
          </section>

          {/* Section 9: Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-emerald-600" />
              9. {dictionary?.terms?.sections?.changes?.title || 'Changes to Terms'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {dictionary?.terms?.sections?.changes?.content || 'We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through our platform. Continued use of the service after changes constitutes acceptance of the new terms.'}
            </p>
          </section>

          {/* Section 10: Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. {dictionary?.terms?.sections?.contact?.title || 'Contact Information'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {dictionary?.terms?.sections?.contact?.intro || 'If you have any questions about these Terms of Service, please contact us at:'}
            </p>
            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>{dictionary?.terms?.sections?.contact?.email || 'Email'}:</strong> general@gohuntier.com<br />
                <strong>{dictionary?.terms?.sections?.contact?.phone || 'Phone'}:</strong> +86 13857863960<br />
                <strong>{dictionary?.terms?.sections?.contact?.address || 'Address'}:</strong> 1008, building 7, SkyBridge SOHO, No. 968, Jinzhong Road, Changning District, Shanghai
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400">
            {dictionary?.terms?.footer?.copyright?.replace('{year}', new Date().getFullYear().toString()) || `© ${new Date().getFullYear()} Huntier Inc. All rights reserved.`}
          </p>
        </div>
      </div>
    </div>
  );
}