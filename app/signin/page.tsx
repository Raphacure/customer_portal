"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  LogOut,
  Mail,
  Smartphone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { API_KEY, GOOGLE_CLIENT_ID, SERVER_IP } from "@/lib/config";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/site";
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    login,
    logout,
  } = useAuth();

  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isNewUser, setIsNewUser] = useState(false);

  // Timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (otpSent && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpSent, timeRemaining]);

  const checkPhoneOrEmail = (value: string): "phone" | "email" | "invalid" => {
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (phoneRegex.test(value.replace(/\D/g, ""))) return "phone";
    if (emailRegex.test(value)) return "email";
    return "invalid";
  };

  const handleInputChange = (value: string) => {
    setPhoneOrEmail(value);
    setError("");
    const type = checkPhoneOrEmail(value);
    setIsPhone(type === "phone");
  };

  const requestOtp = async () => {
    const inputType = checkPhoneOrEmail(phoneOrEmail);
    if (inputType === "invalid") {
      setError("Please enter a valid email or 10-digit phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const body =
        inputType === "phone"
          ? { phone: phoneOrEmail.replace(/\D/g, ""), source: null }
          : { email: phoneOrEmail.toLowerCase(), source: null };

      const response = await fetch(
        `${SERVER_IP}/api/v1/auth/otp/request?marketplace_name=raphacure`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            "x-frontend": "raphacure",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setTimeRemaining(60);
        setOtp("");
        setOtpError("");
        if (data.data?.isNewUser) {
          setIsNewUser(true);
        }
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Request OTP error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = useCallback(
    async (otpValue: string) => {
      if (otpValue.length !== 6) return;

      setIsLoading(true);
      setOtpError("");

      try {
        const inputType = checkPhoneOrEmail(phoneOrEmail);
        const body =
          inputType === "phone"
            ? { phone: phoneOrEmail.replace(/\D/g, ""), otp: otpValue }
            : { email: phoneOrEmail.toLowerCase(), otp: otpValue };

        const response = await fetch(
          `${SERVER_IP}/api/v1/auth/otp/verify?marketplace_name=raphacure`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              "x-frontend": "raphacure",
            },
            body: JSON.stringify(body),
          },
        );

        const data = await response.json();

        if (data.success && data.data) {
          // Store complete user data from API response
          login(data.data.token, data.data);

          // Redirect to profile if new user, otherwise home
          if (isNewUser || !data.data.first_name) {
            handleLoginSuccess();
          } else {
            handleLoginSuccess();
          }
        } else {
          setOtpError("Incorrect OTP. Please try again.");
        }
      } catch (err) {
        console.error("Verify OTP error:", err);
        setOtpError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [phoneOrEmail, login, router, isNewUser],
  );

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setOtpError("");
    if (value.length === 6) {
      verifyOtp(value);
    }
  };

  const handleResendOtp = () => {
    setTimeRemaining(60);
    requestOtp();
  };

  const isDisabled = phoneOrEmail.length < 6 || !termsAccepted;

  const handleLoginSuccess = () => {
    // Redirect to the original path the user was trying to access, or /site
    window.location.href = redirectPath;
  };

  const handleLoginError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleLogout = () => {
    logout();
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show user profile if already logged in
  if (isAuthenticated && user) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl" />
          </div>

          <Card className="relative w-full max-w-md border-slate-200/80 shadow-xl backdrop-blur-sm dark:border-slate-800/80">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 overflow-hidden">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Welcome back!
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    You are signed in
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* User Info */}
              <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-900">
                <div className="space-y-3">
                  {(user.first_name || user.last_name) && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Name
                        </p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {[user.first_name, user.last_name]
                            .filter(Boolean)
                            .join(" ")}
                        </p>
                      </div>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Email
                        </p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Phone
                        </p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          +91 {user.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full h-12 text-base font-medium"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                >
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2"
                  >
                    Go to Home
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
        </div>

        <Card className="relative w-full max-w-md border-slate-200/80 shadow-xl backdrop-blur-sm dark:border-slate-800/80">
          <CardHeader className="space-y-4 pb-6">
            {otpSent && (
              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setOtpError("");
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 dark:from-purple-500/30 dark:to-indigo-500/30">
                {isPhone ? (
                  <Smartphone className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                ) : (
                  <Mail className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {otpSent ? "Verify OTP" : "Login / Sign up"}
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  {otpSent
                    ? "Enter the 6-digit code we sent"
                    : "Access your health dashboard"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!otpSent ? (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneOrEmail"
                      className="text-sm font-medium"
                    >
                      Email or Mobile Number
                    </Label>
                    <Input
                      id="phoneOrEmail"
                      type="text"
                      placeholder="Enter email or 10-digit mobile number"
                      value={phoneOrEmail}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    New users can log in directly—no signup needed.
                  </p>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) =>
                        setTermsAccepted(checked === true)
                      }
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                    >
                      By signing in, I agree to the{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-primary hover:underline font-medium"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>{" "}
                      &{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:underline font-medium"
                        target="_blank"
                      >
                        Terms of Services
                      </Link>
                      .
                    </Label>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/50 dark:border-red-900">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  onClick={requestOtp}
                  disabled={isDisabled || isLoading}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>

                <GoogleLoginButton
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                />
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-semibold text-foreground">
                      {isPhone ? `+91 ${phoneOrEmail}` : phoneOrEmail}
                    </span>
                  </p>

                  <div className="flex justify-center py-4">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={handleOtpChange}
                      disabled={isLoading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="h-14 w-12 text-xl" />
                        <InputOTPSlot index={1} className="h-14 w-12 text-xl" />
                        <InputOTPSlot index={2} className="h-14 w-12 text-xl" />
                        <InputOTPSlot index={3} className="h-14 w-12 text-xl" />
                        <InputOTPSlot index={4} className="h-14 w-12 text-xl" />
                        <InputOTPSlot index={5} className="h-14 w-12 text-xl" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {otpError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/50 dark:border-red-900">
                      <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        {otpError}
                      </p>
                    </div>
                  )}

                  <div className="text-center text-sm text-muted-foreground">
                    {timeRemaining > 0 ? (
                      <>
                        Resend in{" "}
                        <span className="font-semibold text-foreground">
                          00:{timeRemaining.toString().padStart(2, "0")}
                        </span>
                      </>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        className="text-primary hover:underline font-semibold"
                        disabled={isLoading}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => verifyOtp(otp)}
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>

                <GoogleLoginButton
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                />
              </>
            )}

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}
