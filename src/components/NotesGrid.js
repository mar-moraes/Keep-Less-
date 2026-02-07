import React from 'react';
import NoteCard from './NoteCard';
import './NotesGrid.css';

const NotesGrid = ({
    notes,
    view,
    onNoteClick,
    onArchive,
    onUnarchive,
    onDelete,
    onRestore,
    onPermanentlyDelete,
    onColorChange,
    onImageAdd,
    onBackgroundChange,
    onCategoryChange
}) => {
    // If not Archive view, render as single grid
    if (view !== 'ARCHIVE') {
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
                        onImageAdd={onImageAdd}
                        onBackgroundChange={onBackgroundChange}
                        onCategoryChange={onCategoryChange}
                    />
                ))}
            </div>
        );
    }

    // Group by Category
    const groupedNotes = notes.reduce((acc, note) => {
        const category = note.category ? note.category : 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(note);
        return acc;
    }, {});

    const sortedCategories = Object.keys(groupedNotes).sort();

    return (
        <div className="notes-grid-container">
            {sortedCategories.map(category => (
                <div key={category} className="notes-category-section">
                    <div className="notes-grid">
                        {groupedNotes[category].map((note) => (
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
                                onImageAdd={onImageAdd}
                                onBackgroundChange={onBackgroundChange}
                                onCategoryChange={onCategoryChange}
                            />
                        ))}
                    </div>
                </div>
            ))}
            {notes.length === 0 && <div className="Empty-state">No archived notes</div>}
        </div>
    );
};

export default NotesGrid;
