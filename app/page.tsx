import BookingWidget from "@/components/ui/BookingWidget";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* ============================== */}
                    {/* LEFT: Content Area            */}
                    {/* ============================== */}
                    <div className="lg:col-span-7 space-y-12">

                        {/* Hero */}
                        <header className="space-y-6">
                            {/* Logo Mark */}
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex gap-0.5">
                                        <span className="w-6 h-6 bg-slate-400 flex items-center justify-center text-[10px] font-light text-white">A</span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        <span className="w-6 h-6 bg-coral-400 flex items-center justify-center text-[10px] font-light text-white">D</span>
                                        <span className="w-6 h-6 bg-slate-400 flex items-center justify-center text-[10px] font-light text-white">E</span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        <span className="w-6 h-6 bg-coral-400 flex items-center justify-center text-[10px] font-light text-white">P</span>
                                        <span className="w-6 h-6 bg-coral-400 flex items-center justify-center text-[10px] font-light text-white">A</span>
                                    </div>
                                </div>
                                <span className="text-xl font-light tracking-[0.3em] text-slate-500 uppercase">
                                    Les Extras
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 leading-[1.1]">
                                Des expériences
                                <br />
                                <span className="font-normal text-gradient">sur-mesure</span>
                            </h1>

                            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-light">
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
                                    className="group p-5 bg-white rounded-2xl border border-slate-100 
                           hover:border-coral-100 hover:shadow-soft transition-all duration-300"
                                >
                                    <span className="text-2xl text-coral-400 block mb-3">{feature.icon}</span>
                                    <h3 className="text-sm font-medium text-slate-800 mb-1">
                                        {feature.label}
                                    </h3>
                                    <p className="text-xs text-slate-400">{feature.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-2">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white"
                                    />
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">+500 événements</p>
                                <p className="text-xs text-slate-400">Clients satisfaits depuis 2018</p>
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
