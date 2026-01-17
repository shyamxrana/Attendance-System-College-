'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from '@/components/ProfileCard';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not authenticated');
            })
            .then(data => {
                if (data.success) setUser(data.user);
                else router.push('/login');
            })
            .catch(() => router.push('/login'))
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>Loading profile...</div>;

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px' }}>
            <button onClick={() => router.back()} className="btn btn-outline" style={{ marginBottom: '2rem' }}>&larr; Back</button>

            <ProfileCard user={user} />

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: '#EF4444', color: '#EF4444' }}>
                    Logout
                </button>
            </div>
        </div>
    );
}
