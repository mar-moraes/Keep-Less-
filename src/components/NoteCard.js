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
    onColorChange,
    onImageAdd,
    onBackgroundChange,
    onCategoryChange
}) => {
    const [showColorPalette, setShowColorPalette] = useState(false);
    const [paletteTab, setPaletteTab] = useState('COLORS'); // COLORS or IMAGES
    const fileInputRef = React.useRef(null);
    const paletteRef = React.useRef(null);

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

    // Placeholder for background images - to be populated later
    const backgroundImages = [
        // 'url("https://www.gstatic.com/keep/backgrounds/grocery_light_thumb_0615.svg")',
        // 'url("https://www.gstatic.com/keep/backgrounds/food_light_thumb_0615.svg")',
        // 'url("https://www.gstatic.com/keep/backgrounds/music_light_thumb_0615.svg")',
        // 'url("https://www.gstatic.com/keep/backgrounds/recipe_light_thumb_0615.svg")',
        // 'url("https://www.gstatic.com/keep/backgrounds/video_light_thumb_0615.svg")',
        // 'url("https://www.gstatic.com/keep/backgrounds/places_light_thumb_0615.svg")',
    ];

    // Close palette when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (paletteRef.current && !paletteRef.current.contains(event.target)) {
                setShowColorPalette(false);
            }
        };

        if (showColorPalette) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPalette]);

    const handleAction = (e, action) => {
        e.stopPropagation();
        action();
    };

    const togglePalette = (e) => {
        e.stopPropagation();
        setShowColorPalette(!showColorPalette);
    };

    const handleImageClick = (e) => {
        e.stopPropagation();
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Please select a JPEG, PNG, or GIF.');
            return;
        }

        if (file.size > 25 * 1024 * 1024) { // 25MB
            alert('File size exceeds 25MB limit.');
            return;
        }

        // 10MP Check (Approximate via file size not perfect, but we can check dimensions after load)
        // For strict 10MP check, we'd need to load into an Image object.
        // For this task, we'll proceed assuming the file is acceptable or checking dimensions async.

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const megaPixels = (img.width * img.height) / 1000000;
                if (megaPixels > 10) {
                    alert('Image resolution exceeds 10 Megapixels.');
                    return;
                }
                // Valid
                onImageAdd(note.id, event.target.result);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div
            className="note-card"
            onClick={() => onClick(note)}
            style={{
                backgroundColor: (note.color && note.color !== '#ffffff') ? note.color : undefined,
                backgroundImage: note.backgroundImage || 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg, image/png, image/gif"
                onChange={handleFileChange}
                onClick={(e) => e.stopPropagation()} // Stop click on input from bubbling to card
            />

            {/* Attached Images */}
            {note.images && note.images.length > 0 && (
                <div className="note-images">
                    {note.images.map((img, index) => (
                        <img key={index} src={img} alt="attachment" className="note-image-attachment" />
                    ))}
                </div>
            )}

            <div className="note-card-content-wrapper">
                {note.title && <div className="note-title">{note.title}</div>}
                <div className="note-content">{note.content}</div>
                {note.category && (
                    <div className="note-category-chip">
                        {note.category}
                    </div>
                )}
            </div>

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
                                                    // setShowColorPalette(false); // Kept open as requested
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
                                                {/* Placeholder message if empty */}
                                                {backgroundImages.length === 0 && <div style={{ padding: '5px', fontSize: '12px', color: '#666' }}>No images yet</div>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="icon-button-small" title="Add image" onClick={handleImageClick}>
                            <span className="material-icons">image</span>
                        </button>

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
