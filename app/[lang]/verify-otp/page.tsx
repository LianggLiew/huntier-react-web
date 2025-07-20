'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, ChevronDown, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { AnimatedBackground } from '@/components/animated-background';
import {inBlackList, addToBlacklist} from "@/model/blacklist";
import {matchOTP, sendOTP} from "@/model/otp";
import {getAttemptCnt, getResendCnt, addResendCnt, addAttemptCnt} from "@/model/database";

// Removed server-side import that caused Node.js module errors

export default function VerifyOTPPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // State for verification type (email/phone)
  const [verificationType, setVerificationType] = useState<'email' | 'phone'>('phone');
  
  // State for input values
  const [contactValue, setContactValue] = useState('');
  const [otpValue, setOtpValue] = useState('');
  
  // State for button and timer
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Toggle between email and phone verification
  const toggleVerificationType = () => {
    setVerificationType(prev => prev === 'email' ? 'phone' : 'email');
    setContactValue('');
    setOtpValue('');
    setIsOtpSent(false);
    setCountdown(60);
  };
  
  // Send OTP handler
  const handleSendOtp = async () => {

    if (!contactValue) {
      toast({
        title: 'Error',
        description: verificationType === 'email' ? 'Please enter your email address' : 'Please enter your phone number',
        variant: 'destructive'
      });
      return;
    }

    if (verificationType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue)) {
      toast({title: 'Error', description: 'Please enter a valid email address', variant: 'destructive'});
      return;
    }

    if (verificationType === 'phone' && !/^\+?[0-9\s\-\(\)]{8,20}$/.test(contactValue)) {
      toast({title: 'Error', description: 'Please enter a valid phone number', variant: 'destructive'});
      return;
    }
    setIsLoading(true);
    // Check if contact is blacklisted
    const isBlackListed = await inBlackList(verificationType, contactValue);

    if(isBlackListed){
      toast({
        title: 'Error',
        description: 'This contact is blacklisted. Please use a different one.',
        variant: 'destructive'
      });
      console.log("You are blacklisted")
      setIsLoading(false);
      return;
    }

    // Sent Otp
    const isSent = await sendOTP(verificationType, contactValue);
    if(isSent){
      setIsOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: `We've sent a verification code to your ${verificationType}`
      });
    }else{
      setIsOtpSent(false);
      toast({
        title: 'OTP Not Sent',
        description: `An error has occurred`
      });

    }
    setIsLoading(false);

  }
  
  // Resend OTP handler
  const handleResendOtp = () => {
    // Check the resend count of user
    getResendCnt(verificationType, contactValue)
      .then(result => {
        if(result > 5){
          // Check whether user in blacklist

          // Add user to blacklist
          addToBlacklist(verificationType, contactValue, 'max_resends')
            .then(result => {
              console.log("Added to blacklist due to max resends")
              router.push('/verify-otp')
            })
        }else{
          // Increment Resend count
          addResendCnt(verificationType, contactValue)
              .then(result => {
                setCountdown(1);
                handleSendOtp();
              })
        }
    })
  };
  
  // Countdown timer effect
  useEffect(() => {
    if (!isOtpSent || countdown <= 0) return;
    
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isOtpSent, countdown]);
  
  // OTP verification handler
  const handleVerifyOtp = async () => {
    if (otpValue.length < 6) {
      toast({ 
        title: 'Error', 
        description: 'Please enter the 6-digit verification code', 
        variant: 'destructive' 
      });
      return;
    }
    
    setIsLoading(true);

    // Check attempt count
    const attemptCount = await getAttemptCnt(verificationType, contactValue);
    const isBlackListed = await inBlackList(verificationType, contactValue);
    console.log(attemptCount);
    if (attemptCount > 5) {
      if(!isBlackListed){const isAdded = await addToBlacklist(verificationType, contactValue, 'max_attempts')}
      router.push('/');
    }

    // API call to verify OTP would go here
    console.log(`Verifying OTP: ${otpValue} for ${verificationType}: ${contactValue}`);

    // Match OTP
    const isMatch = await matchOTP(verificationType, contactValue, otpValue);

    if(isMatch){
      toast({
        title: 'Verification Successful',
        description: 'You have been successfully verified'
      });
      router.push('/');
    }else{
      console.log("Incorrect OTP");

      // Increment attempt count
      addAttemptCnt(verificationType, contactValue).then()
    }

    setIsLoading(false);
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
                Verification Required
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400">
              Passwordless Login
            </h1>
            <p className="text-muted-foreground text-lg">
              Verify your identity to access your account
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
                    <span>I want to find a job</span>
                    <span className="text-emerald-600 dark:text-emerald-400">I want to hire</span>
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
                {verificationType === 'email' ? 'Email Verification' : 'Phone Verification'}
              </CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                {verificationType === 'email' 
                  ? 'We\'ll send a verification code to your email address' 
                  : 'We\'ll send a verification code to your phone number'}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Contact input section */}
              <div className="space-y-4">
                {verificationType === 'phone' ? (
                  <div className="relative">
                    <div className="flex">
                      <div className="flex items-center gap-2 px-3 py-2 border border-r-0 border-emerald-200 dark:border-emerald-800 rounded-l-lg bg-emerald-50/50 dark:bg-emerald-900/20">
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">+86</span>
                        <ChevronDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <Input
                        type="tel"
                        placeholder="Phone number"
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
                    placeholder="Enter your email address"
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
                        Enter the 6-digit verification code sent to your {verificationType}
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
                        Sending verification code...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Send verification code
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
                          Verifying...
                        </div>
                      ) : (
                        'Login/Register'
                      )}
                    </Button>
                    
                    <Button 
                      onClick={handleResendOtp}
                      disabled={isLoading || countdown > 0}
                      variant="outline"
                      className="w-full rounded-lg border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 py-6 text-lg"
                    >
                      {countdown > 0 ? `Resend code (${countdown}s)` : 'Resend verification code'}
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
                  WeChat Login/Register
                </div>
              </Button>
            </CardContent>
          </Card>
          
          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
              <span>
                I have read and agree to the{' '}
                <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">Privacy Policy</a>
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Customer Service: 400-065-5799 | Working Hours: 8:00-22:00</p>
              <p>Human Resources Service License | Business License | Chaoyang District Social Bureau Supervision</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}