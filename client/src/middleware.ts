import { NextRequest, NextResponse } from "next/server"


const protectedRoutes = ["/dashboard", "/profile", "/settings"]
const authRoutes = ["/login", "/register"]

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const refreshToken = req.cookies.get("refreshToken")?.value

    const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
    const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))

    if (isProtected && !refreshToken) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    if (isAuthRoute && refreshToken) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"]
}



