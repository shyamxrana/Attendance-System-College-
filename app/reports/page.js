import dbConnect from '@/lib/db';
import Attendance from '@/models/Attendance';
import Link from 'next/link';

async function getAttendanceHistory() {
    await dbConnect();
    // Fetch latest 100 records, populated with student details
    const history = await Attendance.find({})
        .sort({ date: -1, createdAt: -1 })
        .limit(100)
        .populate('student', 'name rollNo')
        .lean(); // Convert to plain object

    return JSON.parse(JSON.stringify(history));
}

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
    const history = await getAttendanceHistory();

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Attendance Reports</h1>
            </div>

            <div className="card">
                <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recent Activity</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Roll No</th>
                                <th>Student Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: 'hsl(var(--text-muted))' }}>No records found.</td>
                                </tr>
                            ) : (
                                history.map((record) => (
                                    <tr key={record._id}>
                                        <td>{new Date(record.date).toLocaleDateString()}</td>
                                        <td>{record.student?.rollNo || 'N/A'}</td>
                                        <td style={{ fontWeight: '500' }}>{record.student?.name || 'Unknown Student'}</td>
                                        <td>
                                            <span className={`badge ${record.status === 'Present' ? 'badge-green' : record.status === 'Absent' ? 'badge-red' : ''}`} style={{
                                                backgroundColor: record.status === 'Late' ? 'hsla(30, 80%, 60%, 0.1)' : undefined,
                                                color: record.status === 'Late' ? 'hsl(30, 90%, 40%)' : undefined
                                            }}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
