import React, { useState, useRef, useEffect } from 'react';
import './NoteInput.css';

const NoteInput = ({ onAddParams }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const containerRef = useRef(null);

    // Close input when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                if (title.trim() || content.trim()) {
                    closeInput();
                } else {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [title, content]); // Dep needed to capture current state

    const closeInput = () => {
        if (title.trim() || content.trim()) {
            onAddParams({ title, content });
        }
        setTitle('');
        setContent('');
        setIsExpanded(false);
    };

    return (
        <div className={`note-input-container ${isExpanded ? 'expanded' : ''}`} ref={containerRef}>
            {!isExpanded ? (
                <div className="note-input-collapsed" onClick={() => setIsExpanded(true)}>
                    <span className="placeholder-text">Take a note...</span>
                    <div className="icon-actions">
                        <button className="icon-button-small">
                            <span className="material-icons">check_box</span>
                        </button>
                        <button className="icon-button-small">
                            <span className="material-icons">brush</span>
                        </button>
                        <button className="icon-button-small">
                            <span className="material-icons">image</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="note-input-expanded">
                    <input
                        type="text"
                        placeholder="Title"
                        className="note-title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Take a note..."
                        className="note-content-input"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        autoFocus
                    />
                    <div className="note-actions">
                        <div className="left-actions">
                            <button className="icon-button-small"><span className="material-icons">add_alert</span></button>
                            <button className="icon-button-small"><span className="material-icons">person_add</span></button>
                            <button className="icon-button-small"><span className="material-icons">palette</span></button>
                            <button className="icon-button-small"><span className="material-icons">image</span></button>
                            <button className="icon-button-small"><span className="material-icons">archive</span></button>
                            <button className="icon-button-small"><span className="material-icons">more_vert</span></button>
                            <button className="icon-button-small"><span className="material-icons">undo</span></button>
                            <button className="icon-button-small"><span className="material-icons">redo</span></button>
                        </div>
                        <button className="close-button" onClick={closeInput}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteInput;
