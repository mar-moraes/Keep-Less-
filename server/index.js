const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// ROUTES

// Create a Note
app.post('/notes', async (req, res) => {
    try {
        const { title, content, isArchived, isTrashed, color, backgroundImage, category, images } = req.body;
        // Postgres arrays use {}, but pg library handles JS arrays if we pass them correctly or cast
        const newNote = await pool.query(
            'INSERT INTO notes (title, content, is_archived, is_trashed, color, background_image, category, images) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, content, isArchived, isTrashed, color, backgroundImage, category, images]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get All Notes
app.get('/notes', async (req, res) => {
    try {
        const allNotes = await pool.query('SELECT * FROM notes ORDER BY id DESC'); // Newest first
        // Map database fields (snake_case) to frontend (camelCase) if needed, or update frontend to use snake_case
        // Let's return as is and handle mapping, or alias in SQL.
        // For simplicity, let's map in JS
        const formattedNotes = allNotes.rows.map(note => ({
            id: note.id,
            title: note.title,
            content: note.content,
            isArchived: note.is_archived,
            isTrashed: note.is_trashed,
            color: note.color,
            backgroundImage: note.background_image,
            category: note.category,
            images: note.images || []
        }));
        res.json(formattedNotes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a Note
app.put('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isArchived, isTrashed, color, backgroundImage, category, images } = req.body;
        const updateNote = await pool.query(
            'UPDATE notes SET title = $1, content = $2, is_archived = $3, is_trashed = $4, color = $5, background_image = $6, category = $7, images = $8 WHERE id = $9',
            [title, content, isArchived, isTrashed, color, backgroundImage, category, images, id]
        );
        res.json('Note was updated!');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a Note
app.delete('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteNote = await pool.query('DELETE FROM notes WHERE id = $1', [id]);
        res.json('Note was deleted!');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// LABELS

// Get All Labels - We can store labels in a separate table, but initially we might just derive them or store them.
// Let's implement the labels table as planned.
app.post('/labels', async (req, res) => {
    try {
        const { name } = req.body;
        const newLabel = await pool.query('INSERT INTO labels (name) VALUES($1) RETURNING *', [name]);
        res.json(newLabel.rows[0].name); // Frontend expects just strings for now in 'labels' array
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/labels', async (req, res) => {
    try {
        const allLabels = await pool.query('SELECT * FROM labels ORDER BY name ASC');
        res.json(allLabels.rows.map(l => l.name));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.delete('/labels/:name', async (req, res) => {
    try {
        const { name } = req.params;
        await pool.query('DELETE FROM labels WHERE name = $1', [name]);
        // Also update notes? For now just delete label.
        res.json('Label deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});
