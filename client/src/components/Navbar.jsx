import React, { useState } from 'react';
import './Navbar.css'; 

function Navbar() {
  const [activeTab, setActiveTab] = useState('Chats');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="navbar">
      <div
        className={`nav-item ${activeTab === 'Chats' ? 'active' : ''}`}
        onClick={() => handleTabClick('Chats')}
      >
        Chats
      </div>
      <div
        className={`nav-item ${activeTab === 'Online' ? 'active' : ''}`}
        onClick={() => handleTabClick('Online')}
      >
        Online
      </div>
      <div
        className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`}
        onClick={() => handleTabClick('Settings')}
      >
        Settings
      </div>
    </div>
  );
}

export default Navbar;