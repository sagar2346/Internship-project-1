import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// In-memory note storage
// Initial mock data to make the app look nice right away when loaded
let notes = [
  {
    id: "1",
    title: "Welcome to Notes App! 🚀",
    content: "This is a full-stack MERN notes application that runs completely in-memory without any database! Try creating, editing, category filtering, or deleting notes to see it in action.",
    category: "Getting Started",
    color: "#6366f1", // indigo
    isDeleted: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "2",
    title: "Project Ideas for Summer 💡",
    content: "1. Build a custom CSS visual builder.\n2. Design a minimalist task tracker.\n3. Create a canvas-based flow charting tool.",
    category: "Ideas",
    color: "#f59e0b", // amber
    isDeleted: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "3",
    title: "Shopping List 🛒",
    content: "- Sourdough bread\n- Organic avocados\n- Fresh blueberries\n- Oat milk (extra creamy)\n- Dark roast coffee beans",
    category: "Personal",
    color: "#10b981", // emerald
    isDeleted: false,
    createdAt: new Date(Date.now() - 60000).toISOString()
  },
  {
    id: "4",
    title: "Archived Draft (Soft Deleted) 🗑️",
    content: "This is a note that was deleted. You can restore it or permanently delete it from the Trash page!",
    category: "Drafts",
    color: "#ef4444", // rose/red
    isDeleted: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Helper to generate unique IDs
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 1. GET /api/notes — get all active notes
app.get('/api/notes', (req, res) => {
  try {
    const activeNotes = notes.filter(note => !note.isDeleted);
    res.json(activeNotes);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve notes", error: error.message });
  }
});

// 2. GET /api/notes/trash — get all trashed notes
app.get('/api/notes/trash', (req, res) => {
  try {
    const trashedNotes = notes.filter(note => note.isDeleted);
    res.json(trashedNotes);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve trashed notes", error: error.message });
  }
});

// 3. POST /api/notes — create a new note
app.post('/api/notes', (req, res) => {
  try {
    const { title, content, category, color } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: "Title is required" });
    }

    const newNote = {
      id: generateId(),
      title: title.trim(),
      content: content ? content.trim() : "",
      category: category ? category.trim() : "General",
      color: color || "#6366f1",
      isDeleted: false,
      createdAt: new Date().toISOString()
    };

    notes.push(newNote);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note", error: error.message });
  }
});

// 4. PUT /api/notes/:id — update a note
app.put('/api/notes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, color } = req.body;

    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update note fields if they are provided
    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      notes[noteIndex].title = title.trim();
    }
    if (content !== undefined) notes[noteIndex].content = content.trim();
    if (category !== undefined) notes[noteIndex].category = category.trim() || "General";
    if (color !== undefined) notes[noteIndex].color = color;

    res.json(notes[noteIndex]);
  } catch (error) {
    res.status(500).json({ message: "Failed to update note", error: error.message });
  }
});

// 5. DELETE /api/notes/:id — soft delete (move to trash)
app.delete('/api/notes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    notes[noteIndex].isDeleted = true;
    res.json({ message: "Note moved to trash successfully", note: notes[noteIndex] });
  } catch (error) {
    res.status(500).json({ message: "Failed to soft-delete note", error: error.message });
  }
});

// 6. PUT /api/notes/:id/restore — restore from trash
app.put('/api/notes/:id/restore', (req, res) => {
  try {
    const { id } = req.params;
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    notes[noteIndex].isDeleted = false;
    res.json({ message: "Note restored successfully", note: notes[noteIndex] });
  } catch (error) {
    res.status(500).json({ message: "Failed to restore note", error: error.message });
  }
});

// 7. DELETE /api/notes/:id/permanent — permanently delete
app.delete('/api/notes/:id/permanent', (req, res) => {
  try {
    const { id } = req.params;
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    const deletedNote = notes.splice(noteIndex, 1)[0];
    res.json({ message: "Note permanently deleted", note: deletedNote });
  } catch (error) {
    res.status(500).json({ message: "Failed to permanently delete note", error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
