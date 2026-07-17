import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PublicRoute({ children }) {
  const { user } = useAuth();

  console.log('PublicRoute user:', user);

  if (!user) {
    return children;
  }

  const role = (user.roleName || user.role || '').toUpperCase();

  const redirectMap = {
    ADMIN: '/admin/dashboard',
    STAFF: '/staff/tables',
    KITCHEN: '/kitchen/queue',
    CUSTOMER: '/customer/menu'
  };

  return <Navigate to={redirectMap[role] || '/customer/menu'} replace />;
}

export default PublicRoute;