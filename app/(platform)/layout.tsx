import type { ReactNode } from "react";
import Link from "next/link";
import { DesktopTopNav, MobileBottomNav } from "@/components/layout";
import { currentBrand, isMedical } from "@/lib/brand";

function PlatformFooter() {
    // Use polymorphic gradient based on brand
    const logoGradient = isMedical()
        ? 'from-rose-500 via-rose-500 to-blue-500'
        : 'from-indigo-600 via-indigo-600 to-teal-500';

    return (
        <footer className="bg-white border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${logoGradient} shadow-soft flex items-center justify-center`}>
                        <span className="text-white font-semibold tracking-tight">
                            {currentBrand.appName.substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 leading-none">
                            {currentBrand.appName}
                        </span>
                        <span className="text-xs text-slate-500 leading-tight">
                            {isMedical() ? 'Réseau médico-social' : 'Le hub du social'}
                        </span>
                    </div>
                </Link>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <Link href="/wall" className="hover:text-slate-900 transition-colors">Wall</Link>
                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Tableau de bord</Link>
                    <Link href="/bookings" className="hover:text-slate-900 transition-colors">Agenda</Link>
                    <Link href="/messages" className="hover:text-slate-900 transition-colors">Messages</Link>
                    <Link href="/profile" className="hover:text-slate-900 transition-colors">Profil</Link>
                </div>
            </div>
        </footer>
    );
}

export default function PlatformLayout({ children }: { children: ReactNode }) {
    // Note: SocketProvider is already in root layout, no need to duplicate
    return (
        <div className="min-h-screen bg-canvas flex flex-col">
            <DesktopTopNav />
            <div className="flex-1 flex flex-col has-bottom-nav lg:pb-0">
                <main className="flex-1">{children}</main>
                <PlatformFooter />
            </div>
            <MobileBottomNav />
        </div>
    );
}
