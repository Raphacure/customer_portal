"use client";

import { ArrowRight, LogOut, Smartphone, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { API_KEY, SERVER_IP } from "@/lib/config";

export default function DeepLinkPage() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [hasNavigatedToPath, setHasNavigatedToPath] = useState(false);

  // Call signinasuserwithjwt API when page renders with authenticated user
  useEffect(() => {
    const signInWithJWT = async () => {
      // Get accessToken from user data stored in localStorage
      const accessToken = user?.accessToken || user?.token;

      if (!accessToken) {
        console.log("No accessToken found in user data");
        return;
      }

      setIsLoadingUrl(true);

      try {
        const response = await fetch(
          `${SERVER_IP}/api/v1/auth/signinasuserwithjwt?marketplace_name=raphacure`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              "x-frontend": "raphacure",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({}),
          },
        );

        const data = await response.json();
        console.log("signinasuserwithjwt API response:", data);

        // Set the iframe URL from the response
        if (data?.data?.url) {
          setIframeUrl(data.data.url);
        }
      } catch (error) {
        console.error("signinasuserwithjwt API error:", error);
      } finally {
        setIsLoadingUrl(false);
      }
    };

    if (isAuthenticated && user) {
      signInWithJWT();
    }
  }, [isAuthenticated, user]);

  // After iframe SSO loads, wait 1.5s then navigate to the current pathname
  useEffect(() => {
    if (isIframeLoaded && iframeUrl && !hasNavigatedToPath && pathname) {
      const timer = setTimeout(() => {
        try {
          // Extract the base domain from the SSO URL
          const ssoUrl = new URL(iframeUrl);
          const baseDomain = `${ssoUrl.protocol}//${ssoUrl.host}`;

          // Construct the new URL with the current pathname
          const newUrl = `${baseDomain}${pathname}`;
          console.log("Navigating iframe to:", newUrl);

          // Update the iframe src
          setIframeUrl(newUrl);
          setHasNavigatedToPath(true);
        } catch (error) {
          console.error("Error navigating iframe:", error);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isIframeLoaded, iframeUrl, hasNavigatedToPath, pathname]);

  // Redirect unauthenticated users to signin with redirect param
  useEffect(() => {
    if (!authLoading && !isAuthenticated && pathname) {
      window.location.href = `/signin?redirect=${encodeURIComponent(pathname)}`;
    }
  }, [authLoading, isAuthenticated, pathname]);

  const handleLogout = () => {
    logout();
  };

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
  };

  // Show loading skeleton while auth is loading or URL is being fetched
  if (authLoading || (isAuthenticated && isLoadingUrl)) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-background">
        <div className="w-full h-full flex flex-col">
          {/* Header skeleton */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
          {/* Main content skeleton */}
          <div className="flex-1 p-4">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Show iframe if URL is available (for authenticated users)
  if (isAuthenticated && iframeUrl) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-background">
        {/* Show skeleton while iframe is loading */}
        {!isIframeLoaded && (
          <div className="absolute inset-0 w-full h-full flex flex-col z-10">
            <div className="p-4 border-b border-border bg-background">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 bg-background">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          title="RaphaCure App"
          allow="geolocation; microphone; camera; payment"
        />
      </div>
    );
  }

  // Default view for non-authenticated users or when no URL
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center dark:bg-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      {/* User Info Card - Show when authenticated but no iframe URL */}
      {isAuthenticated && user && !iframeUrl && (
        <Card className="relative w-full max-w-md border-slate-200 shadow-xl dark:border-slate-800 mb-6">
          <CardHeader className="space-y-4 pb-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 overflow-hidden">
              {user.profileImage ? (
                <img
                  src={user.profileImage as string}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome back!
              </CardTitle>
              <CardDescription className="text-base">
                You are signed in as
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-slate-100 p-4 text-left dark:bg-slate-900">
              <div className="space-y-2">
                {(user.first_name || user.last_name) && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Name:
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {[user.first_name, user.last_name]
                        .filter(Boolean)
                        .join(" ")}
                    </span>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Email:
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {user.email as string}
                    </span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Phone:
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      +91 {user.phone as string}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="relative w-full max-w-md border-slate-200 shadow-xl dark:border-slate-800">
        <CardHeader className="space-y-4 pb-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Smartphone className="h-10 w-10 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Opening in App
            </CardTitle>
            <CardDescription className="text-base">
              This link is designed to be viewed in the RaphaCure mobile app.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            <p>
              If the app didn't open automatically, please select your platform
              below to download or open it.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              asChild
              size="lg"
              className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <Link
                href="https://play.google.com/store/apps/details?id=com.cognonta.raphacure"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                {/* Google Play Icon SVG */}
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.498 2.498 0 0 1-1.748-2.433V4.247c0-.98.548-1.886 1.747-2.433zM15.208 13.414L19.879 18.086a2.502 2.502 0 0 0 3.535-3.536l-8.206-8.206-1.414 1.414 6.792 6.792-5.378 5.378zM12.378 10.586L5.586 3.793a.999.999 0 0 1 1.414-1.414l8.207 8.207-2.829 2.829z" />
                  <path
                    d="M4.195 2.656a1.5 1.5 0 0 0 0 2.122l8.485 8.485a1.5 1.5 0 0 0 2.122 0l-8.485-8.485a1.5 1.5 0 0 0-2.122 0z"
                    opacity="0"
                  />
                  {/* Simplified Play Store Path */}
                  <path d="M21.053 14.673l-4.09-4.175L5.786 21.65c.57.173 1.206.074 1.706-.245l13.561-6.732zM15.547 9.082L4.195 2.656a1.503 1.503 0 0 0-1.714-.146l11.652 11.652 1.414-5.08z" />
                </svg>
                <span>Google Play</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="w-full bg-[#007AFF] hover:bg-[#0066CC] text-white"
            >
              <Link
                href="https://apps.apple.com/in/app/raphacure-work-family-care/id1637246098"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                {/* Apple Icon SVG */}
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>App Store</title>
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.15 4.1-1.09 1.55.09 2.92.8 3.76 1.99-3.23 1.96-2.65 6.09.68 7.5-.54 1.55-1.37 3.03-2.62 4.28-.6.55-1.18 1.13-1.92 1.51l-.08.04zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span>App Store</span>
              </Link>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 dark:bg-slate-950">
                Or
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {!isAuthenticated && (
              <Button
                asChild
                variant="default"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Link href="/signin" className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button
              asChild
              variant="ghost"
              className="w-full text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <Link href="/" className="flex items-center gap-2">
                Go to Homepage <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
