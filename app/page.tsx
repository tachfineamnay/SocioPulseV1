import BookingWidget from "@/components/ui/BookingWidget";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* ============================== */}
                    {/* LEFT: Content Area            */}
                    {/* ============================== */}
                    <div className="lg:col-span-7 space-y-12">

                        {/* Hero */}
                        <header className="space-y-6">
                            {/* Logo Mark */}
                            {/* Logo Mark */}
                            <div className="flex items-center gap-3">
                                {/* Using the official uploaded logo */}
                                <img
                                    src="/images/logo.png"
                                    alt="ADEPA Les Extras"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 leading-[1.1]">
                                Des expériences
                                <br />
                                <span className="font-normal text-gradient">sur-mesure</span>
                            </h1>

                            <p className="text-lg text-gray-500 max-w-lg leading-relaxed font-light">
                                Animations, team-building et ateliers créatifs.
                                Une approche personnalisée pour des moments inoubliables.
                            </p>
                        </header>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: "◎", label: "Sur-mesure", desc: "Adapté à vos besoins" },
                                { icon: "◉", label: "Tous publics", desc: "Enfants, ados, adultes" },
                                { icon: "✦", label: "Experts", desc: "Animateurs certifiés" },
                                { icon: "◈", label: "Mobilité", desc: "Partout en France" },
                            ].map((feature) => (
                                <div
                                    key={feature.label}
                                    className="group p-5 bg-white rounded-2xl border border-gray-100 
                           hover:border-coral-100 hover:shadow-soft transition-all duration-300"
                                >
                                    <span className="text-2xl text-coral-400 block mb-3">{feature.icon}</span>
                                    <h3 className="text-sm font-medium text-gray-800 mb-1">
                                        {feature.label}
                                    </h3>
                                    <p className="text-xs text-gray-400">{feature.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-2">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white"
                                    />
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">+500 événements</p>
                                <p className="text-xs text-gray-400">Clients satisfaits depuis 2018</p>
                            </div>
                        </div>
                    </div>

                    {/* ============================== */}
                    {/* RIGHT: Booking Widget          */}
                    {/* ============================== */}
                    <div className="lg:col-span-5">
                        <BookingWidget />
                    </div>
                </div>
            </div>
        </main>
    );
}
