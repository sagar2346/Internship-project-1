import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const notesApi = {
  // Get all active notes
  getNotes: async () => {
    const response = await axios.get(`${API_BASE_URL}/notes`);
    return response.data;
  },

  // Get all trashed notes
  getTrash: async () => {
    const response = await axios.get(`${API_BASE_URL}/notes/trash`);
    return response.data;
  },

  // Create a new note
  createNote: async (noteData) => {
    const response = await axios.post(`${API_BASE_URL}/notes`, noteData);
    return response.data;
  },

  // Update an existing note
  updateNote: async (id, noteData) => {
    const response = await axios.put(`${API_BASE_URL}/notes/${id}`, noteData);
    return response.data;
  },

  // Soft delete a note (move to trash)
  softDeleteNote: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/notes/${id}`);
    return response.data;
  },

  // Restore a note from trash
  restoreNote: async (id) => {
    const response = await axios.put(`${API_BASE_URL}/notes/${id}/restore`);
    return response.data;
  },

  // Permanently delete a note
  permanentDeleteNote: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/notes/${id}/permanent`);
    return response.data;
  }
};

export default notesApi;
