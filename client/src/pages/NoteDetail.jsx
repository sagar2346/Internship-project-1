import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import notesApi from '../api/notesApi';

const PASTEL_COLORS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#a855f7', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#0ea5e9', label: 'Sky' },
  { value: '#14b8a6', label: 'Teal' }
];

function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editColor, setEditColor] = useState('#6366f1');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNoteDetails();
  }, [id]);

  const fetchNoteDetails = async () => {
    try {
      setLoading(true);
      const data = await notesApi.getNotes();
      // Since it's in-memory backend, we query active notes first
      const foundNote = data.find(n => n.id === id);

      if (!foundNote) {
        // Check in trash in case it is deleted but URL is hit directly
        const trashData = await notesApi.getTrash();
        const foundTrash = trashData.find(n => n.id === id);

        if (foundTrash) {
          setError('This note is currently in the Trash. Please restore it first to view details.');
          setNote(foundTrash);
        } else {
          setError('Note not found. It may have been permanently deleted.');
        }
      } else {
        setNote(foundNote);
        setEditTitle(foundNote.title);
        setEditContent(foundNote.content);
        setEditCategory(foundNote.category);
        setEditColor(foundNote.color);
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure. Could not query note.');
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!window.confirm('Are you sure you want to move this note to the Trash?')) return;
    try {
      await notesApi.softDeleteNote(id);
      navigate('/notes');
    } catch (err) {
      console.error(err);
      alert('Failed to delete note. Backend might be disconnected.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      alert('Title is required');
      return;
    }

    try {
      setSaving(true);
      const updated = await notesApi.updateNote(id, {
        title: editTitle.trim(),
        content: editContent.trim(),
        category: editCategory.trim() || 'General',
        color: editColor
      });
      setNote(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Could not update note.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Retrieving note workspace...</p>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="glass-card" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ color: 'var(--danger)', fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 className="empty-title" style={{ color: 'var(--danger)' }}>Note Error</h3>
        <p className="empty-desc">{error}</p>
        <Link to="/notes" className="btn btn-secondary">
          Back to Workspace
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Detail View Header */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div className="page-title-section">
          <Link to="/notes" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
            ← Back to Notes
          </Link>
          <h1 className="page-title">{isEditing ? 'Editing Note' : 'Note Workspace Details'}</h1>
        </div>

        {!isEditing && note && !note.isDeleted && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Note
            </button>
            <button className="btn btn-danger" onClick={handleSoftDelete}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      {error && note?.isDeleted && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--warning)', background: 'rgba(245,158,11,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--warning)', fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>
            {error}
          </p>
          <Link to="/trash" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Go to Trash Bin
          </Link>
        </div>
      )}

      {isEditing ? (
        /* Edit Note Form Workpace */
        <form onSubmit={handleUpdate} className="glass-card edit-form-card">
          <div className="form-group">
            <label className="form-label" htmlFor="edit-title">Title *</label>
            <input
              id="edit-title"
              type="text"
              className="form-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              maxLength={60}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-category">Category / Tag</label>
            <input
              id="edit-category"
              type="text"
              className="form-input"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              maxLength={25}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Color Label Indicator</label>
            <div className="color-selector">
              {PASTEL_COLORS.map((c) => (
                <div
                  key={c.value}
                  className={`color-circle ${editColor === c.value ? 'selected' : ''}`}
                  style={{ backgroundColor: c.value, '--circle-color': c.value }}
                  onClick={() => setEditColor(c.value)}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-content">Content Body</label>
            <textarea
              id="edit-content"
              className="form-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Details'}
            </button>
          </div>
        </form>
      ) : (
        /* View Note Workspace Details */
        <div className="detail-container">
          <div className="glass-card detail-main" style={{ borderTop: `6px solid ${note.color}` }}>
            <div className="detail-meta-row">
              <span className="detail-category-badge" style={{ backgroundColor: note.color }}>
                {note.category}
              </span>
              <span className="detail-date">
                Created: {formatDate(note.createdAt)}
              </span>
            </div>
            
            <h2 className="detail-title">{note.title}</h2>
            
            <div className="detail-content">
              {note.content || <em style={{ color: 'var(--text-muted)' }}>No description content provided.</em>}
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="glass-card meta-info-card">
              <h3 className="meta-info-title">Workspace Info</h3>
              
              <div className="meta-item">
                <span className="meta-label">Note ID</span>
                <span className="meta-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {note.id.substring(0, 8)}...
                </span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Status</span>
                <span className="meta-value" style={{ color: note.isDeleted ? 'var(--danger)' : 'var(--success)' }}>
                  {note.isDeleted ? 'Trashed' : 'Active'}
                </span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Color Code</span>
                <span className="meta-value">
                  <span className="meta-color-indicator" style={{ backgroundColor: note.color }}></span>
                  {note.color}
                </span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Word Count</span>
                <span className="meta-value">
                  {note.content ? note.content.trim().split(/\s+/).filter(Boolean).length : 0} words
                </span>
              </div>
            </div>

            {!note.isDeleted && (
              <div className="detail-actions-panel">
                <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setIsEditing(true)}>
                  Modify Note Content
                </button>
                <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleSoftDelete}>
                  Soft Delete (Trash)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteDetail;
