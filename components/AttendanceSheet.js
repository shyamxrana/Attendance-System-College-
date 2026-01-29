"use client";

import { useState } from 'react';

export default function AttendanceSheet({ students }) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Initialize all students as 'Present' by default
    const [attendance, setAttendance] = useState(
        students.reduce((acc, student) => {
            acc[student._id] = 'Present';
            return acc;
        }, {})
    );

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const markAll = (status) => {
        const newAttendance = {};
        students.forEach(s => {
            newAttendance[s._id] = status;
        });
        setAttendance(newAttendance);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage('');

        const records = Object.entries(attendance).map(([studentId, status]) => ({
            studentId,
            status
        }));

        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, records })
            });

            const data = await res.json();

            if (data.success) {
                setMessage('Attendance marked successfully!');
            } else {
                setMessage('Error: ' + data.error);
            }
        } catch (err) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <label style={{ marginRight: '1rem', fontWeight: '500' }}>Date:</label>
                        <input
                            type="date"
                            className="input"
                            style={{ width: 'auto', display: 'inline-block' }}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="button" onClick={() => markAll('Present')} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Mark All Present</button>
                        <button type="button" onClick={() => markAll('Absent')} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Mark All Absent</button>
                    </div>
                </div>

                {message && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                        backgroundColor: message.includes('Error') ? 'hsla(0, 70%, 50%, 0.1)' : 'hsla(140, 70%, 50%, 0.1)',
                        color: message.includes('Error') ? 'hsl(0, 70%, 40%)' : 'hsl(140, 80%, 30%)'
                    }}>
                        {message}
                    </div>
                )}

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Roll No</th>
                                <th>Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td>{student.rollNo}</td>
                                    <td style={{ fontWeight: '500' }}>{student.name}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                                                <input
                                                    type="radio"
                                                    name={`status-${student._id}`}
                                                    checked={attendance[student._id] === 'Present'}
                                                    onChange={() => handleStatusChange(student._id, 'Present')}
                                                />
                                                <span style={{ color: attendance[student._id] === 'Present' ? 'green' : 'inherit' }}>Present</span>
                                            </label>

                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                                                <input
                                                    type="radio"
                                                    name={`status-${student._id}`}
                                                    checked={attendance[student._id] === 'Absent'}
                                                    onChange={() => handleStatusChange(student._id, 'Absent')}
                                                />
                                                <span style={{ color: attendance[student._id] === 'Absent' ? 'red' : 'inherit' }}>Absent</span>
                                            </label>

                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                                                <input
                                                    type="radio"
                                                    name={`status-${student._id}`}
                                                    checked={attendance[student._id] === 'Late'}
                                                    onChange={() => handleStatusChange(student._id, 'Late')}
                                                />
                                                <span style={{ color: attendance[student._id] === 'Late' ? 'orange' : 'inherit' }}>Late</span>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                    <button onClick={handleSubmit} className="btn btn-primary" disabled={loading} style={{ minWidth: '150px' }}>
                        {loading ? 'Saving...' : 'Save Attendance'}
                    </button>
                </div>
            </div>
        </div>
    );
}
