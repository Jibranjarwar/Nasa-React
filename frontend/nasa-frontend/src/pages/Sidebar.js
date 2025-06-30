import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; 

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const handleMouseEnter = () => {
    setIsHovering(true);
    setSidebarOpen(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setSidebarOpen(false);
  };

  return (
    <div 
      className={`sidebar ${sidebarOpen ? 'open' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <span className="arrow-icon">→</span>
      </button>
      {sidebarOpen && (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h3>Space Explorer</h3>
            <div className="cosmic-divider"></div>
          </div>
          <ul>
            <li><Link to="/">☀️ Solar System</Link></li>
            <li><Link to="/apod">📸 APOD</Link></li>
            <li><Link to="/planet-details">🪐 Planets</Link></li>
            <li><Link to="/neo">☄️ Near Earth Objects</Link></li>
            <li><Link to="/mars-rover">🤖 Mars Rover</Link></li>
            <li><Link to="/epic">🌍 EPIC (Earth Views)</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;