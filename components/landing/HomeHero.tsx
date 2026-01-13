'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Stethoscope, UserCheck } from 'lucide-react';
import { currentBrand, isMedical, getHeroGradient } from '@/lib/brand';

// ===========================================
// HOME HERO - Brand-Aware Premium Landing
// Adapts to SOCIAL (SocioPulse) or MEDICAL (MedicoPulse)
// ===========================================

// Dynamic gradient classes based on brand
const gradientClasses = {
    teal: 'from-live-500 via-live-400 to-brand-500',
    indigo: 'from-brand-600 via-brand-500 to-live-500',
    rose: 'from-alert-600 via-alert-500 to-rose-400',
};

// Dynamic CTA button classes
const ctaClasses = {
    teal: 'from-live-600 to-live-700 hover:from-live-700 hover:to-live-800',
    indigo: 'from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800',
    rose: 'from-alert-600 to-alert-700 hover:from-alert-700 hover:to-alert-800',
};

export function HomeHero() {
    const primaryGradient = gradientClasses[currentBrand.primaryColor];
    const ctaGradient = ctaClasses[currentBrand.primaryColor];

    // Icons change based on brand
    const PrimaryIcon = isMedical() ? Stethoscope : Building2;
    const SecondaryIcon = isMedical() ? UserCheck : GraduationCap;

    // CTA labels change based on brand
    const primaryCta = isMedical()
        ? '🏥 Je suis un Établissement de Santé'
        : '🏢 Je suis un Établissement';
    const secondaryCta = isMedical()
        ? '👩‍⚕️ Je suis un Soignant'
        : '🎓 Je suis un Talent';

    return (
        <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Ambient Background - Mesh Gradient */}
            <div aria-hidden className="hero-mesh-gradient" />

            {/* Floating Orbs - Color adapts to brand */}
            <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="floating-orb floating-orb-1"
                    style={{
                        top: '-15%',
                        left: '10%',
                        background: isMedical()
                            ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.08), rgba(225, 29, 72, 0.05))'
                            : undefined
                    }}
                />
                <div
                    className="floating-orb floating-orb-2"
                    style={{
                        top: '50%',
                        right: '-10%',
                        background: isMedical()
                            ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.06), rgba(99, 102, 241, 0.04))'
                            : undefined
                    }}
                />
                <div className="floating-orb floating-orb-3" style={{ bottom: '-10%', left: '30%' }} />
            </div>

            <div className="relative max-w-5xl mx-auto text-center z-10">
                {/* Title - DYNAMIC from Brand Config */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-8"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-tight">
                        <span className="text-reveal block" style={{ animationDelay: '0.1s' }}>
                            {currentBrand.heroTitle}
                        </span>
                    </h1>
                </motion.div>

                {/* Subtitle - DYNAMIC from Brand Config */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-600/90 max-w-3xl mx-auto leading-relaxed"
                >
                    {currentBrand.heroSubtitle}
                </motion.h2>

                {/* Dual CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                >
                    {/* Primary CTA - Établissement */}
                    <Link
                        href="/feed?mode=client"
                        className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r ${ctaGradient} text-white font-semibold text-lg shadow-soft-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300`}
                    >
                        <PrimaryIcon className="h-5 w-5" />
                        <span>{primaryCta}</span>
                        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {/* Secondary CTA - Talent */}
                    <Link
                        href="/feed?mode=talent"
                        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-slate-300 bg-white/80 backdrop-blur-sm text-slate-800 font-semibold text-lg hover:border-slate-400 hover:bg-white hover:shadow-soft-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                        <SecondaryIcon className="h-5 w-5" />
                        <span>{secondaryCta}</span>
                    </Link>
                </motion.div>

                {/* Brand Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-8"
                >
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${isMedical()
                            ? 'bg-alert-100 text-alert-700'
                            : 'bg-live-100 text-live-700'
                        }`}>
                        {currentBrand.appName}
                    </span>
                </motion.div>
            </div>

            {/* Wave Pattern */}
            <div className="wave-pattern" />
        </section>
    );
}
