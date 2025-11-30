import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import '../styles/HomeLayout.css';

function HomeLayout({ user, onLogout }) {
  return (
    <div className="home-layout">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="home-content" user={user}>
        <Outlet />
      </main>
    </div>
  );
}

export default HomeLayout;
