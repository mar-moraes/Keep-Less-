const API_URL = 'http://localhost:5000';

// Helper for Auth Header
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const api = {
    // Auth
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            } else {
                const text = await response.text();
                throw new Error(`Server Error (${response.status}): ${text.substring(0, 100)}... (Likely 404/500 HTML)`);
            }
        }
        return response.json();
    },

    register: async (name, email, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            } else {
                const text = await response.text();
                throw new Error(`Server Error (${response.status}): ${text.substring(0, 100)}... (Likely 404/500 HTML)`);
            }
        }
        return response.json();
    },

    // Notes
    getNotes: async () => {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/notes`, { headers });
        if (!response.ok) throw new Error('Failed to fetch notes');
        return response.json();
    },

    createNote: async (note) => {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        if (!response.ok) throw new Error('Failed to create note');
        return response.json();
    },

    updateNote: async (note) => {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/notes/${note.id}`, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        if (!response.ok) throw new Error('Failed to update note');
        return response.json();
    },

    deleteNote: async (id) => {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE',
            headers
        });
        if (!response.ok) throw new Error('Failed to delete note');
        return response.json();
    },

    // Labels
    getLabels: async () => {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/labels`, { headers });
        if (!response.ok) throw new Error('Failed to fetch labels');
        return response.json();
    },

    createLabel: async (name) => {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/labels`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (!response.ok) throw new Error('Failed to create label');
        return response.json();
    },

    updateLabel: async (id, name) => {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/labels/${id}`, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (!response.ok) throw new Error('Failed to update label');
        return response.json();
    },

    deleteLabel: async (id) => {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/labels/${id}`, {
            method: 'DELETE',
            headers
        });
        if (!response.ok) throw new Error('Failed to delete label');
        return response.json();
    }
};

export default api;
