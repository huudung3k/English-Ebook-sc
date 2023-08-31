import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { i18n } from './i18n-config'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import Role from "./app/model/role";

const locales = ['en-US', 'vi-VN']

function getLocale(request) {
    const negotiatorHeaders = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

    const locales = i18n.locales

    let languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)

    const locale = matchLocale(languages, locales, i18n.defaultLocale)

    return locale
}

export async function middleware(request, _next) {
    const { pathname } = request.nextUrl;

    const protectedPaths = ["/admin"];
    const matchesProtectedPath = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    console.log(pathnameIsMissingLocale);

    if (pathnameIsMissingLocale) {
        const locale = getLocale(request)

        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
                request.url
            )
        )
    }

    if (matchesProtectedPath) {
        const token = await getToken({ req: request });
        if (!token) {
            const url = new URL(`/auth/signin`, request.url);
            url.searchParams.set("callbackUrl", encodeURI(request.url));
            return NextResponse.redirect(url);
        }
        if (token.role !== Role.ADMIN) {
            const url = new URL(`/403`, request.url);
            return NextResponse.rewrite(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    // Skip all paths that should not be internationalized. This example skips the
    // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
    matcher: ['/((?!api|_next|.*\\..*).*)']
};