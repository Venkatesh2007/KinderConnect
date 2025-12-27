import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Upload, FileText } from 'lucide-react';

const Layout = () => {
    return (
        <div style={{ paddingBottom: '80px' }}>
            <nav className="nav-bar">
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Home size={28} />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/upload" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Upload size={28} />
                    <span>Upload</span>
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <FileText size={28} />
                    <span>Reports</span>
                </NavLink>
            </nav>
            <main className="container">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
