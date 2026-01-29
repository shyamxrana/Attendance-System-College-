'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Avatar from './Avatar';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for logged in user
        fetch('/api/auth/me')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not authenticated');
            })
            .then(data => {
                if (data.success) setUser(data.user);
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return null;

    return (
        <nav style={{
            backgroundColor: 'hsl(var(--bg-nav))',
            borderBottom: '1px solid hsl(var(--border-light))',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 0',
                    height: '60px'
                }}>
                    <Link href="/" style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: 'hsl(var(--primary))',
                        textDecoration: 'none',
                        marginRight: '2rem'
                    }}>
                        CampusTracker
                    </Link>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        marginLeft: 'auto'
                    }}>
                        <Link href="/" style={{
                            color: 'hsl(var(--text-main))',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                            fontWeight: '500'
                        }}>Dashboard</Link>

                        {user?.role === 'teacher' && (
                            <>
                                <Link href="/students" style={{
                                    color: 'hsl(var(--text-main))',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    fontWeight: '500'
                                }}>Students</Link>
                                <Link href="/attendance" style={{
                                    color: 'hsl(var(--text-main))',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    fontWeight: '500'
                                }}>Attendance</Link>
                                <Link href="/reports" style={{
                                    color: 'hsl(var(--text-main))',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    fontWeight: '500'
                                }}>Reports</Link>
                            </>
                        )}

                        {user ? (
                            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem', textDecoration: 'none', color: 'hsl(var(--text-main))' }}>
                                <Avatar name={user.name} size={32} />
                                <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{user.name}</span>
                            </Link>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
                                <Link href="/login" style={{ fontWeight: '600', color: 'hsl(var(--primary))', textDecoration: 'none' }}>Login</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
