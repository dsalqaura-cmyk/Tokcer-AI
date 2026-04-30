import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';

// Components
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import InternalDashboard from './pages/InternalDashboard';
import PartnerAgreement from './pages/PartnerAgreement';

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const getAdminAuth = () => {
    try {
      return localStorage.getItem('tokcer_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  };

  const isAdminAuth = getAdminAuth();
  const isPathAdmin = window.location.pathname.startsWith('/admin');

  if (isPathAdmin && !session && !isAdminAuth) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isPathAdmin && !session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const hostname = window.location.hostname;
  
  // Resilient detection for cloaked/direct access
  const getIsInternal = () => {
    try {
      // If we are on a dashboard domain AND NOT in an iframe, it is Internal
      return hostname.includes('dashboard') && (window.self === window.top);
    } catch (e) {
      // If window access is blocked (cross-origin iframe), it is definitely NOT internal dashboard
      return false;
    }
  };
  
  const isInternal = getIsInternal();

  return (
    <Router>
      <Routes>
        <Route path="/" element={isInternal ? <AdminLogin /> : <Landing />} />
        
        <Route path="/admin" element={<ProtectedRoute><InternalDashboard /></ProtectedRoute>} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
