import dbConnect from '@/lib/db';
import User from '@/models/User';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    await dbConnect();
    try {
        const { name, email, password, role, rollNo } = await request.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
        }

        let studentProfileId = null;

        if (role === 'student') {
            if (!rollNo) {
                return NextResponse.json({ success: false, error: 'Student Roll No is required' }, { status: 400 });
            }
            const student = await Student.findOne({ rollNo });
            if (!student) {
                return NextResponse.json({ success: false, error: 'Roll No not found in records' }, { status: 404 });
            }
            studentProfileId = student._id;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            studentProfile: studentProfileId
        });

        return NextResponse.json({ success: true, message: 'User registered successfully' }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
