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
    // If not Archive view, render as single grid (or split if Label view has archived)
    if (view !== 'ARCHIVE') {
        const activeNotes = notes.filter(n => !n.isArchived);
        const archivedNotes = notes.filter(n => n.isArchived);

        return (
            <div className="notes-grid-wrapper">
                {/* Active Notes */}
                {activeNotes.length > 0 && (
                    <div className="notes-grid">
                        {activeNotes.map((note) => (
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
                )}

                {/* Archived Notes in Label View */}
                {archivedNotes.length > 0 && (
                    <div className="archived-section">
                        <div className="section-header" style={{ color: '#9AA0A6', marginBottom: '10px', marginLeft: '10px', fontSize: '12px' }}>ARCHIVE</div>
                        <div className="notes-grid">
                            {archivedNotes.map((note) => (
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
                )}


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

        </div>
    );
};

export default NotesGrid;
