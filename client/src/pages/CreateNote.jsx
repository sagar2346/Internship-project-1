import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

function CreateNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#6366f1'); // Default Indigo
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('A title is required to create a note.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await notesApi.createNote({
        title: title.trim(),
        content: content.trim(),
        category: category.trim() || 'General',
        color: color
      });
      navigate('/notes');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to connect to backend and save note.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div className="page-title-section">
          <h1 className="page-title">Create New Note</h1>
          <p className="page-subtitle">Add a fresh thought, plan, or snippet into in-memory storage.</p>
        </div>
        <Link to="/notes" className="btn btn-secondary">
          Cancel
        </Link>
      </div>

      {error && (
        <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--danger)', background: 'rgba(244,63,94,0.05)' }}>
          <p style={{ color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 600 }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card">
        <div className="form-group">
          <label className="form-label" htmlFor="note-title">Note Title *</label>
          <input
            id="note-title"
            type="text"
            className="form-input"
            placeholder="e.g. Brainstorming UI/UX changes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={60}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="note-category">Category / Tag</label>
          <input
            id="note-category"
            type="text"
            className="form-input"
            placeholder="e.g. Work, Ideas, Shopping, Personal (Default: General)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={25}
          />
        </div>

        {/* Circular Color Label Selector */}
        <div className="form-group">
          <label className="form-label">Select Color Label</label>
          <div className="color-selector">
            {PASTEL_COLORS.map((c) => (
              <div
                key={c.value}
                className={`color-circle ${color === c.value ? 'selected' : ''}`}
                style={{ backgroundColor: c.value, '--circle-color': c.value }}
                onClick={() => setColor(c.value)}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="note-content">Note Content</label>
          <textarea
            id="note-content"
            className="form-textarea"
            placeholder="Write down your thoughts, bullets, links, or code here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <Link to="/notes" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Save Note'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateNote;
