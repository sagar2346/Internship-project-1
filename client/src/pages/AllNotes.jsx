import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import notesApi from '../api/notesApi';

function AllNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesApi.getNotes();
      // Sort notes: newest first
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotes(sortedData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve notes from server. Check if backend is active.');
    } finally {
      setLoading(false);
    }
  };

  // Get list of unique categories
  const categories = ['All', ...new Set(notes.map(note => note.category))];

  // Filter notes based on category and search query
  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === 'All' || note.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Notes Workspace</h1>
          <p className="page-subtitle">Manage, search, and organize your daily items.</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Note
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-bar">
        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search notes by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {notes.length > 0 && (
          <div className="category-filters">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading notes...</p>
        </div>
      ) : error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(244,63,94,0.2)' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 600 }}>{error}</p>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={fetchNotes}>
            Retry Connection
          </button>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="13" x2="15" y2="13"></line>
              <line x1="9" y1="17" x2="13" y2="17"></line>
            </svg>
          </div>
          <h3 className="empty-title">
            {notes.length === 0 ? "Workspace is Empty" : "No Matches Found"}
          </h3>
          <p className="empty-desc">
            {notes.length === 0
              ? "Start by creating your first in-memory note. Customize it with categories and pastel tags!"
              : `We couldn't find any note matching "${searchQuery}" in category "${selectedCategory}".`}
          </p>
          {notes.length === 0 ? (
            <Link to="/create" className="btn btn-primary">
              Create Note
            </Link>
          ) : (
            <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="glass-card note-card"
              style={{ '--card-color': note.color }}
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <div className="note-card-header">
                <span className="note-category">{note.category}</span>
                <span className="note-date">{formatDate(note.createdAt)}</span>
              </div>
              <h3 className="note-title">{note.title}</h3>
              <p className="note-snippet">{note.content || "(No description content)"}</p>
              <div className="note-card-footer">
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: note.color }}></span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Open Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Basic spinning keyframe inline styling fallback */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AllNotes;
