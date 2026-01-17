import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that require Authentication
const protectedPaths = ['/students', '/attendance', '/reports'];
// Paths restricted to Teachers only
const teacherOnlyPaths = ['/students', '/attendance', '/reports'];

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // 1. Check if path requires auth
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (!isProtected) {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    // 2. Redirect to Login if no token
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // 3. User is authenticated, check Role Access
        const isTeacherRoute = teacherOnlyPaths.some(path => pathname.startsWith(path));

        if (isTeacherRoute && payload.role !== 'teacher') {
            // Redirect students away from Teacher pages
            return NextResponse.redirect(new URL('/', request.url));
        }

        // 4. Attach user info to headers (optional, for Server Components)
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-role', payload.role);
        requestHeaders.set('x-user-id', payload.userId);
        if (payload.studentProfileId) requestHeaders.set('x-student-id', payload.studentProfileId);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (err) {
        // Token invalid/expired
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/students/:path*', '/attendance/:path*', '/reports/:path*'],
};
