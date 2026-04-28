import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import InternalDashboard from './pages/InternalDashboard';
import AdminLogin from './pages/AdminLogin';
import PartnerAgreement from './pages/PartnerAgreement';

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAdmin = localStorage.getItem('tokcer_admin_auth') === 'true';
  const isPathAdmin = window.location.pathname.startsWith('/admin');

  if (!session && !isAdmin) {
    return <Navigate to={isPathAdmin ? "/admin-login" : "/login"} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/partner-agreement" element={<PartnerAgreement />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/partner-dashboard" 
          element={
            <ProtectedRoute>
              <PartnerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <InternalDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
