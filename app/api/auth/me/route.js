import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(request) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // Fetch fresh data from DB to get email/latest name
        await dbConnect();
        const user = await User.findById(payload.userId).select('-password');

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentProfileId: user.studentProfile
            }
        });
    } catch (err) {
        return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
}
