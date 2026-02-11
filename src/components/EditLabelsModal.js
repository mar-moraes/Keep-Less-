import React, { useState, useEffect, useRef } from 'react';
import './EditLabelsModal.css';

const EditLabelsModal = ({ labels, onAdd, onRename, onDelete, onClose }) => {
    const [newLabel, setNewLabel] = useState('');
    const [editingLabel, setEditingLabel] = useState(null); // The label currently being renamed
    const [editValue, setEditValue] = useState(''); // The new name for the label being edited
    const inputRef = useRef(null);

    // ... existing handleAdd, handleKeyDown ...
    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleAdd = () => {
        if (newLabel.trim()) {
            onAdd(newLabel.trim());
            setNewLabel('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    const startEditing = (label) => {
        setEditingLabel(label);
        setEditValue(label);
    };

    const saveEdit = () => {
        if (editingLabel && editValue.trim() && editValue !== editingLabel) {
            onRename(editingLabel, editValue.trim());
        }
        setEditingLabel(null);
        setEditValue('');
    };

    const handleEditKeyDown = (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="edit-labels-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit labels</h3>
                </div>

                <div className="modal-body">
                    {/* Add New Label */}
                    <div className="label-row new-label-row">
                        <span className="material-icons start-icon" onClick={() => setNewLabel('')}>
                            {newLabel ? 'close' : 'add'}
                        </span>
                        {/* ... input ... */}
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Create new label"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <span
                            className={`material-icons end-icon ${newLabel.trim() ? 'active' : ''}`}
                            onClick={handleAdd}
                            title="Create label"
                        >
                            check
                        </span>
                    </div>

                    {/* List of Existing Labels */}
                    <div className="labels-list">
                        {labels.map((label) => (
                            <div key={label} className="label-row">
                                {editingLabel === label ? (
                                    <>
                                        <span className="material-icons start-icon" onClick={() => onDelete(label)}>delete</span>
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onBlur={saveEdit}
                                            onKeyDown={handleEditKeyDown}
                                            autoFocus
                                        />
                                        <span className="material-icons end-icon active" onClick={saveEdit}>check</span>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className="icon-wrapper"
                                            onClick={() => onDelete(label)}
                                            title="Delete label"
                                        >
                                            <span className="material-icons start-icon default-icon">label</span>
                                            <span className="material-icons start-icon hover-icon">delete</span>
                                        </div>
                                        <span className="label-text" onClick={() => startEditing(label)}>
                                            {label}
                                        </span>
                                        <span className="material-icons end-icon" onClick={() => startEditing(label)}>
                                            edit
                                        </span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* ... footer ... */}
                <div className="modal-footer">
                    <button className="done-button" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
};

export default EditLabelsModal;
