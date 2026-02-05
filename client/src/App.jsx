import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AuthSuccess from './pages/AuthSuccess';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import Experiences from './pages/Experiences';
import Chat from './pages/Chat';
import Announcements from './pages/Announcements';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return token ? children : <Navigate to="/login" />;
};

import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { User as UserIcon, LogOut, Settings, BookOpen, Briefcase, MessageSquare, Megaphone, Shield } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-8 text-white min-h-screen bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">CampusConnect</h1>
          <p className="text-gray-400">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-4">
          <Link to="/resources" className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded border border-gray-700 hover:bg-gray-700">
            <BookOpen size={18} /> Resources
          </Link>
          <Link to="/experiences" className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded border border-gray-700 hover:bg-gray-700">
            <Briefcase size={18} /> Feedback
          </Link>
          <Link to="/chat" className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded border border-gray-700 hover:bg-gray-700">
            <MessageSquare size={18} /> Chat
          </Link>
          <Link to="/announcements" className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded border border-gray-700 hover:bg-gray-700">
            <Megaphone size={18} /> News
          </Link>
          {user?.role === 'Admin' && (
            <Link to="/admin" className="flex items-center gap-2 bg-red-900/20 text-red-500 px-4 py-2 rounded border border-red-500/50 hover:bg-red-600 hover:text-white transition-all">
              <Shield size={18} /> Admin
            </Link>
          )}
          <Link to="/profile" className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded border border-gray-700 hover:bg-gray-700">
            <Settings size={18} /> Profile
          </Link>
          <button onClick={logout} className="flex items-center gap-2 bg-red-600/20 text-red-500 px-4 py-2 rounded border border-red-500/50 hover:bg-red-600 hover:text-white transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <StatsCard platform="leetcode" stats={user?.codingStats?.leetcode} />
        <StatsCard platform="codeforces" stats={user?.codingStats?.codeforces} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 mb-2">Club Events</h3>
          <Link to="/announcements" className="text-blue-400 hover:underline flex items-center gap-1">View News <Megaphone size={14} /></Link>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col justify-between">
          <div>
            <h3 className="text-gray-400 mb-2">Company Feedback</h3>
            <Link to="/experiences" className="text-blue-400 hover:underline flex items-center gap-1">Interview Prep <Briefcase size={14} /></Link>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 mb-2">Academic Resources</h3>
          <Link to="/resources" className="text-blue-400 hover:underline flex items-center gap-1">Browse Notes <BookOpen size={14} /></Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
