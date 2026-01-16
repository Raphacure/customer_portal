// Auth utility functions for localStorage-based authentication

const AUTH_TOKEN_KEY = "raphacure_auth_token";
const USER_DATA_KEY = "raphacure_user_data";

export interface UserData {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  accessToken?: string;
  token?: string;
  roles?: Array<{
    role: string;
    name?: string;
    client?: { name: string };
  }>;
  // Allow any additional fields from API response
  [key: string]: unknown;
}

export interface AuthData {
  token: string;
  user: UserData;
}

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Get user data from localStorage
export const getUser = (): UserData | null => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

// Save auth data to localStorage
export const setAuthData = (data: AuthData): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
  // Also set a cookie for middleware to read
  document.cookie = `${AUTH_TOKEN_KEY}=${data.token}; path=/; max-age=31536000; SameSite=Lax`;
};

// Clear auth data from localStorage
export const clearAuthData = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  // Clear the cookie
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
