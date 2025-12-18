import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-coral-50/40 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-6xl grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
                <div className="hidden lg:flex flex-col gap-6 rounded-3xl bg-slate-900 text-white p-10 shadow-2xl shadow-coral-500/10">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-orange-500 flex items-center justify-center font-semibold">
                            LX
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">Les Extras</span>
                            <span className="text-lg font-semibold">Plateforme m‚dico-sociale</span>
                        </div>
                    </Link>
                    <div className="space-y-4">
                        <p className="text-2xl font-semibold leading-tight">Connexion s‚curis‚e.</p>
                        <p className="text-base text-white/70 leading-relaxed max-w-lg">
                            Acc‚dez … la plateforme publique ou au Desk Admin en toute tranquillit‚. Authentification unifi‚e,
                            navigation claire, z‚ro distraction.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                            <p className="font-semibold">Clients & Extras</p>
                            <p className="text-white/60 mt-1">Wall, dashboard, r‚servations, visio.</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                            <p className="font-semibold">Admin Desk</p>
                            <p className="text-white/60 mt-1">Mod‚ration, profils, stats.</p>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-3xl mx-auto">
                    <div className="bg-white/85 backdrop-blur-xl border border-white/60 rounded-2xl shadow-soft p-6 sm:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
