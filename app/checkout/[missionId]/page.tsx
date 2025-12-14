'use client';

import { ChevronLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { ReceiptCard, PaymentForm } from '@/components/checkout';

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/bookings" className="p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <h1 className="text-lg font-bold text-slate-900">Paiement sécurisé</h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-full">
                        <ShieldCheck className="w-4 h-4" />
                        SSL Sécurisé
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Summary (Desktop: spans 5 cols) */}
                    <div className="lg:col-span-5 order-first lg:order-last">
                        <ReceiptCard />
                    </div>

                    {/* Right: Payment Form (Desktop: spans 7 cols) */}
                    <div className="lg:col-span-7">
                        <div className="card-surface p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Mode de paiement</h2>
                            <PaymentForm />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
