const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const collaboratorRoutes = require('./routes/collaborators');
const authenticateToken = require('./middleware/auth');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// ROUTES

// Auth Routes
app.use('/auth', authRoutes);
app.use('/collaborators', collaboratorRoutes);

// Create a Note
app.post('/notes', authenticateToken, async (req, res) => {
    try {
        const { title, content, isArchived, isTrashed, color, backgroundImage, category, images } = req.body;
        const newNote = await pool.query(
            'INSERT INTO notes (title, content, is_archived, is_trashed, color, background_image, category, images, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [title, content, isArchived, isTrashed, color, backgroundImage, category, images, req.user.id]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get All Notes
app.get('/notes', authenticateToken, async (req, res) => {
    try {
        const allNotes = await pool.query(
            `SELECT DISTINCT n.* 
             FROM notes n 
             LEFT JOIN collaborators c ON n.id = c.note_id 
             WHERE n.user_id = $1 OR c.user_id = $1 
             ORDER BY n.id DESC`,
            [req.user.id]
        );
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
app.put('/notes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isArchived, isTrashed, color, backgroundImage, category, images } = req.body;
        // Verify user owns note
        // Verify user owns note or is collaborator
        const checkOwner = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
        if (checkOwner.rows.length === 0) {
            return res.status(404).json('Note not found');
        }

        const note = checkOwner.rows[0];
        let isAuthorized = note.user_id === req.user.id;

        if (!isAuthorized) {
            const checkCollaborator = await pool.query(
                'SELECT * FROM collaborators WHERE note_id = $1 AND user_id = $2',
                [id, req.user.id]
            );
            if (checkCollaborator.rows.length > 0) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            return res.status(403).json('Not Authorized');
        }

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
app.delete('/notes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteNote = await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (deleteNote.rowCount === 0) {
            return res.status(403).json('Not Authorized or Note not found');
        }
        res.json('Note was deleted!');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// LABELS

app.post('/labels', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        const newLabel = await pool.query('INSERT INTO labels (name, user_id) VALUES($1, $2) RETURNING *', [name, req.user.id]);
        res.json(newLabel.rows[0].name);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/labels', authenticateToken, async (req, res) => {
    try {
        const allLabels = await pool.query('SELECT * FROM labels WHERE user_id = $1 ORDER BY name ASC', [req.user.id]);
        res.json(allLabels.rows.map(l => l.name));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.delete('/labels/:name', authenticateToken, async (req, res) => {
    try {
        const { name } = req.params;
        const deleteLabel = await pool.query('DELETE FROM labels WHERE name = $1 AND user_id = $2', [name, req.user.id]);
        if (deleteLabel.rowCount === 0) {
            return res.status(404).json('Label not found');
        }
        res.json('Label deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
    console.log(`Collaborator routes loaded.`);
});
