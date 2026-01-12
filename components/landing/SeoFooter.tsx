import Link from 'next/link';

// ===========================================
// SEO FOOTER - Internal Link Maillage
// ===========================================

const seoLinks = [
    { label: 'Missions à Paris', href: '/feed?city=paris' },
    { label: 'Missions à Lyon', href: '/feed?city=lyon' },
    { label: 'Missions à Marseille', href: '/feed?city=marseille' },
    { label: 'Recrutement Aide-Soignant', href: '/feed?job=aide-soignant' },
    { label: 'Recrutement Infirmier', href: '/feed?job=infirmier' },
    { label: 'Recrutement Éducateur', href: '/feed?job=educateur' },
    { label: 'Ateliers QVT', href: '/feed?type=qvt' },
    { label: 'Sophrologie en EHPAD', href: '/feed?type=sophrologie' },
];

export function SeoFooter() {
    return (
        <footer className="bg-slate-100 border-t border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* SEO Links Grid */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                        Recherches populaires
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {seoLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-slate-600 hover:text-brand-600 hover:underline transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 pt-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Brand */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-live-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">S</span>
                            </div>
                            <span className="font-bold text-slate-900">SocioPulse</span>
                        </div>

                        {/* Copyright */}
                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} SocioPulse. La plateforme du médico-social.
                        </p>

                        {/* Legal Links */}
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <Link href="/mentions-legales" className="hover:text-slate-700 transition-colors">
                                Mentions légales
                            </Link>
                            <Link href="/confidentialite" className="hover:text-slate-700 transition-colors">
                                Confidentialité
                            </Link>
                            <Link href="/cgu" className="hover:text-slate-700 transition-colors">
                                CGU
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
