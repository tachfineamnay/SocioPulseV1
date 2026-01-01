/**
 * Centralized API Configuration
 * Single source of truth for API URL across the application
 */

export const ENV = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    IS_PROD: process.env.NODE_ENV === 'production',
};

// Runtime warning for missing API URL (only in browser)
if (!ENV.API_URL && typeof window !== 'undefined') {
    console.error('❌ CRITICAL: NEXT_PUBLIC_API_URL is not defined!');
}

/**
 * Get the base API URL with trailing slash removed
 * @returns API base URL (e.g., "https://api.sociopulse.fr/api/v1")
 */
export const getApiUrl = (): string => {
    let baseUrl: string;

    if (ENV.API_URL) {
        baseUrl = ENV.API_URL;
    } else if (ENV.IS_PROD) {
        // Fallback for production if env var is missing
        baseUrl = 'https://api.sociopulse.fr/api/v1';
    } else {
        // Development fallback
        baseUrl = 'http://localhost:4000';
    }

    // Remove trailing slash to prevent double slashes in URLs
    return baseUrl.replace(/\/+$/, '');
};

/**
 * Get the API URL with /api/v1 path if not already present
 * Use this for endpoints that need the versioned path
 */
export const getApiBaseWithVersion = (): string => {
    const url = getApiUrl();
    // If URL already contains /api/v1, return as-is
    if (url.includes('/api/v1')) {
        return url;
    }
    return `${url}/api/v1`;
};
