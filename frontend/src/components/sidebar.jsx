import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

export default function Sidebar({ user, onLogout }) {
  const isAdmin = user?.nivel === 'administrador';
  const isEngenheiro = user?.nivel === 'engenheiro';

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleName = (nivel) => {
    const roles = {
      'administrador': 'Gestor',
      'engenheiro': 'Técnico',
      'operador': 'Assistente'
    };
    return roles[nivel] || nivel;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">✈️</div>
          <div className="logo-text">
            <div className="logo-title">SISTEMA</div>
            <div className="logo-subtitle">Gestão Integrada</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-menu">
        <div className="menu-item">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          >
            <span className="menu-icon">📊</span>
            <span className="menu-text">Painel de Controle</span>
          </NavLink>
        </div>

        {(isAdmin || isEngenheiro) && (
          <div className="menu-item">
            <NavLink
              to="/funcionarios"
              className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
            >
              <span className="menu-icon">👥</span>
              <span className="menu-text">Colaboradores</span>
            </NavLink>
          </div>
        )}

        <div className="menu-item">
          <NavLink
            to="/aeronaves"
            className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          >
            <span className="menu-icon">✈️</span>
            <span className="menu-text">Veículos</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{getInitials(user?.nome)}</div>
          <div className="user-info">
            <div className="user-name">{user?.nome || 'Usuário'}</div>
            <div className="user-role">{getRoleName(user?.nivel)}</div>
          </div>
          <button className="logout-button" onClick={onLogout} title="Sair">
            🚪
          </button>
        </div>
      </div>
    </div>
  );
}
