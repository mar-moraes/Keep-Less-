import React, { useState, useEffect } from 'react';
import './CollaboratorModal.css';


const CollaboratorModal = ({ note, onClose, onSave }) => {
    const [collaborators, setCollaborators] = useState([]);
    const [owner, setOwner] = useState(null);
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCollaborators();
    }, [note]);

    const fetchCollaborators = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/collaborators/${note.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOwner(data.owner);
                setCollaborators(data.collaborators);
            } else {
                console.error("Failed to fetch collaborators");
            }
        } catch (error) {
            console.error("Error fetching collaborators:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCollaborator = async () => {
        if (!newEmail) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/collaborators/${note.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: newEmail })
            });

            if (response.ok) {
                const newCollab = await response.json();
                setCollaborators([...collaborators, newCollab]);
                setNewEmail('');
            } else {
                const err = await response.text(); // or json()
                alert(`Failed to add: ${err}`);
            }
        } catch (error) {
            console.error("Error adding collaborator:", error);
            alert("Error adding collaborator");
        }
    };

    const handleRemoveCollaborator = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/collaborators/${note.id}/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setCollaborators(collaborators.filter(c => c.id !== userId));
            } else {
                alert("Failed to remove collaborator");
            }
        } catch (error) {
            console.error("Error removing collaborator:", error);
        }
    };

    const handleSave = () => {
        // Since we add immediately, Save just closes. 
        // Or if 'newEmail' has content, try to add it first?
        if (newEmail) {
            handleAddCollaborator().then(() => {
                onSave();
            });
        } else {
            onSave();
        }
    };

    // Helper for Avatar
    const Avatar = ({ user }) => (
        <div className="collaborator-avatar">
            {/* If user has image url later, use it. For now placeholder */}
            <div className="avatar-placeholder">
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
        </div>
    );

    if (loading) return null; // or spinner

    return (
        <div className="collaborator-modal-overlay" onClick={onClose}>
            <div className="collaborator-modal" onClick={(e) => e.stopPropagation()}>
                <div className="collaborator-modal-header">
                    Collaborators
                </div>
                <div className="collaborator-modal-content">
                    {/* Owner Row */}
                    {owner && (
                        <div className="collaborator-row">
                            <Avatar user={owner} />
                            <div className="collaborator-info">
                                <div className="collaborator-name">
                                    {owner.name} <span className="owner-label">(Owner)</span>
                                </div>
                                <div className="collaborator-email">{owner.email}</div>
                            </div>
                        </div>
                    )}

                    {/* Collaborators List */}
                    {collaborators.map(collab => (
                        <div className="collaborator-row" key={collab.id}>
                            <Avatar user={collab} />
                            <div className="collaborator-info">
                                <div className="collaborator-name">{collab.name}</div>
                                <div className="collaborator-email">{collab.email}</div>
                            </div>
                            {/* Only owner can remove? For now assuming yes, or checking if current user is owner. 
                                 However, the UI request implies this view IS the owner view or someone with rights. 
                                 Let's allow remove action. 
                             */}
                            <div className="collaborator-remove" onClick={() => handleRemoveCollaborator(collab.id)}>
                                <span className="material-icons">close</span>
                            </div>
                        </div>
                    ))}

                    {/* Add New Row */}
                    <div className="collaborator-row">
                        <div className="collaborator-avatar">
                            <div className="avatar-icon-placeholder" style={{ backgroundColor: 'transparent', border: '1px solid #5f6368', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-icons" style={{ color: '#dadce0', fontSize: '20px' }}>person_add</span>
                            </div>
                        </div>
                        <div className="collaborator-input-wrapper">
                            <input
                                type="text"
                                className="collaborator-input"
                                placeholder="Person or email to share with"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddCollaborator();
                                    }
                                }}
                            />
                        </div>
                        {/* Display a check or add button if text is typed? Or just rely on Enter/Save */}
                        {newEmail && (
                            <div className="collaborator-remove" onClick={handleAddCollaborator} title="Add">
                                <span className="material-icons">check</span>
                            </div>
                        )}
                    </div>

                </div>
                <div className="collaborator-modal-footer">
                    <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
                    <button className="modal-btn save" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default CollaboratorModal;
