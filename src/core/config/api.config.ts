/**
 * Centralized API configuration for mobile application.
 * Includes workarounds for common development issues (like ngrok CORS).
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const BASE_URL = import.meta.env.VITE_API || 'http://localhost:3000';

/**
 * Returns the default headers for all API requests.
 */
export const getBaseHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // 💡 Workaround for ngrok free-tier "browser warning" interceptor
    'ngrok-skip-browser-warning': 'true',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
