import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import '../styles/HomeLayout.css';

function HomeLayout({ user, onLogout }) {
  return (
    <div className="home-layout">
      <div className="sidebar-section">
        <Sidebar user={user} onLogout={onLogout} />
      </div>
      <div className="main-content-area">
        <div className="content-wrapper">
          <div className="page-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeLayout;
