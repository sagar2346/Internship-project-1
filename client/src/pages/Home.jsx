import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="home-badge">Introducing CleanNotes v1.0</div>
      
      <h1 className="home-title">
        Capture your thoughts in a <span>Space of Clarity</span>.
      </h1>
      
      <p className="home-desc">
        A premium, hyper-fast, full-stack Notes experience. Categorize your ideas, customize color labels, and manage your work elegantly. Powered by modern in-memory backend operations.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/notes" className="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Go to Notes Workspace
        </Link>
        <Link to="/profile" className="btn btn-secondary">
          View App Status
        </Link>
      </div>

      <div className="home-features">
        <div className="glass-card feature-card">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="feature-title">Intuitive Categories</h3>
          <p className="feature-desc">Organize your thoughts into distinct folders like Ideas, Work, Personal, or custom groups.</p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="feature-title">Real-Time Fluidity</h3>
          <p className="feature-desc">All API updates are highly optimized. Soft deletion protects notes before permanent removal.</p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8v8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="feature-title">Aesthetic Colors</h3>
          <p className="feature-desc">Assign beautiful visual labels to notes, making search, categorization, and tracking simple.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
