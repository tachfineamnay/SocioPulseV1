'use client';

import { motion } from 'framer-motion';
import { Building2, GraduationCap, Stethoscope, UserCheck } from 'lucide-react';
import { isMedical } from '@/lib/brand';

// ===========================================
// BRAND SWITCHER - Établissement / Talent Toggle
// Uses existing .pill-toggle design from globals.css
// ===========================================

export type ViewMode = 'establishment' | 'talent';

interface BrandSwitcherProps {
    value: ViewMode;
    onChange: (mode: ViewMode) => void;
}

export function BrandSwitcher({ value, onChange }: BrandSwitcherProps) {
    const isEstablishment = value === 'establishment';

    // Icons adapt to brand
    const EstablishmentIcon = isMedical() ? Stethoscope : Building2;
    const TalentIcon = isMedical() ? UserCheck : GraduationCap;

    // Labels adapt to brand
    const establishmentLabel = isMedical() ? 'Établissement de Santé' : 'Établissement';
    const talentLabel = isMedical() ? 'Soignant' : 'Talent';

    return (
        <div className="flex justify-center py-6">
            <div className="pill-toggle">
                {/* Animated Indicator */}
                <motion.div
                    className="pill-toggle-indicator bg-primary-600"
                    initial={false}
                    animate={{
                        x: isEstablishment ? 0 : '100%',
                        width: isEstablishment ? 'calc(50% - 4px)' : 'calc(50% - 4px)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{ left: 4 }}
                />

                {/* Establishment Button */}
                <button
                    onClick={() => onChange('establishment')}
                    className={`pill-toggle-item ${isEstablishment
                            ? 'text-white'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                >
                    <EstablishmentIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{establishmentLabel}</span>
                    <span className="sm:hidden">🏢</span>
                </button>

                {/* Talent Button */}
                <button
                    onClick={() => onChange('talent')}
                    className={`pill-toggle-item ${!isEstablishment
                            ? 'text-white'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                >
                    <TalentIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{talentLabel}</span>
                    <span className="sm:hidden">🎓</span>
                </button>
            </div>
        </div>
    );
}
