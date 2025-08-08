'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Lock, Globe, UserCheck, Settings } from 'lucide-react';
import { getPageDictionary } from '@/translations';
import { type LocalizedPageProps } from '@/lib/navigation';
import { AnimatedBackground } from '@/components/shared/animated-background';

export default function PrivacyPolicyPage({ params }: LocalizedPageProps) {
  const [dictionary, setDictionary] = useState<any>({});
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setLang(resolvedParams.lang);
      
      try {
        const dict = await getPageDictionary('privacy', resolvedParams.lang);
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
            {dictionary?.privacy?.backToHome || 'Back to Home'}
          </Link>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {dictionary?.privacy?.title || 'Privacy Policy'}
            </h1>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {dictionary?.privacy?.lastUpdated?.replace('{date}', new Date().toLocaleDateString()) || `Last updated: ${new Date().toLocaleDateString()}`}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 space-y-8">
          
          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-emerald-600" />
              1. {dictionary?.privacy?.sections?.introduction?.title || 'Introduction'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.privacy?.sections?.introduction?.content?.[0] || 'At Huntier, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered HR platform.'}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {dictionary?.privacy?.sections?.introduction?.content?.[1] || 'By using our service, you consent to the collection and use of information in accordance with this policy.'}
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-emerald-600" />
              2. {dictionary?.privacy?.sections?.informationWeCollect?.title || 'Information We Collect'}
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{dictionary?.privacy?.sections?.informationWeCollect?.personalInfo?.title || 'Personal Information'}</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
              {dictionary?.privacy?.sections?.informationWeCollect?.personalInfo?.items?.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              )) || [
                <li key="1">Name, email address, and phone number</li>,
                <li key="2">Professional information (work experience, education, skills)</li>,
                <li key="3">Resume and CV documents</li>,
                <li key="4">Job preferences and career goals</li>,
                <li key="5">Profile photos and other uploaded content</li>
              ]}
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{dictionary?.privacy?.sections?.informationWeCollect?.automaticInfo?.title || 'Automatically Collected Information'}</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
              {dictionary?.privacy?.sections?.informationWeCollect?.automaticInfo?.items?.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              )) || [
                <li key="1">IP address and browser information</li>,
                <li key="2">Device information and operating system</li>,
                <li key="3">Usage patterns and interaction data</li>,
                <li key="4">Cookies and similar tracking technologies</li>,
                <li key="5">Location data (with your consent)</li>
              ]}
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{dictionary?.privacy?.sections?.informationWeCollect?.aiGeneratedData?.title || 'AI-Generated Data'}</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              {dictionary?.privacy?.sections?.informationWeCollect?.aiGeneratedData?.items?.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              )) || [
                <li key="1">Resume optimization suggestions and improvements</li>,
                <li key="2">Mock interview responses and performance analytics</li>,
                <li key="3">Job matching recommendations and compatibility scores</li>,
                <li key="4">Career guidance and skill assessment results</li>
              ]}
            </ul>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings className="h-6 w-6 text-emerald-600" />
              3. {dictionary?.privacy?.sections?.howWeUse?.title || 'How We Use Your Information'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.privacy?.sections?.howWeUse?.intro || 'We use your information to:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              {dictionary?.privacy?.sections?.howWeUse?.purposes?.map((purpose: string, index: number) => (
                <li key={index}>{purpose}</li>
              )) || [
                <li key="1">Provide and maintain our job search and recruitment services</li>,
                <li key="2">Deliver AI-powered resume optimization and interview preparation</li>,
                <li key="3">Match you with relevant job opportunities</li>,
                <li key="4">Communicate with you about our services and updates</li>,
                <li key="5">Improve our AI algorithms and platform functionality</li>,
                <li key="6">Ensure security and prevent fraudulent activity</li>,
                <li key="7">Comply with legal obligations and enforce our terms</li>
              ]}
            </ul>
          </section>

          {/* Section 4: AI and Machine Learning */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. {dictionary?.privacy?.sections?.aiProcessing?.title || 'AI and Machine Learning Processing'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.privacy?.sections?.aiProcessing?.intro || 'Our AI services process your data to provide personalized recommendations:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
              {dictionary?.privacy?.sections?.aiProcessing?.services?.map((service: any, index: number) => (
                <li key={index}>
                  <strong>{service.name || 'Service'}:</strong> {service.description || 'Description'}
                </li>
              )) || [
                <li key="1"><strong>Resume Analysis:</strong> We analyze your resume content to suggest improvements and optimize formatting</li>,
                <li key="2"><strong>Interview Simulation:</strong> We process your responses to provide feedback and improvement suggestions</li>,
                <li key="3"><strong>Job Matching:</strong> We use your profile data to recommend relevant job opportunities</li>,
                <li key="4"><strong>Skill Assessment:</strong> We evaluate your skills and experience to provide career guidance</li>
              ]}
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {dictionary?.privacy?.sections?.aiProcessing?.disclaimer || 'All AI processing is designed to benefit you directly and improve your job search experience. We do not use your data to train general AI models without your explicit consent.'}
            </p>
          </section>

          {/* Section 5: Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-emerald-600" />
              5. {dictionary?.privacy?.sections?.informationSharing?.title || 'Information Sharing and Disclosure'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.privacy?.sections?.informationSharing?.intro || 'We do not sell your personal information. We may share your information in the following circumstances:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              {dictionary?.privacy?.sections?.informationSharing?.circumstances?.map((circumstance: any, index: number) => (
                <li key={index}>
                  <strong>{circumstance.type || 'Type'}:</strong> {circumstance.description || 'Description'}
                </li>
              )) || [
                <li key="1"><strong>With Your Consent:</strong> When you authorize us to share information with potential employers</li>,
                <li key="2"><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform</li>,
                <li key="3"><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>,
                <li key="4"><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>,
                <li key="5"><strong>Anonymized Data:</strong> We may share aggregated, non-personally identifiable information for research purposes</li>
              ]}
            </ul>
          </section>

          {/* Section 6: Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-emerald-600" />
              6. {dictionary?.privacy?.sections?.dataSecurity?.title || 'Data Security'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.privacy?.sections?.dataSecurity?.intro || 'We implement industry-standard security measures to protect your information:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              {dictionary?.privacy?.sections?.dataSecurity?.measures?.map((measure: string, index: number) => (
                <li key={index}>{measure}</li>
              )) || [
                <li key="1">Encryption of data in transit and at rest</li>,
                <li key="2">Regular security audits and vulnerability assessments</li>,
                <li key="3">Access controls and authentication measures</li>,
                <li key="4">Secure cloud infrastructure with trusted providers</li>,
                <li key="5">Employee training on data protection and privacy</li>
              ]}
            </ul>
          </section>

          {/* Section 7: Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-emerald-600" />
              7. {dictionary?.privacy?.sections?.yourRights?.title || 'Your Privacy Rights'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.privacy?.sections?.yourRights?.intro || 'You have the following rights regarding your personal information:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              {dictionary?.privacy?.sections?.yourRights?.rights?.map((right: any, index: number) => (
                <li key={index}>
                  <strong>{right.right || 'Right'}:</strong> {right.description || 'Description'}
                </li>
              )) || [
                <li key="1"><strong>Access:</strong> Request copies of your personal data</li>,
                <li key="2"><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>,
                <li key="3"><strong>Deletion:</strong> Request deletion of your personal data (subject to certain exceptions)</li>,
                <li key="4"><strong>Portability:</strong> Request transfer of your data in a structured, machine-readable format</li>,
                <li key="5"><strong>Objection:</strong> Object to certain types of processing</li>,
                <li key="6"><strong>Restriction:</strong> Request restriction of processing under certain circumstances</li>
              ]}
            </ul>
          </section>

          {/* Section 8: Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. {dictionary?.privacy?.sections?.cookies?.title || 'Cookies and Tracking Technologies'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.privacy?.sections?.cookies?.intro || 'We use cookies and similar technologies to:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
              {dictionary?.privacy?.sections?.cookies?.purposes?.map((purpose: string, index: number) => (
                <li key={index}>{purpose}</li>
              )) || [
                <li key="1">Remember your preferences and settings</li>,
                <li key="2">Analyze site traffic and usage patterns</li>,
                <li key="3">Provide personalized content and recommendations</li>,
                <li key="4">Maintain security and prevent fraud</li>
              ]}
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {dictionary?.privacy?.sections?.cookies?.control || 'You can control cookie settings through your browser preferences. However, disabling certain cookies may limit some functionality of our service.'}
            </p>
          </section>

          {/* Section 9: International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. {dictionary?.privacy?.sections?.internationalTransfers?.title || 'International Data Transfers'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {dictionary?.privacy?.sections?.internationalTransfers?.content || 'As a global platform, we may transfer your information to countries outside your residence. We ensure appropriate safeguards are in place to protect your data during international transfers, including standard contractual clauses and adequacy decisions where applicable.'}
            </p>
          </section>

          {/* Section 10: Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. {dictionary?.privacy?.sections?.dataRetention?.title || 'Data Retention'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {dictionary?.privacy?.sections?.dataRetention?.content || 'We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law.'}
            </p>
          </section>

          {/* Section 11: Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              11. {dictionary?.privacy?.sections?.changes?.title || 'Changes to This Privacy Policy'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {dictionary?.privacy?.sections?.changes?.content || 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically for any changes.'}
            </p>
          </section>

          {/* Section 12: Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              12. {dictionary?.privacy?.sections?.contact?.title || 'Contact Us'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {dictionary?.privacy?.sections?.contact?.intro || 'If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:'}
            </p>
            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
               <strong>{dictionary?.privacy?.sections?.contact?.email || 'Email'}:</strong> general@gohuntier.com<br />
                <strong>{dictionary?.privacy?.sections?.contact?.phone || 'Phone'}:</strong> +86 13857863960<br />
                <strong>{dictionary?.privacy?.sections?.contact?.address || 'Address'}:</strong> 1008, building 7, SkyBridge SOHO, No. 968, Jinzhong Road, Changning District, Shanghai
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400">
            {dictionary?.privacy?.footer?.copyright?.replace('{year}', new Date().getFullYear().toString()) || `© ${new Date().getFullYear()} Huntier Inc. All rights reserved.`}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            <Link href={`/${lang}/terms`} className="text-emerald-600 hover:text-emerald-700 underline">
              {dictionary?.privacy?.footer?.links?.terms || 'Terms of Service'}
            </Link>
            {' • '}
            <Link href={`/${lang}/privacy`} className="text-emerald-600 hover:text-emerald-700 underline">
              {dictionary?.privacy?.footer?.links?.privacy || 'Privacy Policy'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}