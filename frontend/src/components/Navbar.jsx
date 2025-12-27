import React, { useEffect, useState } from "react";

import { NavLink, Link } from "react-router-dom";
export default function Navbar() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('site-theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    const onChange = () => setTheme(localStorage.getItem('site-theme') || 'light');
    window.addEventListener('site-theme-changed', onChange);
    return () => window.removeEventListener('site-theme-changed', onChange);
  }, []);

  const handleToggle = () => {
    if (window && window.toggleTheme) window.toggleTheme();
  };

  return (
    <header>
      <div className="container" style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <img src="/logo192.png" alt="logo" style={{ width: 44, height: 44, borderRadius: 8 }} />
          <h1 style={{ margin: 0, fontSize: 20, color: "var(--primary)" }}>Image Uploader</h1>
        </Link>
        <nav style={{ marginLeft: "auto", display: 'flex', gap: 12, alignItems: 'center' }}>
          <NavLink to="/" end className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Home</NavLink>
          <NavLink to="/add" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Add Post</NavLink>
          <button
            title="Toggle theme"
            onClick={handleToggle}
            style={{ marginLeft: 12, padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
    </header>
  );
}
