'use client';
import Avatar from './Avatar';

export default function ProfileCard({ user }) {
    if (!user) return null;

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
            <Avatar name={user.name} size={120} style={{ marginBottom: '1.5rem', border: '4px solid hsl(var(--primary))' }} />

            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.25rem' }}>{user.name}</h2>
            <span className={`badge ${user.role === 'teacher' ? 'badge-blue' : 'badge-green'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem', marginBottom: '1.5rem' }}>
                {user.role}
            </span>

            <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'hsl(var(--background))', borderRadius: 'var(--radius)' }}>
                    <span style={{ color: 'hsl(var(--text-muted))' }}>Email</span>
                    <span style={{ fontWeight: '600' }}>{user.email || 'N/A'}</span>
                </div>

                {user.role === 'student' && user.studentProfileId && (
                    <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'hsl(var(--background))', borderRadius: 'var(--radius)' }}>
                        <span style={{ color: 'hsl(var(--text-muted))' }}>Status</span>
                        <span style={{ fontWeight: '600', color: '#10B981' }}>Active</span>
                    </div>
                )}
            </div>
        </div>
    );
}
