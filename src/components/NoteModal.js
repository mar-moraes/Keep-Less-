import React, { useState, useEffect, useRef } from 'react';
import './NoteModal.css';

const NoteModal = ({
    note,
    onClose,
    onUpdate,
    onArchive,
    onUnarchive,
    onDelete,
    onColorChange,
    onImageAdd,
    onBackgroundChange
}) => {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [category, setCategory] = useState(note.category || '');
    const [showColorPalette, setShowColorPalette] = useState(false);
    const [paletteTab, setPaletteTab] = useState('COLORS');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);
    const paletteRef = useRef(null);

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

    const backgroundImages = []; // Same placeholder as NoteCard

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Validation (simplified version of NoteCard's)
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!validTypes.includes(file.type)) return alert('Invalid file type.');
        if (file.size > 25 * 1024 * 1024) return alert('File size exceeds 25MB.');

        const reader = new FileReader();
        reader.onload = (event) => {
            // Skip 10MP check for brevity in explanation, but could include
            onImageAdd(note.id, event.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Update local state if note prop changes - Only when ID changes to avoid overwriting typed text on color change
    useEffect(() => {
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category || '');
        setCurrentImageIndex(0);
    }, [note.id]);

    // Close palette when clicking outside
    useEffect(() => {
        const handleClickOutsidePalette = (event) => {
            if (paletteRef.current && !paletteRef.current.contains(event.target)) {
                setShowColorPalette(false);
            }
        };

        if (showColorPalette) {
            document.addEventListener('mousedown', handleClickOutsidePalette);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutsidePalette);
        };
    }, [showColorPalette]);


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
    }, [title, content, category, note]);

    const handleClose = () => {
        onUpdate({ ...note, title, content, category });
        onClose();
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        if (note.images && note.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % note.images.length);
        }
    };

    const handlePrevImage = (e) => {
        e.stopPropagation();
        if (note.images && note.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + note.images.length) % note.images.length);
        }
    };

    return (
        <div className="modal-overlay">
            <div
                className="modal-content"
                ref={modalRef}
                style={{
                    backgroundColor: (note.color && note.color !== '#ffffff') ? note.color : undefined,
                    backgroundImage: note.backgroundImage || 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Attached Images - Single View Carousel */}
                {note.images && note.images.length > 0 && (
                    <div className="modal-images-container" style={{ position: 'relative' }}>
                        <div className="modal-image-wrapper">
                            <img
                                src={note.images[currentImageIndex]}
                                alt={`attachment ${currentImageIndex + 1}`}
                                className="modal-image-attachment"
                            />
                        </div>

                        {note.images.length > 1 && (
                            <>
                                <button className="image-nav-button prev-button" onClick={handlePrevImage}>
                                    <span className="material-icons">chevron_left</span>
                                </button>
                                <button className="image-nav-button next-button" onClick={handleNextImage}>
                                    <span className="material-icons">chevron_right</span>
                                </button>
                                <div className="image-counter" style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '10px',
                                    background: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    padding: '2px 6px',
                                    borderRadius: '10px',
                                    fontSize: '10px'
                                }}>
                                    {currentImageIndex + 1} / {note.images.length}
                                </div>
                            </>
                        )}
                    </div>
                )}
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
                {category && (
                    <div className="modal-category-chip">
                        {category}
                    </div>
                )}
                <div className="modal-footer">
                    <div className="modal-actions">
                        <button className="icon-button-small" title="Remind me"><span className="material-icons">add_alert</span></button>
                        <button className="icon-button-small" title="Collaborator"><span className="material-icons">person_add</span></button>

                        <div className="color-palette-wrapper">
                            <button className="icon-button-small" title="Change color" onClick={(e) => { e.stopPropagation(); setShowColorPalette(!showColorPalette); }}>
                                <span className="material-icons">palette</span>
                            </button>
                            {showColorPalette && (
                                <div className="color-palette" ref={paletteRef} onClick={(e) => e.stopPropagation()}>
                                    <div className="palette-tabs">
                                        <button
                                            className={`palette-tab ${paletteTab === 'COLORS' ? 'active' : ''}`}
                                            onClick={() => setPaletteTab('COLORS')}
                                        >Color</button>
                                        <button
                                            className={`palette-tab ${paletteTab === 'IMAGES' ? 'active' : ''}`}
                                            onClick={() => setPaletteTab('IMAGES')}
                                        >Image</button>
                                    </div>
                                    <div className="palette-options">
                                        {paletteTab === 'COLORS' && colors.map(color => (
                                            <div
                                                key={color}
                                                className="color-option"
                                                style={{ backgroundColor: color }}
                                                onClick={() => {
                                                    onColorChange(note.id, color);
                                                    // setShowColorPalette(false); // Remove to persist
                                                }}
                                            />
                                        ))}
                                        {paletteTab === 'IMAGES' && (
                                            <>
                                                <div
                                                    className="color-option no-image-option"
                                                    title="No Background"
                                                    onClick={() => {
                                                        onBackgroundChange(note.id, null);
                                                        // setShowColorPalette(false);
                                                    }}
                                                >
                                                    <span className="material-icons">block</span>
                                                </div>
                                                {backgroundImages.map((bg, index) => (
                                                    <div
                                                        key={index}
                                                        className="color-option image-option"
                                                        style={{ backgroundImage: bg }}
                                                        onClick={() => {
                                                            onBackgroundChange(note.id, bg);
                                                            // setShowColorPalette(false);
                                                        }}
                                                    />
                                                ))}
                                                {backgroundImages.length === 0 && <div style={{ padding: '5px', fontSize: '12px', color: '#666' }}>No images yet</div>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="icon-button-small" title="Add image" onClick={() => fileInputRef.current.click()}>
                            <span className="material-icons">image</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/jpeg, image/png, image/gif"
                            onChange={handleFileChange}
                        />

                        {note.isArchived ? (
                            <button className="icon-button-small" title="Unarchive" onClick={() => { onUnarchive(note.id); onClose(); }}>
                                <span className="material-icons">unarchive</span>
                            </button>
                        ) : (
                            <button className="icon-button-small" title="Archive" onClick={() => { onArchive(note.id); onClose(); }}>
                                <span className="material-icons">archive</span>
                            </button>
                        )}

                        <button className="icon-button-small" title="Delete" onClick={() => { onDelete(note.id); onClose(); }}>
                            <span className="material-icons">delete</span>
                        </button>

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
