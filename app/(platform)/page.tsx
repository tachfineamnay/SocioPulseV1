import { Metadata } from 'next';
import { HomeHero, QuickGuide, UniverseRail, StructureGrid, SeoFooter } from '@/components/landing';
import { SEED_DATA } from '@/lib/seedData';
import { currentBrand, isCategoryAllowed, isMedical } from '@/lib/brand';

// ===========================================
// LANDING PAGE - Brand-Aware Netflix Architecture
// Adapts to SOCIAL (SocioPulse) or MEDICAL (MedicoPulse)
// ===========================================

export const metadata: Metadata = {
    title: currentBrand.metaTitle,
    description: currentBrand.metaDescription,
    keywords: isMedical()
        ? 'renfort soignant, interim santé, infirmier, aide-soignant, EHPAD, clinique, IDE, AS, AES'
        : 'renfort médico-social, interim social, SocioLive, atelier, éducateur, travailleur social, MECS, IME',
    openGraph: {
        title: currentBrand.metaTitle,
        description: currentBrand.metaDescription,
        type: 'website',
        siteName: currentBrand.appName,
    },
    twitter: {
        card: 'summary_large_image',
        title: currentBrand.appName,
        description: currentBrand.heroSubtitle,
    },
};

export default function LandingPage() {
    // Filter seed data by allowed categories for current brand
    const soinItems = SEED_DATA.filter(item => item.category === 'SOIN');
    const educItems = SEED_DATA.filter(item =>
        item.category === 'EDUC' || item.category === 'HANDICAP' || item.category === 'SOCIAL'
    );
    const socioliveItems = SEED_DATA.filter(item => item.category === 'SOCIOLIVE');

    // Check what rails should be displayed based on brand config
    const showSoinRail = isCategoryAllowed('SOIN');
    const showEducRail = isCategoryAllowed('EDUC');
    const showSocioliveRail = currentBrand.showAteliers;

    // Section header label color
    const labelColorClass = isMedical() ? 'text-alert-600' : 'text-brand-600';

    return (
        <div className="relative min-h-screen bg-canvas overflow-hidden">
            {/* ========== SECTION 1: HERO ========== */}
            <HomeHero />

            {/* ========== SECTION 2: GUIDE RAPIDE ========== */}
            <QuickGuide />

            {/* ========== SECTION 3: LES UNIVERS (Netflix Rails) ========== */}
            <section className="py-8 sm:py-12 bg-gradient-to-b from-canvas to-slate-50">
                <div className="max-w-[1600px] mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-8 px-4 sm:px-6 lg:px-8">
                        <p className={`text-sm font-semibold tracking-[0.2em] uppercase ${labelColorClass} mb-3`}>
                            {isMedical() ? 'Nos Soignants' : 'Les Univers'}
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            {isMedical()
                                ? 'Trouvez votre renfort soignant'
                                : 'Explorez nos domaines d\'expertise'
                            }
                        </h2>
                    </div>

                    {/* RAIL A: Pôle Soin & Urgence - Only if SOIN is allowed */}
                    {showSoinRail && soinItems.length > 0 && (
                        <UniverseRail
                            title="🚑 PÔLE SOIN & URGENCE"
                            punchline="La continuité de service quand le planning craque."
                            accentColor="rose"
                            items={soinItems}
                            viewAllHref="/feed?category=soin"
                        />
                    )}

                    {/* RAIL B: Pôle Éducatif & Social - Only if EDUC is allowed */}
                    {showEducRail && educItems.length > 0 && (
                        <UniverseRail
                            title="🧩 PÔLE ÉDUCATIF & SOCIAL"
                            punchline="L'expertise terrain pour vos publics fragiles."
                            accentColor="indigo"
                            items={educItems}
                            viewAllHref="/feed?category=educ"
                        />
                    )}

                    {/* RAIL C: SocioLive & Ateliers - Only if showAteliers is true */}
                    {showSocioliveRail && socioliveItems.length > 0 && (
                        <UniverseRail
                            title="🎓 SOCIOLIVE & ATELIERS"
                            punchline="Formations et bien-être pour réenchanter le quotidien."
                            accentColor="teal"
                            items={socioliveItems}
                            viewAllHref="/feed?category=sociolive"
                        />
                    )}
                </div>
            </section>

            {/* ========== SECTION 4: BENTO GRID ========== */}
            <StructureGrid />

            {/* ========== SECTION 5: SEO FOOTER ========== */}
            <SeoFooter />
        </div>
    );
}
