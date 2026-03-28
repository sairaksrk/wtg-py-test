// import type { NextRequest } from "next/server"
// import console from "node:console"
// import createMiddleware from "next-intl/middleware"
// import { NextResponse } from "next/server"
// import { routing } from "./i18n/routing"

// // List of paths that don't require authentication (without locale prefix)
// const publicPaths = ["/login", "/api/auth"]

// // Helper function to check if path is public (handles locale prefixes)
// function isPublicPath(pathname: string): boolean {
// 	// Remove locale prefix if present (only /en for as-needed strategy)
// 	const pathnameWithoutLocale = pathname.replace(/^\/en/, "")
// 	return publicPaths.some(path => pathnameWithoutLocale.startsWith(path))
// }

// // Helper function to get locale from pathname
// function getLocaleFromPath(pathname: string): "th" | "en" {
// 	// With as-needed strategy: /en/* is English, everything else is Thai (default)
// 	return pathname.startsWith("/en") ? "en" : "th"
// }

// export async function proxy(request: NextRequest) {
// 	const { pathname } = request.nextUrl

// 	// Step 1: Handle next-intl routing first
// 	const handleI18nRouting = createMiddleware(routing)
// 	const i18nResponse = handleI18nRouting(request)

// 	// If next-intl wants to redirect (e.g., adding default locale), let it
// 	if (i18nResponse.status === 307 || i18nResponse.status === 308) {
// 		return i18nResponse
// 	}

// 	const coreBaseUrl = process.env.NEXT_PUBLIC_CORE_URL || ""
// 	const loginUrl = new URL(`${coreBaseUrl}/login`, request.url)

// 	// Pass current path as "redirect" param (encoded) to redirect back after login
// 	const currentPath = process.env.NEXT_PUBLIC_BASE_URL + request.nextUrl.pathname + request.nextUrl.search
// 	loginUrl.searchParams.set("redirect", currentPath)

// 	// Check if current path is public
// 	const isPublic = isPublicPath(pathname)
// 	const pathnameWithoutLocale = pathname.replace(/^\/en/, "")
// 	const isLogin = pathnameWithoutLocale === "/login"

// 	if (isPublic) {
// 		return i18nResponse
// 	}

// 	// 1. Check if the session cookie exists at all
// 	// Note: We check both standard and Secure versions just in case
// 	const sessionCookie = request.cookies.get("better-auth.session_token")
// 		|| request.cookies.get("__Secure-better-auth.session_token")

// 	if (!sessionCookie) {
// 		return NextResponse.redirect(new URL(loginUrl, request.url))
// 	}

// 	// 2. Validate with Backend (The Important Part)
// 	// We forward the cookie header to NestJS so it can decrypt/validate it
// 	try {
// 		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, {
// 			headers: {
// 				// Pass all cookies from the incoming request to the backend
// 				"x-api-key": String(process.env.NEXT_PUBLIC_X_API_KEY) || "",
// 				"cookie": request.headers.get("cookie") || "",
// 			},
// 		})

// 		const session = await res.json()

// 		// 3. Handle Invalid Session
// 		if (!session) {
// 			return NextResponse.redirect(new URL(loginUrl, request.url))
// 		}

// 		if (isLogin) {
// 			// Preserve locale when redirecting
// 			const locale = getLocaleFromPath(pathname)
// 			const homeUrl = new URL(locale === "en" ? "/en" : "/", request.url)
// 			return NextResponse.redirect(homeUrl)
// 		}

// 		// 5. Pass user info to headers for easier access in pages
// 		// Use the i18nResponse to maintain proper locale handling
// 		i18nResponse.headers.set("x-user-id", session.user.id)
// 		return i18nResponse
// 	}
// 	catch (error) {
// 		// If backend is down or fetch fails, block access for safety
// 		console.error("Auth Middleware Error:", error)
// 		return NextResponse.redirect(new URL(loginUrl, request.url))
// 	}
// }

// // Configure which routes to run middleware on
// export const config = {
// 	matcher: [
// 		// Match all pathnames except for
// 		// - … if they start with `/api`, `/_next` or `/_vercel`
// 		// - … the ones containing a dot (e.g. `favicon.ico`)
// 		"/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
// 	],
// }
import type { NextRequest } from "next/server"
import console from "node:console"
import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import { routing } from "./i18n/routing"

// List of paths that don't require authentication (without locale prefix)
const publicPaths = ["/login", "/api/auth"]

// Helper function to check if path is public (handles locale prefixes)
function isPublicPath(pathname: string): boolean {
	const pathnameWithoutLocale = pathname.replace(/^\/en/, "")
	return publicPaths.some(path => pathnameWithoutLocale.startsWith(path))
}

// Helper function to get locale from pathname
function getLocaleFromPath(pathname: string): "th" | "en" {
	return pathname.startsWith("/en") ? "en" : "th"
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Step 1: Handle next-intl routing first
	const handleI18nRouting = createMiddleware(routing)
	const i18nResponse = handleI18nRouting(request)

	if (i18nResponse.status === 307 || i18nResponse.status === 308) {
		return i18nResponse
	}

	// --- DEVELOPMENT BYPASS ---
	// ถ้าต้องการเทสหน้าจอโดยไม่มี Backend ให้ตั้งค่า SKIP_AUTH=true ใน .env
	if (process.env.NEXT_PUBLIC_SKIP_AUTH === "true") {
		return i18nResponse
	}
	// --------------------------

	const coreBaseUrl = process.env.NEXT_PUBLIC_CORE_URL || ""
	const loginUrl = new URL(`${coreBaseUrl}/login`, request.url)
	const currentPath = process.env.NEXT_PUBLIC_BASE_URL + request.nextUrl.pathname + request.nextUrl.search
	loginUrl.searchParams.set("redirect", currentPath)

	const isPublic = isPublicPath(pathname)
	const pathnameWithoutLocale = pathname.replace(/^\/en/, "")
	const isLogin = pathnameWithoutLocale === "/login"

	if (isPublic) {
		return i18nResponse
	}

	const sessionCookie = request.cookies.get("better-auth.session_token")
		|| request.cookies.get("__Secure-better-auth.session_token")

	if (!sessionCookie) {
		return NextResponse.redirect(new URL(loginUrl, request.url))
	}

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, {
			headers: {
				"x-api-key": String(process.env.NEXT_PUBLIC_X_API_KEY) || "",
				"cookie": request.headers.get("cookie") || "",
			},
		})

		const session = await res.json()

		if (!session) {
			return NextResponse.redirect(new URL(loginUrl, request.url))
		}

		if (isLogin) {
			const locale = getLocaleFromPath(pathname)
			const homeUrl = new URL(locale === "en" ? "/en" : "/", request.url)
			return NextResponse.redirect(homeUrl)
		}

		i18nResponse.headers.set("x-user-id", session.user.id)
		return i18nResponse
	}
	catch (error) {
		console.error("Auth Middleware Error:", error)
		// ในกรณีที่ Backend ยังไม่รัน แต่เราอยากเทสหน้าจอ ให้ปล่อยผ่านไปก่อน (เฉพาะ Dev)
		if (process.env.NODE_ENV === "development") {
			return i18nResponse
		}
		return NextResponse.redirect(new URL(loginUrl, request.url))
	}
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
	],
}