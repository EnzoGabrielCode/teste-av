import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeLayout from './components/homeLayout';
import Dashboard from './components/Dashboard';
import Funcionario from './components/funcionario';
import Aeronaves from './components/aeronaves';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute'; 
import DetalheAeronave from './components/detalheAeronave';

const ROLES = {
  ADMIN: 'administrador',
  ENGENHEIRO: 'engenheiro',
  OPERADOR: 'operador',
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('aerocodeUser');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('aerocodeUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('aerocodeUser');
    }
  }, [user]);

  const handleLogin = (userData) => {
    console.log('Login userData:', userData);
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aerocodeUser');
  };

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        ) : (
          <Route
            path="/"
            element={<HomeLayout user={user} onLogout={handleLogout} />}
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute user={user} allowedRoles={[ROLES.ADMIN, ROLES.ENGENHEIRO, ROLES.OPERADOR]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="funcionarios"
              element={
                <ProtectedRoute user={user} allowedRoles={[ROLES.ADMIN, ROLES.ENGENHEIRO]}>
                  <Funcionario user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="aeronaves"
              element={
                <ProtectedRoute user={user} allowedRoles={[ROLES.ADMIN, ROLES.ENGENHEIRO, ROLES.OPERADOR]}>
                  <Aeronaves user={user} />
                </ProtectedRoute>
              }
            />
            <Route path="aeronaves/:codigo" element={<DetalheAeronave user={user} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
