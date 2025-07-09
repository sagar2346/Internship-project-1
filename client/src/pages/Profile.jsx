import React, { useState, useEffect } from 'react';
import notesApi from '../api/notesApi';

function Profile() {
  const [stats, setStats] = useState({
    activeCount: 0,
    trashCount: 0,
    totalCount: 0,
    categoryCounts: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const activeNotes = await notesApi.getNotes();
      const trashedNotes = await notesApi.getTrash();
      
      const activeCount = activeNotes.length;
      const trashCount = trashedNotes.length;
      const totalCount = activeCount + trashCount;

      // Group categories
      const categoryCounts = {};
      activeNotes.forEach(note => {
        const cat = note.category || 'General';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      setStats({
        activeCount,
        trashCount,
        totalCount,
        categoryCounts
      });
    } catch (err) {
      console.error('Could not compute stats', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <div className="page-title-section">
          <h1 className="page-title">Developer & App Profile</h1>
          <p className="page-subtitle">Statistics and architecture specifications of CleanNotes.</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Left Side: Developer Info Card */}
        <div className="glass-card profile-card">
          <div className="profile-avatar">CN</div>
          <h2 className="profile-name">CleanNotes Workspace</h2>
          <p className="profile-role">Full-Stack Space</p>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0.5rem 0 1.5rem 0' }}>
            A lightweight, elegant MERN stack application configured completely in-memory using Node.js, Express, React, and custom styling tokens.
          </p>

          <div className="profile-stats-mini">
            <div className="stat-box-mini">
              <div className="stat-value-mini" style={{ color: 'var(--primary)' }}>{stats.activeCount}</div>
              <div className="stat-label-mini">Active</div>
            </div>
            <div className="stat-box-mini" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="stat-value-mini" style={{ color: 'var(--warning)' }}>{stats.trashCount}</div>
              <div className="stat-label-mini">Trashed</div>
            </div>
            <div className="stat-box-mini">
              <div className="stat-value-mini" style={{ color: 'var(--accent)' }}>{stats.totalCount}</div>
              <div className="stat-label-mini">Total</div>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Dashboard Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="dashboard-stats">
            <div className="glass-card stat-card">
              <div className="stat-icon stat-icon-indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-title">Active Notes</span>
                <span className="stat-number">{loading ? '...' : stats.activeCount}</span>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon stat-icon-rose">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-title">Trashed Items</span>
                <span className="stat-number">{loading ? '...' : stats.trashCount}</span>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon stat-icon-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-title">Total Created</span>
                <span className="stat-number">{loading ? '...' : stats.totalCount}</span>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon stat-icon-success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="12" x2="2" y2="12"></line>
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-title">Categories</span>
                <span className="stat-number">{loading ? '...' : Object.keys(stats.categoryCounts).length}</span>
              </div>
            </div>
          </div>

          {/* Category Distribution list */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Active Note Categories</h3>
            {loading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Calculating metrics...</p>
            ) : Object.keys(stats.categoryCounts).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No categories created. Add a note to start organizing!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(stats.categoryCounts).map(([cat, count]) => {
                  const percent = stats.activeCount > 0 ? (count / stats.activeCount) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                        <span>{cat}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{count} note(s) ({Math.round(percent)}%)</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percent}%`, background: 'linear-gradient(to right, var(--primary), var(--accent))', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Technical Architecture tags */}
        <div className="glass-card profile-tech-section">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Stack Architecture</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            This project follows strict single-tier separation specs, using standard client and server environments.
          </p>
          <div className="tech-grid">
            <div className="tech-tag">React 19 + Vite</div>
            <div className="tech-tag">React Router v6</div>
            <div className="tech-tag">Axios API Client</div>
            <div className="tech-tag">Express + Node.js</div>
            <div className="tech-tag">Glassmorphic CSS</div>
            <div className="tech-tag">In-Memory Arrays</div>
            <div className="tech-tag">Zero Database</div>
            <div className="tech-tag">Dotenv Config</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
