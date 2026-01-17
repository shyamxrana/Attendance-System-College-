import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import AttendanceSheet from '@/components/AttendanceSheet';

async function getStudents() {
    await dbConnect();
    const students = await Student.find({}).sort({ rollNo: 1 });
    return JSON.parse(JSON.stringify(students));
}

export const dynamic = 'force-dynamic';

export default async function AttendancePage() {
    const students = await getStudents();

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: '800' }}>Mark Attendance</h1>
            <AttendanceSheet students={students} />
        </div>
    );
}
