import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

type TokenCheckResult = {
    valid: boolean;
    role?: string;
};

const ADMIN_PREFIX = '/admin';
const DASH_SUBDOMAIN_PREFIX = 'dash.';
const AUTH_PATH_PREFIXES = ['/auth', '/onboarding'];
const PLATFORM_PROTECTED_PATHS = [
    '/dashboard',
    '/wall',
    '/bookings',
    '/messages',
    '/finance',
    '/profile',
    '/settings',
    '/notifications',
];

function isAuthPath(pathname: string) {
    return AUTH_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

async function verifyToken(token?: string): Promise<TokenCheckResult> {
    if (!token) return { valid: false };

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_dev_secret');
        const { payload } = await jwtVerify(token, secret);
        return {
            valid: true,
            role: typeof payload.role === 'string' ? payload.role : undefined,
        };
    } catch {
        return { valid: false };
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hostname = request.nextUrl.hostname;
    const token = request.cookies.get('accessToken')?.value;

    const tokenCheck = await verifyToken(token);
    const role = tokenCheck.role?.toUpperCase();
    const isAdmin = role === 'ADMIN';
    const isClientOrExtra = role === 'CLIENT' || role === 'EXTRA';

    const loginUrl = new URL('/auth/login', request.url);

    // === Mode Production: dash.lesextras.com ===
    if (hostname.startsWith(DASH_SUBDOMAIN_PREFIX)) {
        if (isAuthPath(pathname)) {
            if (tokenCheck.valid && isAdmin) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return NextResponse.next();
        }

        if (!tokenCheck.valid || !isAdmin) {
            const response = NextResponse.redirect(loginUrl);
            if (token) response.cookies.delete('accessToken');
            return response;
        }

        const adminPath = pathname.startsWith(ADMIN_PREFIX)
            ? pathname
            : `${ADMIN_PREFIX}${pathname === '/' ? '' : pathname}`;

        if (adminPath !== pathname) {
            const url = request.nextUrl.clone();
            url.pathname = adminPath;
            return NextResponse.rewrite(url);
        }

        return NextResponse.next();
    }

    // === Mode Temporaire: URL unique / coolify ===
    if (isAuthPath(pathname)) {
        if (tokenCheck.valid) {
            const target = isAdmin ? '/admin' : '/wall';
            return NextResponse.redirect(new URL(target, request.url));
        }
        return NextResponse.next();
    }

    if (pathname.startsWith(ADMIN_PREFIX)) {
        if (!tokenCheck.valid || !isAdmin) {
            const response = NextResponse.redirect(loginUrl);
            if (token) response.cookies.delete('accessToken');
            return response;
        }
        return NextResponse.next();
    }

    if (PLATFORM_PROTECTED_PATHS.some((route) => pathname.startsWith(route))) {
        if (!tokenCheck.valid || (!isClientOrExtra && !isAdmin)) {
            const response = NextResponse.redirect(loginUrl);
            if (token) response.cookies.delete('accessToken');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
