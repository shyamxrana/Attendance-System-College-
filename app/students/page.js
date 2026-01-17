import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import StudentManagement from '@/components/StudentManagement';

async function getStudents() {
    await dbConnect();
    const students = await Student.find({}).sort({ rollNo: 1 });
    // Mongoose documents are not simplified JSON, so we map or parse/stringify
    return JSON.parse(JSON.stringify(students));
}

export const dynamic = 'force-dynamic';

export default async function StudentsPage() {
    const students = await getStudents();

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: '800' }}>Manage Students</h1>
            <StudentManagement initialStudents={students} />
        </div>
    );
}
