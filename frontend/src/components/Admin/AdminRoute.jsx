import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #E8E2D9', borderTopColor: '#8B2942', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!user || !user.is_admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
