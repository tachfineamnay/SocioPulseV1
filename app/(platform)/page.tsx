import { Metadata } from 'next';
import { HomeHero, QuickGuide, UniverseRail, StructureGrid, SeoFooter } from '@/components/landing';
import { getSoinItems, getEducItems, getSocioliveItems } from '@/lib/seedData';

// ===========================================
// SOCIOPULSE LANDING PAGE - Netflix Architecture
// Premium Marketing Vitrine
// Design: Awwwards Level for Investor Demo
// ===========================================

export const metadata: Metadata = {
    title: 'Sociopulse - La plateforme du médico-social | Renfort & SocioLive',
    description: 'La plateforme de mise en relation médico-sociale. Un renfort demain, une visio ou un atelier maintenant. Trouvez votre mission ou expert en temps réel.',
    keywords: 'renfort médico-social, interim social, SocioLive, atelier, EHPAD, IDE, aide-soignant, éducateur, infirmier, missions medico-social',
    openGraph: {
        title: 'Sociopulse - La plateforme du médico-social',
        description: 'La plateforme de mise en relation médico-sociale B2B2C. Missions de renfort et services SocioLive.',
        type: 'website',
        siteName: 'Sociopulse',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sociopulse - La plateforme du médico-social',
        description: 'Un renfort demain. Une Visio ou un Atelier maintenant.',
    },
};

export default function LandingPage() {
    // Get filtered items from seed data
    const soinItems = getSoinItems();
    const educItems = getEducItems();
    const socioliveItems = getSocioliveItems();

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
                        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-brand-600 mb-3">
                            Les Univers
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            Explorez nos domaines d'expertise
                        </h2>
                    </div>

                    {/* RAIL A: Pôle Soin & Urgence */}
                    <UniverseRail
                        title="🚑 PÔLE SOIN & URGENCE"
                        punchline="La continuité de service quand le planning craque."
                        accentColor="rose"
                        items={soinItems}
                        viewAllHref="/feed?category=soin"
                    />

                    {/* RAIL B: Pôle Éducatif & Social */}
                    <UniverseRail
                        title="🧩 PÔLE ÉDUCATIF & SOCIAL"
                        punchline="L'expertise terrain pour vos publics fragiles."
                        accentColor="indigo"
                        items={educItems}
                        viewAllHref="/feed?category=educ"
                    />

                    {/* RAIL C: SocioLive & Ateliers */}
                    <UniverseRail
                        title="🎓 SOCIOLIVE & ATELIERS"
                        punchline="Formations et bien-être pour réenchanter le quotidien."
                        accentColor="teal"
                        items={socioliveItems}
                        viewAllHref="/feed?category=sociolive"
                    />
                </div>
            </section>

            {/* ========== SECTION 4: BENTO GRID ========== */}
            <StructureGrid />

            {/* ========== SECTION 5: SEO FOOTER ========== */}
            <SeoFooter />
        </div>
    );
}
