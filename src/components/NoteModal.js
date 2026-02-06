import React, { useState, useEffect, useRef } from 'react';
import './NoteModal.css';

const NoteModal = ({ note, onClose, onUpdate }) => {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const modalRef = useRef(null);

    // Update local state if note prop changes
    useEffect(() => {
        setTitle(note.title);
        setContent(note.content);
    }, [note]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [title, content]);

    const handleClose = () => {
        onUpdate({ ...note, title, content });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <input
                    type="text"
                    className="modal-title-input"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="modal-content-input"
                    placeholder="Note"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="modal-footer">
                    <div className="modal-actions">
                        <button className="icon-button-small"><span className="material-icons">add_alert</span></button>
                        <button className="icon-button-small"><span className="material-icons">person_add</span></button>
                        <button className="icon-button-small"><span className="material-icons">palette</span></button>
                        <button className="icon-button-small"><span className="material-icons">image</span></button>
                        <button className="icon-button-small"><span className="material-icons">archive</span></button>
                        <button className="icon-button-small"><span className="material-icons">more_vert</span></button>
                        <button className="icon-button-small"><span className="material-icons">undo</span></button>
                        <button className="icon-button-small"><span className="material-icons">redo</span></button>
                    </div>
                    <button className="close-button" onClick={handleClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;
