const router = require('express').Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Configure Nodemailer (Using Ethereal for dev/demo or just console log if fails)
// In a real app, these should be in .env
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.pass'
    }
});

// Helper to send email
const sendInvitationEmail = async (toEmail, noteTitle, ownerName) => {
    try {
        // In a real scenario with valid credentials:
        if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your-email@gmail.com') {
            await transporter.sendMail({
                from: `"Keep Less" <${process.env.SMTP_USER}>`,
                to: toEmail,
                subject: `You've been invited to collaborate on "${noteTitle}"`,
                text: `${ownerName} has invited you to collaborate on the note "${noteTitle}".`
            });
            console.log(`[EMAIL SENT] To: ${toEmail} | Subject: Invitation to "${noteTitle}" from ${ownerName}`);
        } else {
            console.log(`[MOCK EMAIL] To: ${toEmail} | Subject: Invitation to "${noteTitle}" from ${ownerName} (Configure .env to send real emails)`);
        }
        console.log(`[MOCK EMAIL] To: ${toEmail} | Subject: Invitation to "${noteTitle}" from ${ownerName}`);
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

// Get collaborators for a note
router.get('/:noteId', authenticateToken, async (req, res) => {
    try {
        const { noteId } = req.params;

        // Use a single query to check access and get collaborators
        const noteCheck = await pool.query('SELECT user_id FROM notes WHERE id = $1', [noteId]);

        if (noteCheck.rows.length === 0) {
            return res.status(404).json('Note not found');
        }

        const ownerId = noteCheck.rows[0].user_id;

        // Check if requester is owner OR collaborator
        const isCollaborator = await pool.query(
            'SELECT * FROM collaborators WHERE note_id = $1 AND user_id = $2',
            [noteId, req.user.id]
        );

        if (ownerId !== req.user.id && isCollaborator.rows.length === 0) {
            return res.status(403).json('Not Authorized');
        }

        // Fetch collaborators details
        const collaborators = await pool.query(
            `SELECT u.id, u.name, u.email 
             FROM collaborators c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.note_id = $1`,
            [noteId]
        );

        // Also fetch owner details
        const owner = await pool.query(
            'SELECT id, name, email FROM users WHERE id = $1',
            [ownerId]
        );

        res.json({
            owner: owner.rows[0],
            collaborators: collaborators.rows
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a collaborator
router.post('/:noteId', authenticateToken, async (req, res) => {
    try {
        const { noteId } = req.params;
        const { email } = req.body;

        // 1. Verify Property (Only owner can add collaborators)
        const note = await pool.query('SELECT * FROM notes WHERE id = $1', [noteId]);

        if (note.rows.length === 0) {
            return res.status(404).json('Note not found');
        }

        if (note.rows[0].user_id !== req.user.id) {
            return res.status(403).json('Only the owner can add collaborators');
        }

        // 2. Find User by Email (Case Insensitive)
        const userToAdd = await pool.query('SELECT id, name, email FROM users WHERE LOWER(email) = LOWER($1)', [email]);

        if (userToAdd.rows.length === 0) {
            return res.status(404).json('User not found');
        }

        const newUserId = userToAdd.rows[0].id;

        // 3. Prevent adding self
        if (newUserId === req.user.id) {
            return res.status(400).json('Cannot add yourself as collaborator');
        }

        // 4. Check if already collaborator
        const existing = await pool.query(
            'SELECT * FROM collaborators WHERE note_id = $1 AND user_id = $2',
            [noteId, newUserId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json('User is already a collaborator');
        }

        // 5. Add to table
        await pool.query(
            'INSERT INTO collaborators (note_id, user_id) VALUES ($1, $2)',
            [noteId, newUserId]
        );

        // 6. Send Email (Mocked/Async)
        // Fetch owner name
        const owner = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
        sendInvitationEmail(email, note.rows[0].title || 'Untitled Note', owner.rows[0].name);

        res.json(userToAdd.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Remove a collaborator
router.delete('/:noteId/:userId', authenticateToken, async (req, res) => {
    try {
        const { noteId, userId } = req.params;

        // Verify Owner
        const note = await pool.query('SELECT user_id FROM notes WHERE id = $1', [noteId]);

        if (note.rows.length === 0) {
            return res.status(404).json('Note not found');
        }

        if (note.rows[0].user_id !== req.user.id) {
            // Optional: Allow collaborator to remove themselves? For now, stick to Owner control.
            // If we want collaborator to leave, we check if userId === req.user.id
            if (parseInt(userId) !== req.user.id) {
                return res.status(403).json('Not Authorized');
            }
        }

        const deleteOp = await pool.query(
            'DELETE FROM collaborators WHERE note_id = $1 AND user_id = $2',
            [noteId, userId]
        );

        if (deleteOp.rowCount === 0) {
            return res.status(404).json('Collaborator not found');
        }

        res.json('Collaborator removed');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
