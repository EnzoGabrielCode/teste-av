import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/" />;
  }

  const userRole = user.permissao || user.nivel;
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

export default ProtectedRoute;