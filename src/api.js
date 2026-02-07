const API_URL = 'http://localhost:5000';

const api = {
    // Notes
    getNotes: async () => {
        const response = await fetch(`${API_URL}/notes`);
        if (!response.ok) throw new Error('Failed to fetch notes');
        return response.json();
    },

    createNote: async (note) => {
        const response = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        if (!response.ok) throw new Error('Failed to create note');
        return response.json();
    },

    updateNote: async (id, updates) => {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update note');
        return response.json(); // Backend returns string message, might want to return update object or just success
    },

    deleteNote: async (id) => {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete note');
        return response.json();
    },

    // Labels
    getLabels: async () => {
        const response = await fetch(`${API_URL}/labels`);
        if (!response.ok) throw new Error('Failed to fetch labels');
        return response.json();
    },

    createLabel: async (name) => {
        const response = await fetch(`${API_URL}/labels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (!response.ok) throw new Error('Failed to create label');
        return response.json();
    },

    deleteLabel: async (name) => {
        const response = await fetch(`${API_URL}/labels/${name}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete label');
        return response.json();
    }
};

export default api;
