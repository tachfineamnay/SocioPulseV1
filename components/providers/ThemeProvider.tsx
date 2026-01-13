'use client';

import { useEffect } from 'react';
import { currentBrand, isMedical } from '@/lib/brand';

// =============================================================================
// THEME PROVIDER - Polymorphic Design System
// Applies data-theme attribute to <html> for CSS variable switching
// =============================================================================

interface ThemeProviderProps {
    children: React.ReactNode;
}

/**
 * ThemeProvider applies the brand-specific theme to the document
 * - SOCIAL: Rounded, friendly, teal/indigo
 * - MEDICAL: Squared, clinical, rose/blue
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
    useEffect(() => {
        // Get the current theme based on brand
        const theme = isMedical() ? 'medical' : 'social';

        // Apply to document root
        document.documentElement.setAttribute('data-theme', theme);

        // Also add a class for easier CSS targeting
        document.documentElement.classList.remove('theme-medical', 'theme-social');
        document.documentElement.classList.add(`theme-${theme}`);

        // Log for debugging
        console.log(`🎨 Theme applied: ${theme} (${currentBrand.appName})`);

        // Cleanup on unmount (useful for testing)
        return () => {
            document.documentElement.removeAttribute('data-theme');
        };
    }, []);

    return <>{children}</>;
}

/**
 * Get current theme value (for SSR-safe usage)
 */
export function getTheme(): 'medical' | 'social' {
    return isMedical() ? 'medical' : 'social';
}

/**
 * Theme-aware class helper
 * Returns different classes based on current theme
 */
export function themeClass(
    socialClass: string,
    medicalClass: string
): string {
    return isMedical() ? medicalClass : socialClass;
}
