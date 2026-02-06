import React, { useState } from 'react';
import './NoteCard.css';

const NoteCard = ({
    note,
    onClick,
    onArchive,
    onUnarchive,
    onDelete,
    onRestore,
    onPermanentlyDelete,
    onColorChange
}) => {
    const [showColorPalette, setShowColorPalette] = useState(false);

    const colors = [
        '#ffffff', // Default
        '#f28b82', // Red
        '#fbbc04', // Orange
        '#fff475', // Yellow
        '#ccff90', // Green
        '#a7ffeb', // Teal
        '#cbf0f8', // Blue
        '#aecbfa', // Dark Blue
        '#d7aefb', // Purple
        '#fdcfe8', // Pink
        '#e6c9a8', // Brown
        '#e8eaed'  // Gray
    ];

    const handleAction = (e, action) => {
        e.stopPropagation();
        action();
    };

    const togglePalette = (e) => {
        e.stopPropagation();
        setShowColorPalette(!showColorPalette);
    };

    return (
        <div
            className="note-card"
            onClick={() => onClick(note)}
            style={{ backgroundColor: note.color || '#ffffff' }}
        >
            {note.title && <div className="note-title">{note.title}</div>}
            <div className="note-content">{note.content}</div>
            <div className="note-footer-actions">
                {note.isTrashed ? (
                    <>
                        <button
                            className="icon-button-small"
                            title="Restore"
                            onClick={(e) => handleAction(e, () => onRestore(note.id))}
                        >
                            <span className="material-icons">restore_from_trash</span>
                        </button>
                        <button
                            className="icon-button-small"
                            title="Delete Forever"
                            onClick={(e) => handleAction(e, () => onPermanentlyDelete(note.id))}
                        >
                            <span className="material-icons">delete_forever</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button className="icon-button-small" title="Remind me" onClick={(e) => e.stopPropagation()}><span className="material-icons">add_alert</span></button>
                        <button className="icon-button-small" title="Collaborator" onClick={(e) => e.stopPropagation()}><span className="material-icons">person_add</span></button>

                        <div className="color-palette-wrapper">
                            <button
                                className="icon-button-small"
                                title="Change color"
                                onClick={togglePalette}
                            >
                                <span className="material-icons">palette</span>
                            </button>
                            {showColorPalette && (
                                <div className="color-palette" onClick={(e) => e.stopPropagation()}>
                                    {colors.map(color => (
                                        <div
                                            key={color}
                                            className="color-option"
                                            style={{ backgroundColor: color }}
                                            onClick={() => {
                                                onColorChange(note.id, color);
                                                setShowColorPalette(false);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="icon-button-small" title="Add image" onClick={(e) => e.stopPropagation()}><span className="material-icons">image</span></button>

                        {note.isArchived ? (
                            <button
                                className="icon-button-small"
                                title="Unarchive"
                                onClick={(e) => handleAction(e, () => onUnarchive(note.id))}
                            >
                                <span className="material-icons">unarchive</span>
                            </button>
                        ) : (
                            <button
                                className="icon-button-small"
                                title="Archive"
                                onClick={(e) => handleAction(e, () => onArchive(note.id))}
                            >
                                <span className="material-icons">archive</span>
                            </button>
                        )}

                        <button
                            className="icon-button-small"
                            title="Delete"
                            onClick={(e) => handleAction(e, () => onDelete(note.id))}
                        >
                            <span className="material-icons">delete</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NoteCard;
