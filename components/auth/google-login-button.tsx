"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SERVER_IP, API_KEY } from "@/lib/config";
import { useAuth } from "./auth-provider";
import { Loader2 } from "lucide-react";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function GoogleLoginButton({
  onSuccess,
  onError,
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      try {
        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );
        const profile = await userInfoResponse.json();

        if (profile?.id) {
          // Call our backend API
          const body = {
            email: profile.email,
            external_Identifier: profile.id,
            external_Display_Identifier: "google",
            oAuthToken: codeResponse.access_token,
            provider_SystemName: "Google",
            firstName: profile.given_name,
            lastName: profile.family_name,
            roleCode: "GU",
            profileImage: profile.picture,
          };

          const response = await fetch(`${SERVER_IP}/api/v1/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
            },
            body: JSON.stringify(body),
          });

          const data = await response.json();

          if (data.success && data.data) {
            // Store complete user data from API response
            login(data.data.token, data.data);
            onSuccess?.();
          } else {
            onError?.(data.message || "Google login failed");
          }
        }
      } catch (error) {
        console.error("Google login error:", error);
        onError?.("Failed to login with Google");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      onError?.("Google login failed");
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-3 py-6 border-gray-300 hover:bg-gray-50 transition-colors"
      onClick={() => googleLogin()}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.0938 10.4135L13.3044 10.4131C12.8721 10.4131 12.5217 10.7634 12.5217 11.1957V14.323C12.5217 14.7551 12.8721 15.1056 13.3044 15.1056H18.8171C18.2135 16.6722 17.0868 17.9842 15.6493 18.8178L18 22.887C21.7707 20.7062 24 16.8799 24 12.5965C24 11.9866 23.955 11.5506 23.8651 11.0597C23.7968 10.6867 23.4729 10.4135 23.0938 10.4135Z"
            fill="#167EE6"
          />
          <path
            d="M12 19.8043C9.30218 19.8043 6.94699 18.3303 5.68207 16.1491L1.61304 18.4944C3.68374 22.0833 7.56283 24.5 12 24.5C14.1768 24.5 16.2307 23.9139 18 22.8926V22.887L15.6494 18.8178C14.5742 19.4414 13.3299 19.8043 12 19.8043Z"
            fill="#12B347"
          />
          <path
            d="M18 22.8926V22.887L15.6494 18.8178C14.5741 19.4413 13.33 19.8043 12 19.8043V24.5C14.1767 24.5 16.2308 23.9139 18 22.8926Z"
            fill="#0F993E"
          />
          <path
            d="M4.69566 12.5C4.69566 11.1702 5.05856 9.92609 5.68205 8.85092L1.61302 6.50558C0.586031 8.26934 0 10.3177 0 12.5C0 14.6823 0.586031 16.7307 1.61302 18.4944L5.68205 16.1491C5.05856 15.0739 4.69566 13.8298 4.69566 12.5Z"
            fill="#FFD500"
          />
          <path
            d="M12 5.19566C13.7593 5.19566 15.3753 5.82078 16.6375 6.86061C16.9488 7.11711 17.4014 7.09859 17.6867 6.81336L19.9024 4.59758C20.2261 4.27395 20.203 3.74422 19.8573 3.44431C17.7425 1.60967 14.991 0.5 12 0.5C7.56283 0.5 3.68374 2.91673 1.61304 6.50558L5.68207 8.85092C6.94699 6.66969 9.30218 5.19566 12 5.19566Z"
            fill="#FF4B26"
          />
          <path
            d="M16.6374 6.86061C16.9488 7.11711 17.4015 7.09859 17.6866 6.81336L19.9024 4.59758C20.226 4.27395 20.2029 3.74422 19.8573 3.44431C17.7425 1.60963 14.991 0.5 12 0.5V5.19566C13.7592 5.19566 15.3752 5.82078 16.6374 6.86061Z"
            fill="#D93F21"
          />
        </svg>
      )}
      <span className="font-medium">Continue with Google</span>
    </Button>
  );
}
