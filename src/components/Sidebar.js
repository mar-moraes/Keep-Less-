import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isExpanded, isMobile, isOpen, onClose, activeView, onViewChange, labels = [] }) => {
    const mainItems = [
        { icon: 'lightbulb', label: 'Notes', id: 'NOTES' },
        { icon: 'notifications', label: 'Reminders', id: 'REMINDERS' },
    ];

    const labelItems = labels.map(label => ({
        icon: 'label',
        label: label,
        id: label
    }));

    const footerItems = [
        { icon: 'edit', label: 'Edit labels', id: 'LABELS' },
        { icon: 'archive', label: 'Archive', id: 'ARCHIVE' },
        { icon: 'delete', label: 'Trash', id: 'TRASH' },
    ];

    const navItems = [...mainItems, ...labelItems, ...footerItems];

    // Mobile: Offcanvas Bootstrap
    if (isMobile) {
        return (
            <aside
                className={`sidebar-offcanvas offcanvas offcanvas-start ${isOpen ? 'show' : ''}`}
                style={{ visibility: isOpen ? 'visible' : 'hidden' }}
            >
                <div className="offcanvas-header sidebar-offcanvas-header">
                    <span className="logo-text-sidebar">Keep Less</span>
                    <button
                        type="button"
                        className="icon-button"
                        onClick={onClose}
                        aria-label="Fechar menu"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>
                <div className="offcanvas-body p-0">
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
                </div>
            </aside>
        );
    }

    // Desktop: sidebar fixa lateral
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
