import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteInput from './components/NoteInput';
import NotesGrid from './components/NotesGrid';
import NoteModal from './components/NoteModal';
import EditLabelsModal from './components/EditLabelsModal';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import api from './api';

function Dashboard() {
  const { logout, user } = useContext(AuthContext); // Hook for logout if needed in Header
  // TODO: Pass logout to Header or Sidebar
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Para mobile offcanvas
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedNote, setSelectedNote] = useState(null);
  const [view, setView] = useState('NOTES'); // NOTES, ARCHIVE, TRASH
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [labels, setLabels] = useState([]); // Initial labels empty
  const [notes, setNotes] = useState([]); // Initial notes empty
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Detectar mudança de tamanho de tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false); // Fechar offcanvas ao entrar em desktop
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedNotes, fetchedLabels] = await Promise.all([
          api.getNotes(),
          api.getLabels()
        ]);
        setNotes(fetchedNotes);
        setLabels(fetchedLabels);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  // Label Management
  const handleAddLabel = async (newLabel) => {
    if (!labels.includes(newLabel)) {
      setIsSaving(true);
      try {
        await api.createLabel(newLabel);
        setLabels([...labels, newLabel]);
      } catch (error) {
        console.error("Error creating label:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleRenameLabel = async (oldLabel, newLabel) => {
    if (labels.includes(newLabel)) {
      alert('Label already exists!');
      return;
    }
    // API doesn't have rename label yet, so we just delete and create new for now or ignore?
    // The implementation plan had PUT /labels/:id but the server implementation skipped it for brevity/simplicity in the first pass
    // I will implement a client-side workaround: Create new, update notes, delete old. 
    // Or better: Just update the UI and TODO server side later? 
    // Let's stick to the server implementation I wrote: POST and DELETE only for labels.
    // I'll update the server to support rename if needed, but for now let's implement the workaround.
    // Actually, I can just not support rename on server yet and warn user, or implement it quickly. 
    // Let's implement the UI update optimistically and maybe log error.
    // Wait, the plan said "Labels CRUD", server has POST/DELETE. 
    // Let's add Rename to server? It's quicker to just use what we have. 
    // I'll try to add Rename support to server next step. For now, let's keep local rename or skip.
    // Let's update the notes locally and on server.
    // For rename:
    try {
      setIsSaving(true);
      // 1. Create new label
      await api.createLabel(newLabel);
      // 2. Update all notes with old label to new label
      const notesToUpdate = notes.filter(n => n.category === oldLabel);
      await Promise.all(notesToUpdate.map(n => api.updateNote({ ...n, category: newLabel })));
      // 3. Delete old label
      await api.deleteLabel(oldLabel);

      setLabels(labels.map(l => l === oldLabel ? newLabel : l));
      setNotes(notes.map(n => n.category === oldLabel ? { ...n, category: newLabel } : n));
    } catch (error) {
      console.error("Error renaming label:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLabel = async (label) => {
    setIsSaving(true);
    try {
      await api.deleteLabel(label);
      setLabels(labels.filter(l => l !== label));
      // Remove category from notes
      const notesToUpdate = notes.filter(n => n.category === label);
      // Optimistically update UI
      setNotes(notes.map(n => n.category === label ? { ...n, category: '' } : n));
      // Update server
      await Promise.all(notesToUpdate.map(n => api.updateNote({ ...n, category: '' })));
    } catch (error) {
      console.error("Error deleting label:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addNote = async (noteParams) => {
    setIsSaving(true);
    try {
      const newNote = await api.createNote({
        title: noteParams.title || '',
        content: noteParams.content || '',
        isArchived: noteParams.isArchived || false,
        isTrashed: noteParams.isTrashed || false,
        color: noteParams.color || '#ffffff',
        backgroundImage: noteParams.backgroundImage || null,
        category: noteParams.category || '',
        images: noteParams.images || []
      });
      setNotes([newNote, ...notes]);
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // ... existing handlers (handleNoteClick, handleCloseModal, etc.) ...
  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
  };

  const handleUpdateNote = async (updatedNote) => {
    setIsSaving(true);
    try {
      await api.updateNote(updatedNote);
      setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const archiveNote = async (id) => {
    setIsSaving(true);
    try {
      const note = notes.find(n => n.id === id);
      const updated = { ...note, isArchived: true, isTrashed: false };
      await api.updateNote(updated);
      setNotes(notes.map(n => n.id === id ? updated : n));
    } catch (error) {
      console.error("Error archiving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const unarchiveNote = async (id) => {
    setIsSaving(true);
    try {
      const note = notes.find(n => n.id === id);
      const updated = { ...note, isArchived: false };
      await api.updateNote(updated);
      setNotes(notes.map(n => n.id === id ? updated : n));
    } catch (error) {
      console.error("Error unarchiving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (id) => {
    setIsSaving(true);
    try {
      const note = notes.find(n => n.id === id);
      const updated = { ...note, isTrashed: true, isArchived: false };
      await api.updateNote(updated);
      setNotes(notes.map(n => n.id === id ? updated : n));
    } catch (error) {
      console.error("Error trashing note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const restoreNote = async (id) => {
    setIsSaving(true);
    try {
      const note = notes.find(n => n.id === id);
      const updated = { ...note, isTrashed: false };
      await api.updateNote(updated);
      setNotes(notes.map(n => n.id === id ? updated : n));
    } catch (error) {
      console.error("Error restoring note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const permanentlyDeleteNote = async (id) => {
    setIsSaving(true);
    try {
      await api.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting note permanently:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const changeNoteColor = async (id, color) => {
    setIsSaving(true);
    try {
      const note = notes.find(n => n.id === id);
      const updated = { ...note, color, backgroundImage: null };
      await api.updateNote(updated);
      setNotes(notes.map(n => n.id === id ? updated : n));
    } catch (error) {
      console.error("Error changing color:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addImageToNote = async (id, imageUrl) => {
    setIsSaving(true);
    try {
      const note = notes.find(n => n.id === id);
      const updated = { ...note, images: [...(note.images || []), imageUrl] };
      await api.updateNote(updated);
      setNotes(notes.map(n => n.id === id ? updated : n));
    } catch (error) {
      console.error("Error adding image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const changeNoteBackground = async (id, backgroundImage) => {
    setIsSaving(true);
    try {
      const note = notes.find(n => n.id === id);
      const updated = { ...note, backgroundImage, color: '#ffffff' };
      await api.updateNote(updated);
      setNotes(notes.map(n => n.id === id ? updated : n));
    } catch (error) {
      console.error("Error changing background:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const changeNoteCategory = async (id, category) => {
    setIsSaving(true);
    try {
      const note = notes.find(n => n.id === id);
      const updated = { ...note, category };
      await api.updateNote(updated);
      setNotes(notes.map(n => n.id === id ? updated : n));
    } catch (error) {
      console.error("Error changing category:", error);
    } finally {
      setIsSaving(false);
    }
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
        return notes.filter(n => n.category === view && !n.isTrashed);
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
      <Header toggleSidebar={toggleSidebar} user={user} onLogout={logout} isSaving={isSaving} />
      <div className="main-container">
        <Sidebar
          isExpanded={isSidebarExpanded}
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeView={view}
          onViewChange={(v) => { handleViewChange(v); if (isMobile) setIsSidebarOpen(false); }}
          labels={labels}
        />
        {/* Overlay para fechar offcanvas ao clicar fora */}
        {isMobile && isSidebarOpen && (
          <div
            className="offcanvas-backdrop fade show"
            onClick={() => setIsSidebarOpen(false)}
            style={{ zIndex: 1039 }}
          />
        )}
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
