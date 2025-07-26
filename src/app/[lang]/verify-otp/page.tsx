'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, ChevronDown, Sparkles, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AnimatedBackground } from '@/components/shared/animated-background';
import { getDictionary } from '@/lib/dictionary';

export default function VerifyOTPPage({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [lang, setLang] = useState('en');
  
  // State for verification type (email/phone)
  const [verificationType, setVerificationType] = useState<'email' | 'phone'>('phone');
  
  // State for input values
  const [contactValue, setContactValue] = useState('');
  const [otpValue, setOtpValue] = useState('');
  
  // State for button and timer
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for country selection
  const [selectedCountry, setSelectedCountry] = useState({ code: '+60', name: 'Malaysia', flag: '🇲🇾' });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  
  // Popular countries for phone verification
  const countries = [
    { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' },
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
    { code: '+46', name: 'Sweden', flag: '🇸🇪' },
    { code: '+47', name: 'Norway', flag: '🇳🇴' },
    { code: '+45', name: 'Denmark', flag: '🇩🇰' },
    { code: '+66', name: 'Thailand', flag: '🇹🇭' },
    { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
    { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
    { code: '+63', name: 'Philippines', flag: '🇵🇭' },
    { code: '+852', name: 'Hong Kong', flag: '🇭🇰' },
    { code: '+886', name: 'Taiwan', flag: '🇹🇼' },
  ];

  // Initialize language
  useEffect(() => {
    const initializeComponent = async () => {
      const resolvedParams = await params;
      setLang(resolvedParams.lang);
    };
    initializeComponent();
  }, [params]);

  const dictionary = getDictionary(lang);
  
  // Toggle between email and phone verification
  const toggleVerificationType = () => {
    setVerificationType(prev => prev === 'email' ? 'phone' : 'email');
    setContactValue('');
    setOtpValue('');
    setIsOtpSent(false);
    setCountdown(60);
    setIsCountryDropdownOpen(false);
  };
  
  // Handle country selection
  const handleCountrySelect = (country: typeof countries[0]) => {
    console.log('Country selected:', country);
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
  };
  
  // Send OTP handler
  const handleSendOtp = async () => {
    if (!contactValue) {
      toast({ 
        title: 'Error', 
        description: verificationType === 'email' ? dictionary.verifyOtp.errors.enterEmail : dictionary.verifyOtp.errors.enterPhone, 
        variant: 'destructive' 
      });
      return;
    }
    
    if (verificationType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue)) {
      toast({ title: 'Error', description: dictionary.verifyOtp.errors.validEmail, variant: 'destructive' });
      return;
    }
    
    if (verificationType === 'phone' && !/^\+?[0-9\s\-\(\)]{8,20}$/.test(contactValue)) {
      toast({ title: 'Error', description: dictionary.verifyOtp.errors.validPhone, variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Real API call to send OTP
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactValue: verificationType === 'phone' ? `${selectedCountry.code}${contactValue}` : contactValue,
          contactType: verificationType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      
      setIsOtpSent(true);
      toast({ 
        title: dictionary.verifyOtp.errors.otpSent, 
        description: dictionary.verifyOtp.errors.otpSentDescription.replace('{type}', verificationType === 'email' ? dictionary.verifyOtp.emailVerification.toLowerCase() : dictionary.verifyOtp.phoneVerification.toLowerCase()) 
      });
    } catch (error: any) {
      console.error('Send OTP error:', error);
      
      // Handle different error types
      if (error.message.includes('blacklist')) {
        toast({ 
          title: dictionary.verifyOtp.errors.accessRestricted, 
          description: dictionary.verifyOtp.errors.accessRestrictedDescription, 
          variant: 'destructive' 
        });
      } else if (error.message.includes('attempts')) {
        toast({ 
          title: dictionary.verifyOtp.errors.tooManyAttempts, 
          description: dictionary.verifyOtp.errors.tooManyAttemptsDescription, 
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: dictionary.verifyOtp.errors.sendFailed, 
          description: error.message || dictionary.verifyOtp.errors.sendFailedDescription, 
          variant: 'destructive' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Resend OTP handler
  const handleResendOtp = () => {
    setCountdown(60);
    handleSendOtp();
  };
  
  // Countdown timer effect
  useEffect(() => {
    if (!isOtpSent || countdown <= 0) return;
    
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isOtpSent, countdown]);
  
  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen]);
  
  // OTP verification handler
  const handleVerifyOtp = async () => {
    if (otpValue.length < 6) {
      toast({ 
        title: 'Error', 
        description: dictionary.verifyOtp.errors.enter6Digit, 
        variant: 'destructive' 
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Real API call to verify OTP
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactValue: verificationType === 'phone' ? `${selectedCountry.code}${contactValue}` : contactValue,
          contactType: verificationType,
          otpCode: otpValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify OTP');
      }
      
      toast({ 
        title: dictionary.verifyOtp.errors.verificationSuccessful, 
        description: dictionary.verifyOtp.errors.verificationSuccessfulDescription 
      });
      router.push('/');
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      
      // Handle different error types
      if (error.message.includes('blacklist')) {
        toast({ 
          title: dictionary.verifyOtp.errors.accessRestricted, 
          description: dictionary.verifyOtp.errors.accessRestrictedDescription, 
          variant: 'destructive' 
        });
        // Reset the form since they're blacklisted
        setIsOtpSent(false);
        setOtpValue('');
        setCountdown(60);
      } else if (error.message.includes('attempts')) {
        toast({ 
          title: dictionary.verifyOtp.errors.accountLocked, 
          description: dictionary.verifyOtp.errors.accountLockedDescription, 
          variant: 'destructive' 
        });
        // Reset the form
        setIsOtpSent(false);
        setOtpValue('');
        setCountdown(60);
      } else if (error.message.includes('expired')) {
        toast({ 
          title: dictionary.verifyOtp.errors.codeExpired, 
          description: dictionary.verifyOtp.errors.codeExpiredDescription, 
          variant: 'destructive' 
        });
        setIsOtpSent(false);
        setOtpValue('');
        setCountdown(60);
      } else {
        toast({ 
          title: dictionary.verifyOtp.errors.verificationFailed, 
          description: error.message || dictionary.verifyOtp.errors.verificationFailedDescription, 
          variant: 'destructive' 
        });
        // Clear OTP input for retry
        setOtpValue('');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/40 dark:from-background dark:via-background dark:to-emerald-950/30 relative overflow-hidden">
      {/* Background elements matching the hero section */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <AnimatedBackground intensity={3} speed={2} />
        
        {/* Main gradient blob */}
        <div className="absolute top-0 left-0 right-0 w-[95%] h-96 bg-gradient-to-br from-emerald-300/20 via-teal-200/15 to-transparent dark:from-emerald-700/15 dark:via-teal-800/10 dark:to-transparent blur-[100px] transform -translate-y-1/4 rounded-full mx-auto"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-[15%] left-[10%] w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-300/5 blur-xl animate-float-slow"></div>
        <div className="absolute top-[60%] right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-400/5 blur-xl animate-float-medium"></div>
        <div className="absolute bottom-[20%] left-[20%] w-20 h-20 rounded-full bg-gradient-to-br from-teal-400/10 to-emerald-300/5 blur-lg animate-float-fast"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-15 dark:opacity-8"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full backdrop-blur-sm shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {dictionary.verifyOtp.verificationRequired}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400">
              {dictionary.verifyOtp.passwordlessLogin}
            </h1>
            <p className="text-muted-foreground text-lg">
              {dictionary.verifyOtp.verifyIdentity}
            </p>
          </div>

          {/* Main verification card */}
          <Card className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-emerald-100/80 dark:border-emerald-800/50 shadow-xl">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>
            
            <CardHeader className="space-y-4 pb-6">
              <div className="flex items-center justify-between">
                {/* Verification type toggle */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{dictionary.verifyOtp.findJob}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{dictionary.verifyOtp.wantToHire}</span>
                  </div>
                </div>
                
                {/* Toggle button */}
                <button 
                  onClick={toggleVerificationType}
                  className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  aria-label={verificationType === 'email' ? 'Switch to phone verification' : 'Switch to email verification'}
                >
                  <div className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                    {verificationType === 'email' ? (
                      <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                </button>
              </div>
              
              <CardTitle className="text-2xl text-center font-bold">
                {verificationType === 'email' ? dictionary.verifyOtp.emailVerification : dictionary.verifyOtp.phoneVerification}
              </CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                {verificationType === 'email' 
                  ? dictionary.verifyOtp.emailDescription 
                  : dictionary.verifyOtp.phoneDescription}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Contact input section */}
              <div className="space-y-4">
                {verificationType === 'phone' ? (
                  <div className="relative">
                    <div className="flex">
                      <div className="relative" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          disabled={isOtpSent}
                          className="flex items-center gap-2 px-3 py-2 border border-r-0 border-emerald-200 dark:border-emerald-800 rounded-l-lg bg-emerald-50/50 dark:bg-emerald-900/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="text-base">{selectedCountry.flag}</span>
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            {selectedCountry.code}
                          </span>
                          <ChevronDown className={`h-4 w-4 text-emerald-600 dark:text-emerald-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Country Dropdown */}
                        {isCountryDropdownOpen && (
                          <div className="absolute top-full left-0 z-50 w-64 mt-1 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {countries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => handleCountrySelect(country)}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                              >
                                <span className="text-base">{country.flag}</span>
                                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 min-w-[3rem]">
                                  {country.code}
                                </span>
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                  {country.name}
                                </span>
                                {selectedCountry.code === country.code && (
                                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 ml-auto" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <Input
                        type="tel"
                        placeholder={dictionary.verifyOtp.placeholders.phone}
                        value={contactValue}
                        onChange={(e) => setContactValue(e.target.value)}
                        disabled={isOtpSent}
                        className="flex-1 rounded-l-none border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80"
                      />
                    </div>
                  </div>
                ) : (
                  <Input
                    type="email"
                    placeholder={dictionary.verifyOtp.placeholders.email}
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    disabled={isOtpSent}
                    className="w-full border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white/80 dark:bg-gray-800/80"
                  />
                )}
                
                {/* OTP input section */}
                {isOtpSent && (
                  <div className="space-y-4 pt-2">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        {dictionary.verifyOtp.enterCode.replace('{type}', verificationType === 'email' ? dictionary.verifyOtp.emailVerification.toLowerCase() : dictionary.verifyOtp.phoneVerification.toLowerCase())}
                      </p>
                      
                      <div className="flex justify-center">
                        <InputOTP 
                          value={otpValue} 
                          onChange={setOtpValue}
                          maxLength={6}
                          className="gap-2"
                        >
                          <InputOTPGroup className="gap-2">
                            {[...Array(6)].map((_, index) => (
                              <InputOTPSlot 
                                key={index} 
                                index={index}
                                className="w-12 h-12 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400 text-lg font-semibold"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="space-y-3">
                {!isOtpSent ? (
                  <Button 
                    onClick={handleSendOtp}
                    disabled={!contactValue || isLoading}
                    className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all py-6 text-lg font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {dictionary.verifyOtp.sendingCode}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        {dictionary.verifyOtp.sendCode}
                      </div>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      onClick={handleVerifyOtp}
                      disabled={otpValue.length < 6 || isLoading}
                      className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all py-6 text-lg font-medium"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          {dictionary.verifyOtp.verifying}
                        </div>
                      ) : (
                        dictionary.verifyOtp.loginRegister
                      )}
                    </Button>
                    
                    <Button 
                      onClick={handleResendOtp}
                      disabled={isLoading || countdown > 0}
                      variant="outline"
                      className="w-full rounded-lg border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 py-6 text-lg"
                    >
                      {countdown > 0 ? dictionary.verifyOtp.resendCodeTimer.replace('{time}', countdown.toString()) : dictionary.verifyOtp.resendCode}
                    </Button>
                  </div>
                )}
              </div>
              
              {/* WeChat login option */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-emerald-100 dark:border-emerald-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-muted-foreground">or</span>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full rounded-lg border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 py-6 text-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">微</span>
                  </div>
                  {dictionary.verifyOtp.wechatLogin}
                </div>
              </Button>
            </CardContent>
          </Card>
          
          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
              <span>
                {dictionary.verifyOtp.termsText}{' '}
                <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">{dictionary.verifyOtp.termsOfService}</a>{' '}
                {dictionary.verifyOtp.and}{' '}
                <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">{dictionary.verifyOtp.privacyPolicy}</a>
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{dictionary.verifyOtp.customerService}</p>
              <p>{dictionary.verifyOtp.licenseInfo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}