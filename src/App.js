import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteInput from './components/NoteInput';
import NotesGrid from './components/NotesGrid';
import NoteModal from './components/NoteModal';
import EditLabelsModal from './components/EditLabelsModal';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [view, setView] = useState('NOTES'); // NOTES, ARCHIVE, TRASH
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [labels, setLabels] = useState([]); // Initial labels empty
  const [notes, setNotes] = useState([]); // Initial notes empty

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Label Management
  const handleAddLabel = (newLabel) => {
    if (!labels.includes(newLabel)) {
      setLabels([...labels, newLabel]);
    }
  };

  const handleRenameLabel = (oldLabel, newLabel) => {
    if (labels.includes(newLabel)) {
      alert('Label already exists!');
      return;
    }
    setLabels(labels.map(l => l === oldLabel ? newLabel : l));
    // Update notes with this label
    setNotes(notes.map(n => n.category === oldLabel ? { ...n, category: newLabel } : n));
  };

  const handleDeleteLabel = (label) => {
    setLabels(labels.filter(l => l !== label));
    // Remove category from notes (optional: or keep as orphaned text, but usually we clear it)
    setNotes(notes.map(n => n.category === label ? { ...n, category: '' } : n));
  };

  const addNote = (noteParams) => {
    // ... existing addNote code
    const newNote = {
      id: Date.now(),
      isArchived: false,
      isTrashed: false,
      color: '#ffffff',
      images: [],
      backgroundImage: null,
      category: '',
      ...noteParams
    };
    setNotes([newNote, ...notes]);
  };

  // ... existing handlers (handleNoteClick, handleCloseModal, etc.) ...
  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const archiveNote = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isArchived: true, isTrashed: false } : n));
  };

  const unarchiveNote = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isArchived: false } : n));
  };

  const deleteNote = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isTrashed: true, isArchived: false } : n));
  };

  const restoreNote = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isTrashed: false } : n));
  };

  const permanentlyDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const changeNoteColor = (id, color) => {
    setNotes(notes.map(n => n.id === id ? { ...n, color, backgroundImage: null } : n));
  };

  const addImageToNote = (id, imageUrl) => {
    setNotes(notes.map(n => n.id === id ? { ...n, images: [...(n.images || []), imageUrl] } : n));
  };

  const changeNoteBackground = (id, backgroundImage) => {
    setNotes(notes.map(n => n.id === id ? { ...n, backgroundImage, color: '#ffffff' } : n));
  };

  const changeNoteCategory = (id, category) => {
    setNotes(notes.map(n => n.id === id ? { ...n, category } : n));
  };

  // Filter notes based on current view
  const getFilteredNotes = () => {
    switch (view) {
      case 'ARCHIVE':
        return notes.filter(n => n.isArchived && !n.isTrashed);
      case 'TRASH':
        return notes.filter(n => n.isTrashed);
      case 'NOTES':
        return notes.filter(n => !n.isArchived && !n.isTrashed);
      default:
        // Assume view is a Label
        return notes.filter(n => n.category === view && !n.isTrashed && !n.isArchived);
    }
  };

  // Handle Sidebar View Change
  const handleViewChange = (newView) => {
    if (newView === 'LABELS') {
      setIsLabelModalOpen(true);
    } else {
      setView(newView);
    }
  };

  return (
    <div className="app">
      <Header toggleSidebar={toggleSidebar} />
      <div className="main-container">
        <Sidebar
          isExpanded={isSidebarExpanded}
          activeView={view}
          onViewChange={handleViewChange}
          labels={labels}
        />
        <main className="content">
          {(view === 'NOTES' || !['ARCHIVE', 'TRASH'].includes(view)) && (
            <NoteInput onAddParams={(params) => addNote({ ...params, category: view === 'NOTES' ? '' : view })} />
          )}
          <NotesGrid
            notes={getFilteredNotes()}
            view={view}
            onNoteClick={handleNoteClick}
            onArchive={archiveNote}
            onUnarchive={unarchiveNote}
            onDelete={deleteNote}
            onRestore={restoreNote}
            onPermanentlyDelete={permanentlyDeleteNote}
            onColorChange={changeNoteColor}
            onImageAdd={addImageToNote}
            onBackgroundChange={changeNoteBackground}
            onCategoryChange={changeNoteCategory}
          />
        </main>
      </div>

      {isLabelModalOpen && (
        <EditLabelsModal
          labels={labels}
          onAdd={handleAddLabel}
          onRename={handleRenameLabel}
          onDelete={handleDeleteLabel}
          onClose={() => setIsLabelModalOpen(false)}
        />
      )}

      {selectedNote && (
        <NoteModal
          note={notes.find(n => n.id === selectedNote.id) || selectedNote}
          onClose={handleCloseModal}
          onUpdate={handleUpdateNote}
          onArchive={archiveNote}
          onUnarchive={unarchiveNote}
          onDelete={deleteNote}
          onRestore={restoreNote}
          onPermanentlyDelete={permanentlyDeleteNote}
          onColorChange={changeNoteColor}
          onImageAdd={addImageToNote}
          onBackgroundChange={changeNoteBackground}
          onCategoryChange={changeNoteCategory}
        />
      )}
    </div>
  );
}

export default App;
