import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase.js';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PartnerDashboard from './pages/PartnerDashboard.jsx';
import InternalDashboard from './pages/InternalDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import PartnerAgreement from './pages/PartnerAgreement.jsx';

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(prev => {
        if (prev?.access_token !== currentSession?.access_token) {
          return currentSession;
        }
        return prev;
      });
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

  if (!session && !isAdminAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const hostname = window.location.hostname;
  
  // Detect if we are inside an iframe (cloaking)
  const isCloaked = window.self !== window.top;
  
  // If cloaked, we are likely on the staging.tokcer-ai.com landing page
  // If not cloaked, we check the hostname for 'dashboard'
  const isInternalDashboard = !isCloaked && hostname.includes('dashboard');

  useEffect(() => {
    // Single log for confirmation
    console.log("Tokcer AI Staging Active:", hostname);
  }, [hostname]);

  return (
    <Router>
      <Routes>
        {/* Domain-based entry point mapping */}
        <Route path="/" element={isInternalDashboard ? <AdminLogin /> : <Landing />} />
        
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
        {/* Safe redirect: only if path is NOT root */}
        <Route path="*" element={window.location.pathname === '/' ? null : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
