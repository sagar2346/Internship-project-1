import React, { useState, useEffect } from 'react';
import notesApi from '../api/notesApi';

function Trash() {
  const [trashedNotes, setTrashedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const data = await notesApi.getTrash();
      // Sort: newest first
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTrashedNotes(sortedData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load trashed items. Please verify server connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await notesApi.restoreNote(id);
      // Remove from frontend state
      setTrashedNotes(prev => prev.filter(note => note.id !== id));
    } catch (err) {
      console.error(err);
      alert('Could not restore note.');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('⚠️ WARNING: This operation is permanent and cannot be undone. Are you sure you want to permanently delete this note?')) return;
    try {
      await notesApi.permanentDeleteNote(id);
      // Remove from frontend state
      setTrashedNotes(prev => prev.filter(note => note.id !== id));
    } catch (err) {
      console.error(err);
      alert('Could not permanently delete note.');
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Trash Bin</h1>
          <p className="page-subtitle">Manage soft-deleted files. Restore to workspace or permanently wipe them.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading trash bin...</p>
        </div>
      ) : error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(244,63,94,0.2)' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 600 }}>{error}</p>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={fetchTrash}>
            Try Reconnecting
          </button>
        </div>
      ) : trashedNotes.length === 0 ? (
        <div className="empty-state" style={{ borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.03)' }}>
          <div className="empty-icon" style={{ color: 'var(--text-muted)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
          <h3 className="empty-title">Trash is Clean</h3>
          <p className="empty-desc">
            No deleted notes here! When you soft-delete notes in the workspace, they will rest in this panel before getting completely purged.
          </p>
        </div>
      ) : (
        <div className="notes-grid">
          {trashedNotes.map((note) => (
            <div
              key={note.id}
              className="glass-card note-card"
              style={{ '--card-color': note.color, cursor: 'default' }}
            >
              <div className="note-card-header">
                <span className="note-category" style={{ opacity: 0.6 }}>{note.category}</span>
                <span className="note-date">{formatDate(note.createdAt)}</span>
              </div>
              <h3 className="note-title" style={{ opacity: 0.7 }}>{note.title}</h3>
              <p className="note-snippet" style={{ opacity: 0.6 }}>{note.content || "(No description content)"}</p>
              
              <div className="note-card-footer" style={{ justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Soft Deleted
                </span>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' }}
                    onClick={() => handleRestore(note.id)}
                    title="Restore to Workspace"
                  >
                    Restore
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' }}
                    onClick={() => handlePermanentDelete(note.id)}
                    title="Delete Permanently"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Trash;
