'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, GraduationCap } from 'lucide-react';

// ===========================================
// HOME HERO - Premium Landing Section
// Preserved H1/H2 with new CTAs
// ===========================================

export function HomeHero() {
    return (
        <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Ambient Background - Mesh Gradient */}
            <div aria-hidden className="hero-mesh-gradient" />

            {/* Floating Orbs */}
            <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="floating-orb floating-orb-1" style={{ top: '-15%', left: '10%' }} />
                <div className="floating-orb floating-orb-2" style={{ top: '50%', right: '-10%' }} />
                <div className="floating-orb floating-orb-3" style={{ bottom: '-10%', left: '30%' }} />
            </div>

            <div className="relative max-w-5xl mx-auto text-center z-10">
                {/* Title - PRESERVED */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-8"
                >
                    <h1 className="hero-title">
                        <span className="text-reveal" style={{ animationDelay: '0.1s' }}>LA PLATEFORME</span>
                        <br />
                        <span className="hero-title-gradient text-reveal" style={{ animationDelay: '0.3s' }}>
                            DU MÉDICO-SOCIAL
                        </span>
                    </h1>
                </motion.div>

                {/* Subtitle - PRESERVED */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-600/90 max-w-3xl mx-auto leading-relaxed"
                >
                    Un renfort demain.{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-live-500 to-brand-500">
                        Une Visio ou un Atelier maintenant.
                    </span>
                </motion.h2>

                {/* NEW: Dual CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                >
                    {/* Primary CTA - Établissement */}
                    <Link
                        href="/feed?mode=client"
                        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold text-lg shadow-soft-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                        <Building2 className="h-5 w-5" />
                        <span>🏥 Je suis un Établissement</span>
                        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {/* Secondary CTA - Talent */}
                    <Link
                        href="/feed?mode=talent"
                        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-slate-300 bg-white/80 backdrop-blur-sm text-slate-800 font-semibold text-lg hover:border-brand-400 hover:bg-white hover:shadow-soft-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                        <GraduationCap className="h-5 w-5" />
                        <span>🎓 Je suis un Talent</span>
                    </Link>
                </motion.div>
            </div>

            {/* Wave Pattern */}
            <div className="wave-pattern" />
        </section>
    );
}
