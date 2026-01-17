import Link from 'next/link';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Attendance from '@/models/Attendance';
import { headers } from 'next/headers';
import Avatar from '@/components/Avatar';

async function getStats() {
  await dbConnect();

  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const role = headersList.get('x-user-role');
  const studentProfileId = headersList.get('x-student-id');

  // Teacher Stats (Global)
  if (!role || role === 'teacher') {
    const totalStudents = await Student.countDocuments();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysAttendance = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const presentCount = todaysAttendance.filter(a => a.status === 'Present').length;
    const absentCount = todaysAttendance.filter(a => a.status === 'Absent').length;

    return {
      role: 'teacher',
      totalStudents,
      presentToday: presentCount,
      absentToday: absentCount,
      // Mock recent activity for UI
      recentActivity: todaysAttendance.slice(0, 5).map(a => ({ ...a.toObject(), _id: a._id.toString(), date: a.date.toISOString() }))
    };
  }

  // Student Stats (Personal)
  if (role === 'student') {
    if (!studentProfileId) return { role: 'student', error: 'No linked student profile found.' };

    const myAttendance = await Attendance.find({ student: studentProfileId }).sort({ date: -1 });

    const totalClasses = myAttendance.length;
    const presentClasses = myAttendance.filter(a => a.status === 'Present').length;
    const absentClasses = myAttendance.filter(a => a.status === 'Absent').length;
    const attendancePercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;

    return {
      role: 'student',
      totalClasses,
      presentClasses,
      absentClasses,
      attendancePercentage,
      history: myAttendance.slice(0, 5).map(a => ({ ...a.toObject(), _id: a._id.toString(), date: a.date.toISOString() }))
    };
  }

  return null;
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>

      {!stats && (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h1>Welcome to CampusTracker</h1>
          <p style={{ marginBottom: '2rem' }}>Please login to manage your attendance.</p>
          <Link href="/login" className="btn btn-primary">Login</Link>
        </div>
      )}

      {/* TEACHER DASHBOARD */}
      {stats?.role === 'teacher' && (
        <>
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Dashboard</h1>
              <p style={{ color: 'hsl(var(--text-muted))' }}>Overview of today's activity.</p>
            </div>
            <Link href="/profile" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
              <span>My Profile</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="card stat-card" style={{ borderLeft: '5px solid hsl(var(--primary))' }}>
              <div style={{ fontSize: '0.875rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Students</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.5rem' }}>{stats.totalStudents}</div>
            </div>
            <div className="card stat-card" style={{ borderLeft: '5px solid #10B981' }}>
              <div style={{ fontSize: '0.875rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Present Today</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.5rem', color: '#10B981' }}>{stats.presentToday}</div>
            </div>
            <div className="card stat-card" style={{ borderLeft: '5px solid #EF4444' }}>
              <div style={{ fontSize: '0.875rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Absent Today</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.5rem', color: '#EF4444' }}>{stats.absentToday}</div>
            </div>
          </div>

          {/* Action Grid */}
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <Link href="/attendance" className="card action-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s' }}>
              <div style={{ width: '50px', height: '50px', background: 'hsl(var(--surface-active))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📅</div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Mark Attendance</h3>
                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>Take today's roll call</p>
              </div>
            </Link>

            <Link href="/students" className="card action-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s' }}>
              <div style={{ width: '50px', height: '50px', background: 'hsl(var(--surface-active))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🎓</div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Manage Students</h3>
                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>Add or edit records</p>
              </div>
            </Link>

            <Link href="/reports" className="card action-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s' }}>
              <div style={{ width: '50px', height: '50px', background: 'hsl(var(--surface-active))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📊</div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>View Reports</h3>
                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>Check history & trends</p>
              </div>
            </Link>
          </div>
        </>
      )}

      {/* STUDENT DASHBOARD */}
      {stats?.role === 'student' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {stats.error ? (
            <div className="card" style={{ textAlign: 'center', color: 'red', borderLeft: '5px solid #EF4444' }}>
              <h3>Account Not Linked</h3>
              <p>{stats.error}</p>
            </div>
          ) : (
            <>
              {/* Hero Card */}
              <div className="card" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)', color: 'white', marginBottom: '2rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Attendance Rate</div>
                  <div style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1 }}>{stats.attendancePercentage}<span style={{ fontSize: '2rem' }}>%</span></div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Present</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.presentClasses}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Absent</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.absentClasses}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Total</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.totalClasses}</div>
                    </div>
                  </div>
                </div>
                {/* Decorative Circle */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'white', opacity: 0.1 }}></div>
              </div>

              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent History</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.history.length === 0 ? (
                  <p style={{ color: 'hsl(var(--text-muted))', textAlign: 'center' }}>No attendance records found.</p>
                ) : (
                  stats.history.map(record => (
                    <div key={record._id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: record.status === 'Present' ? '#d1fae5' : '#fee2e2',
                          color: record.status === 'Present' ? '#065f46' : '#991b1b',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                        }}>
                          {record.status === 'Present' ? '✓' : '✗'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600' }}>{new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                          <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>{new Date(record.date).toLocaleTimeString()}</div>
                        </div>
                      </div>
                      <span className={`badge ${record.status === 'Present' ? 'badge-green' : 'badge-red'}`}>
                        {record.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
