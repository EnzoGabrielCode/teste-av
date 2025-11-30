import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

import {
  MdDashboard,
  MdGroup,
  MdAirplanemodeActive,
  MdLogout,
  MdAccountCircle 
} from 'react-icons/md';

function Sidebar({ user, onLogout }) {
  const isAdmin = user.nivel === 'administrador';
  const isEngenheiro = user.nivel === 'engenheiro';

  return (
    <aside className="sidebar">
      <div className="sidebar-main-content">

        <h2 className="sidebar-title">
          AERO<span>CODE</span>
        </h2>
        <div className="sidebar-user-info">
          <MdAccountCircle className="user-icon" />
          <span className="user-name">{user?.usuario}</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard">
            <MdDashboard />
            <span user={user}>Dashboard</span>
          </NavLink>

          {(isAdmin || isEngenheiro) && (
            <NavLink to="/funcionarios">
              <MdGroup />
              <span>Funcionários</span>
            </NavLink>
          )}

          <NavLink to="/aeronaves">
            <MdAirplanemodeActive />
            <span>Aeronaves</span>
          </NavLink>

          <button className="nav-logout-btn" onClick={onLogout}>
            <MdLogout />
            <span>Sair</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-footer">
        <p className="user-level">({user?.nivel})</p>
      </div>
    </aside>
  );
}

export default Sidebar;