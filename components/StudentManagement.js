'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentManagement({ initialStudents }) {
    const router = useRouter();
    const [students, setStudents] = useState(initialStudents);
    const [formData, setFormData] = useState({
        name: '',
        rollNo: '',
        course: '',
        year: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            setStudents([...students, data.data]);
            setFormData({ name: '', rollNo: '', course: '', year: '' });
            router.refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            const res = await fetch(`/api/students?id=${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            setStudents(students.filter(s => s._id !== id));
            router.refresh();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Add New Student</h2>
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Roll No</label>
                        <input
                            type="text"
                            name="rollNo"
                            className="input"
                            value={formData.rollNo}
                            onChange={handleChange}
                            placeholder="CS101"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Course</label>
                        <input
                            type="text"
                            name="course"
                            className="input"
                            value={formData.course}
                            onChange={handleChange}
                            placeholder="B.Tech CS"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Year</label>
                        <input
                            type="number"
                            name="year"
                            className="input"
                            value={formData.year}
                            onChange={handleChange}
                            placeholder="1"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Student'}
                    </button>
                </form>
            </div>

            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}>Student List</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Roll No</th>
                                <th>Name</th>
                                <th>Course</th>
                                <th>Year</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'hsl(var(--text-muted))' }}>No students found.</td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student._id}>
                                        <td>{student.rollNo}</td>
                                        <td style={{ fontWeight: '500' }}>{student.name}</td>
                                        <td>{student.course}</td>
                                        <td>{student.year}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(student._id)}
                                                className="btn"
                                                style={{ color: '#EF4444', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                            >
                                                Delete
                                            </button>
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
