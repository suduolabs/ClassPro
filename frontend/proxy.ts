import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Everything under /academia needs a session. Listing the pages one by one
// left /academia/calendar, /gradex and /links reachable without a cookie, and
// they render against a backend call with an empty token.
const isProtected = (pathname: string) => pathname.startsWith("/academia");
const home = ["/"];
const MAINTENANCE = false;

const isAuthenticated = (request: NextRequest): boolean => {
	const token = request.cookies.get("key");
	return !!token?.value;
};

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (MAINTENANCE && pathname !== "/maintenance") {
		return NextResponse.redirect(new URL("/maintenance", request.url));
	}
	if (!MAINTENANCE && pathname === "/maintenance") {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (isAuthenticated(request) && home.includes(pathname)) {
		return NextResponse.redirect(new URL("/academia", request.url));
	}
	if (!isAuthenticated(request) && home.includes(pathname)) {
		return NextResponse.redirect(new URL("/home", request.url));
	}
	if (isProtected(pathname) && !isAuthenticated(request)) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
