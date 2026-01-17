/* eslint-disable @next/next/no-img-element */
'use client';

export default function Avatar({ name, size = 40, style }) {
    // Use DiceBear Thumbs style for fun, friendly avatars
    // encodeURIComponent to handle spaces/special chars in names
    const seed = encodeURIComponent(name || 'Unknown');
    const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&backgroundColor=transparent`;

    return (
        <div
            className="avatar-container"
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'hsl(var(--surface-active))',
                border: '2px solid hsl(var(--border-light))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...style
            }}
        >
            <img
                src={avatarUrl}
                alt={name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>
    );
}
