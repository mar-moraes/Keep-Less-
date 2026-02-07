import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isExpanded, activeView, onViewChange, labels = [] }) => {
    const mainItems = [
        { icon: 'lightbulb', label: 'Notes', id: 'NOTES' },
        { icon: 'notifications', label: 'Reminders', id: 'REMINDERS' },
    ];

    const labelItems = labels.map(label => ({
        icon: 'label', // Material icon name for label tag
        label: label,
        id: label
    }));

    const footerItems = [
        { icon: 'edit', label: 'Edit labels', id: 'LABELS' },
        { icon: 'archive', label: 'Archive', id: 'ARCHIVE' },
        { icon: 'delete', label: 'Trash', id: 'TRASH' },
    ];

    const navItems = [...mainItems, ...labelItems, ...footerItems];

    return (
        <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-nav">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        title={item.label}
                        onClick={() => onViewChange && onViewChange(item.id)}
                    >
                        <span className="material-icons">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
