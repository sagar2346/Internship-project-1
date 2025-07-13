# CleanNotes - Full-Stack MERN Notes App (No Database)

CleanNotes is an ultra-modern, high-fidelity Notes application built with a Node.js + Express backend and a React + Vite frontend. It features in-memory storage (plain JavaScript arrays) on the server, a complete glassmorphic Dark Space theme, and full CRUD operations with soft deletion capability.

## Features
- **Modern Landing Page**: Dynamic introduction to workspace areas and stats.
- **Searchable Grid**: Instant real-time filtering of active notes by title.
- **Category Filters**: Easily group and view your notes by customized category tags.
- **Color Coding**: Select curated pastel color circles to prioritize and label note cards.
- **Soft Deletion**: Trash bin holds deleted notes where they can be restored or wiped permanently.
- **Analytics Dashboard**: Rich static page displaying active, trashed, and category distributions.

## Tech Stack
- **Frontend**: React 19, Vite, React Router v6, Axios, Custom Glassmorphic CSS.
- **Backend**: Node.js, Express, Cors, Dotenv, In-Memory JavaScript Storage.

## How to Run Locally

### 1. Start the Backend Server
```bash
cd server
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
