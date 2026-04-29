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

  const isAdminAuth = localStorage.getItem('tokcer_admin_auth') === 'true';
  const isPathAdmin = window.location.pathname.startsWith('/admin');

  // ONLY redirect to admin-login if user is trying to access /admin and is not authenticated as admin
  if (isPathAdmin && !session && !isAdminAuth) {
    return <Navigate to="/admin-login" replace />;
  }

  // Regular users/partners redirect to standard login
  if (!session && !isAdminAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
      <Routes>
        <Route path="/" element={<Landing />} />
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
