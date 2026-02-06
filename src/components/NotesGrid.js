import React from 'react';
import NoteCard from './NoteCard';
import './NotesGrid.css';

const NotesGrid = ({
    notes,
    onNoteClick,
    onArchive,
    onUnarchive,
    onDelete,
    onRestore,
    onPermanentlyDelete,
    onColorChange
}) => {
    return (
        <div className="notes-grid">
            {notes.map((note) => (
                <NoteCard
                    key={note.id}
                    note={note}
                    onClick={onNoteClick}
                    onArchive={onArchive}
                    onUnarchive={onUnarchive}
                    onDelete={onDelete}
                    onRestore={onRestore}
                    onPermanentlyDelete={onPermanentlyDelete}
                    onColorChange={onColorChange}
                />
            ))}
        </div>
    );
};

export default NotesGrid;
