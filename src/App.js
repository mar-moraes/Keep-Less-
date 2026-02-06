import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteInput from './components/NoteInput';
import NotesGrid from './components/NotesGrid';
import NoteModal from './components/NoteModal';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [view, setView] = useState('NOTES'); // NOTES, ARCHIVE, TRASH
  const [notes, setNotes] = useState([
    { id: 1, title: 'Welcome to Keep Less', content: 'This is a clone of Google Keep created with React.', isArchived: false, isTrashed: false, color: '#ffffff' },
    { id: 2, title: 'Features', content: '- Create notes\n- Responsive design\n- Sidebar navigation\n- Masonry grid layout', isArchived: false, isTrashed: false, color: '#ffffff' },
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const addNote = (noteParams) => {
    const newNote = {
      id: Date.now(),
      isArchived: false,
      isTrashed: false,
      color: '#ffffff',
      ...noteParams
    };
    setNotes([newNote, ...notes]);
  };

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
    setNotes(notes.map(n => n.id === id ? { ...n, color } : n));
  };

  // Filter notes based on current view
  const getFilteredNotes = () => {
    switch (view) {
      case 'ARCHIVE':
        return notes.filter(n => n.isArchived && !n.isTrashed);
      case 'TRASH':
        return notes.filter(n => n.isTrashed);
      case 'NOTES':
      default:
        return notes.filter(n => !n.isArchived && !n.isTrashed);
    }
  };

  return (
    <div className="app">
      <Header toggleSidebar={toggleSidebar} />
      <div className="main-container">
        <Sidebar
          isExpanded={isSidebarExpanded}
          activeView={view}
          onViewChange={setView}
        />
        <main className="content">
          {view === 'NOTES' && <NoteInput onAddParams={addNote} />}
          <NotesGrid
            notes={getFilteredNotes()}
            onNoteClick={handleNoteClick}
            onArchive={archiveNote}
            onUnarchive={unarchiveNote}
            onDelete={deleteNote}
            onRestore={restoreNote}
            onPermanentlyDelete={permanentlyDeleteNote}
            onColorChange={changeNoteColor}
          />
        </main>
      </div>
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={handleCloseModal}
          onUpdate={handleUpdateNote}
        />
      )}
    </div>
  );
}

export default App;
