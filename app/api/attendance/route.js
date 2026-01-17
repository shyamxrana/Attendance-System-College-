import dbConnect from '@/lib/db';
import Attendance from '@/models/Attendance';
import { NextResponse } from 'next/server';

export async function POST(request) {
    await dbConnect();

    try {
        const { date, records } = await request.json();

        // records is an array of { studentId, status }

        if (!date || !records || !Array.isArray(records)) {
            return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
        }

        const attendanceDate = new Date(date);

        // Using bulkWrite for efficiency if many students
        // Or simple loop. Let's do a loop with Promise.all for now to keep it simple or upsert.
        // Upsert is better to handle re-submission.

        const operations = records.map(record => ({
            updateOne: {
                filter: { student: record.studentId, date: attendanceDate },
                update: { $set: { status: record.status } },
                upsert: true
            }
        }));

        if (operations.length > 0) {
            await Attendance.bulkWrite(operations);
        }

        return NextResponse.json({ success: true, message: 'Attendance marked successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function GET(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get('date');

        if (dateStr) {
            const date = new Date(dateStr);
            // Fetch for specific date
            const attendance = await Attendance.find({ date }).populate('student', 'name rollNo');
            return NextResponse.json({ success: true, data: attendance });
        }

        return NextResponse.json({ success: true, data: [] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
