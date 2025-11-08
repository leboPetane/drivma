import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const Navigation = ({ driving_school, logout }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Get current path for active state
    const getCurrentPath = () => {
        const path = location.pathname;
        return path === '/' ? '/' : path.substring(1);
    };

    const [currentPath, setCurrentPath] = useState(getCurrentPath());

    useEffect(() => {
        setCurrentPath(getCurrentPath());
        // Close mobile menu when route changes
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavClick = (path) => {
        setCurrentPath(path);
        setIsMobileMenuOpen(false);
    };

    const navItems = [
        { path: '/', label: 'Instructors', icon: '👥' },
        { path: '/schedule', label: 'Schedule', icon: '📅' },
        { path: '/cars', label: 'Cars', icon: '🚗' },
        { path: '/students', label: 'Students', icon: '👤' }
    ];

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={handleMobileMenuToggle}
            />

            {/* Sidebar Navigation */}
            <div className={`sidebar ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        🚗
                    </div>
                    DRIVMA
                </div>

                <div className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${currentPath === (item.path === '/' ? '/' : item.path.substring(1)) ? 'active' : ''}`}
                            onClick={() => handleNavClick(item.path === '/' ? '/' : item.path.substring(1))}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Logout Button */}
                <div className="sidebar-nav" style={{ marginTop: 'auto' }}>
                    <button
                        className="btn btn-danger w-full"
                        onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                {/* Top Header */}
                <div className="content-header">
                    <div className="d-flex align-center">
                        {/* Mobile Menu Toggle */}
                        <button
                            className="nav-toggle"
                            onClick={handleMobileMenuToggle}
                            aria-label="Toggle navigation"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 12h18M3 6h18M3 18h18"/>
                            </svg>
                        </button>

                        {/* Driving School Name */}
                        <div className="d-flex align-center gap-2">
                            <span style={{ color: 'var(--color-success)', fontSize: '10px' }}>●</span>
                            <h2 className="mb-0">{driving_school}</h2>
                        </div>
                    </div>

                    {/* Desktop-only content */}
                    <div className="desktop-only">
                        <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
                            Management Dashboard
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};
