import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Attendance from '@/models/Attendance';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();

    try {
        const totalStudents = await Student.countDocuments();

        // Get today's attendance stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysAttendance = await Attendance.find({ date: today });

        const presentCount = todaysAttendance.filter(a => a.status === 'Present').length;
        const absentCount = todaysAttendance.filter(a => a.status === 'Absent').length;

        // Simple logic: if no attendance marked, counts are 0. 
        // If partial attendance, it shows what's there.
        // Can be improved to show "Not Marked" count (Total - (Present + Absent))

        return NextResponse.json({
            success: true,
            data: {
                totalStudents,
                presentToday: presentCount,
                absentToday: absentCount,
                totalMarkedToday: todaysAttendance.length
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
