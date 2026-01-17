'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
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
        <nav className={styles.navbar}>
            <div className="container">
                <div className={styles.navInner}>
                    <Link href="/" className={styles.logo}>
                        CampusTracker
                    </Link>
                    <div className={styles.links}>
                        <Link href="/" className={styles.link}>Dashboard</Link>

                        {user?.role === 'teacher' && (
                            <>
                                <Link href="/students" className={styles.link}>Students</Link>
                                <Link href="/attendance" className={styles.link}>Attendance</Link>
                                <Link href="/reports" className={styles.link}>Reports</Link>
                            </>
                        )}

                        {user ? (
                            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem', textDecoration: 'none' }}>
                                <Avatar name={user.name} size={32} />
                            </Link>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
                                <Link href="/login" className={styles.link} style={{ fontWeight: '600', color: 'hsl(var(--primary))' }}>Login</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
