'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, ChevronRight } from 'lucide-react';
import { auth } from '@/lib/auth';
import { useToasts, ToastContainer } from '@/components/ui/Toast';

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
});

type LoginSchema = z.infer<typeof loginSchema>;

const getApiBase = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const normalized = apiBase.replace(/\/+$/, '');
    return normalized.endsWith('/api/v1') ? normalized : `${normalized}/api/v1`;
};

export default function LoginPage() {
    const router = useRouter();
    const { toasts, addToast, removeToast } = useToasts();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchema) => {
        setIsLoading(true);
        try {
            const response = await auth.login(data.email, data.password);
            auth.setToken(response.accessToken);

            const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
            const isDashHost = hostname.startsWith('dash.');

            let redirectPath = isDashHost ? '/admin' : '/wall';

            try {
                const meRes = await fetch(`${getApiBase()}/auth/me`, {
                    headers: { Authorization: `Bearer ${response.accessToken}` },
                });

                if (meRes.ok) {
                    const user = await meRes.json();
                    if (String(user?.role).toUpperCase() === 'ADMIN') {
                        redirectPath = '/admin';
                    } else if (isDashHost) {
                        auth.logout();
                        return;
                    }
                }
            } catch {
                // ignore
            }

            addToast({
                message: 'Connexion réussie ! Redirection...',
                type: 'success',
            });

            setTimeout(() => {
                router.push(redirectPath);
                router.refresh();
            }, 800);
        } catch (error: any) {
            addToast({
                message: error.message || 'Erreur lors de la connexion',
                type: 'error',
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Bienvenue</h1>
                <p className="text-slate-500">Connectez-vous à votre espace Les Extras</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="vous@exemple.com"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-brand-500/15 ${
                                errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-brand-500'
                            }`}
                        />
                    </div>
                    {errors.email && <p className="text-sm text-red-500 px-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                        >
                            Oublié ?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-brand-500/15 ${
                                errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-brand-500'
                            }`}
                        />
                    </div>
                    {errors.password && <p className="text-sm text-red-500 px-1">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Se connecter
                            <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                    Pas encore de compte ?{' '}
                    <Link href="/onboarding" className="text-slate-900 font-semibold hover:underline">
                        S&apos;inscrire
                    </Link>
                </p>
            </div>

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}
