# Implementation Plan - Full-Stack Notes App (No Database)

Build a modern, highly aesthetic, full-stack Notes App using the MERN stack but **without a database**. The backend will use in-memory storage (plain JavaScript arrays), and the frontend will be built using React, Vite, React Router, Axios, and custom premium CSS.

---

## User Review Required

> [!IMPORTANT]
> The server will use in-memory storage (a JavaScript array). **All note data will reset when the backend server restarts.** This is expected and complies with the prompt requirements.

> [!NOTE]
> We will create a two-folder structure: `/server` (Express backend) and `/client` (React Vite frontend) under `c:\Users\LENOVO\Desktop\Notes App (INTERNSHIP)`.

---

## Proposed Changes

### Backend Component (`/server`)

We will create a lightweight Express server with:
1. `cors` enabled to allow frontend requests.
2. `dotenv` for configuration (default port `5000`).
3. An in-memory JavaScript array to hold note objects.
4. Express routing to handle RESTful operations:
   - `GET /api/notes` - Get all active notes (`isDeleted` is false).
   - `POST /api/notes` - Create a new note.
   - `PUT /api/notes/:id` - Update a note.
   - `DELETE /api/notes/:id` - Soft delete a note (sets `isDeleted: true`).
   - `GET /api/notes/trash` - Get all soft-deleted notes (`isDeleted` is true).
   - `PUT /api/notes/:id/restore` - Restore a note from trash (sets `isDeleted: false`).
   - `DELETE /api/notes/:id/permanent` - Permanently delete a note (removes from array).

#### [NEW] [/server/package.json](file:///c:/Users/LENOVO/Desktop/Notes%20App%20(INTERNSHIP)/server/package.json)
Initializes backend packages: `express`, `cors`, `dotenv`, `nodemon` (for dev speed).

#### [NEW] [/server/.env](file:///c:/Users/LENOVO/Desktop/Notes%20App%20(INTERNSHIP)/server/.env)
Port configuration (`PORT=5000`).

#### [NEW] [/server/server.js](file:///c:/Users/LENOVO/Desktop/Notes%20App%20(INTERNSHIP)/server/server.js)
Contains all Express routing, middlewares, and the in-memory array.

---

### Frontend Component (`/client`)

We will create a React + Vite + React Router single page application.

#### Features & Pages:
1. **Home**: Premium landing page with a hero section, glowing glassmorphic elements, modern typography, and a prominent "Go to Notes" button.
2. **All Notes**: Searchable grid of active notes by title. Filter by Category. Modern grid cards with soft pastel color indicators, dates, and hover lift micro-animations.
3. **Create Note**: A form with inputs for title, category, rich content text, and a circular color picker.
4. **Note Detail**: View single note with formatted body, date, edit form modal (or inline toggle), and a soft delete button.
5. **Trash**: View trashed notes in a separate workspace with "Restore" and "Delete Permanently" actions.
6. **Profile**: Clean dashboard showing notes analytics (Total count, active, trashed, counts per category) and info about the application.

#### Design System:
- **Font**: Google Font `Plus Jakarta Sans` or `Outfit` for premium look.
- **Color Palette**: Dark Slate / Deep Purple base theme with glowing translucent glassmorphic (`backdrop-filter`) sidebar and panels.
- **Note Colors**: Beautiful soft colors (e.g., pastel coral, lavender, mint green, sky blue, warm amber).
- **Icons**: Clean SVG-based inline or CSS icon system.

#### [NEW] [/client/index.html](file:///c:/Users/LENOVO/Desktop/Notes%20App%20(INTERNSHIP)/client/index.html)
Loads Google Fonts and sets app title.

#### [NEW] [/client/src/main.jsx](file:///c:/Users/LENOVO/Desktop/Notes%20App%20(INTERNSHIP)/client/src/main.jsx)
React app entry point.

#### [NEW] [/client/src/App.jsx](file:///c:/Users/LENOVO/Desktop/Notes%20App%20(INTERNSHIP)/client/src/App.jsx)
Defines React Router navigation across the 6 pages, main sidebar/navbar layout.

#### [NEW] [/client/src/index.css](file:///c:/Users/LENOVO/Desktop/Notes%20App%20(INTERNSHIP)/client/src/index.css)
Global styling with high-fidelity styles, theme variables, glassmorphic variables, and responsive classes.

#### [NEW] [/client/src/api/notesApi.js](file:///c:/Users/LENOVO/Desktop/Notes%20App%20(INTERNSHIP)/client/src/api/notesApi.js)
Axios configurations and requests to backend API.

#### [NEW] [/client/src/pages/...](file:///c:/Users/LENOVO/Desktop/Notes%20App%20(INTERNSHIP)/client/src/pages)
Individual React pages:
- `Home.jsx`
- `AllNotes.jsx`
- `CreateNote.jsx`
- `NoteDetail.jsx`
- `Trash.jsx`
- `Profile.jsx`

---

## Verification Plan

### Automated/Tool Verification
- Verify backend API endpoints using interactive testing or browser testing.
- Launch the React app using the browser tool to confirm that all pages render, navigation operates smoothly, creation works, soft-delete moves to trash, restore works, and permanent delete deletes the note.

### Manual Verification
- Visual inspection of the responsive layouts.
- Verifying color selections and search functionalities.
