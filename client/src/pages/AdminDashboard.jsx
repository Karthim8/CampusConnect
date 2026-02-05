import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, FileText, Trash2, Check, UserCheck, BarChart3, Settings } from 'lucide-react';

const AdminDashboard = () => {
    const { user: currentUser } = useAuth();
    const [stats, setStats] = useState({ userCount: 0, resourceCount: 0, announcementCount: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats');

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`),
                axios.get(`${import.meta.env.VITE_API_URL}/admin/users`)
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveSecretary = async (userId) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/approve-secretary/${userId}`);
            alert('User promoted to Club Secretary!');
            fetchAdminData();
        } catch (err) {
            alert('Failed to approve');
        }
    };

    if (!currentUser || currentUser.role !== 'Admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
                <Shield size={64} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-gray-400">Administrators only area.</p>
            </div>
        );
    }

    return (
        <div className="p-8 text-white min-h-screen bg-gray-900">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Shield className="text-red-500" /> Admin Control Center
                    </h1>
                    <p className="text-gray-400">Manage CampusConnect users and content</p>
                </div>
                <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'stats' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'users' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        User Management
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center mt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
            ) : activeTab === 'stats' ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl relative overflow-hidden group">
                            <Users className="absolute -right-4 -bottom-4 text-gray-700 opacity-20 group-hover:scale-110 transition-transform" size={120} />
                            <div className="relative z-10">
                                <p className="text-gray-400 font-medium mb-1">Total Users</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-bold">{stats.userCount}</h3>
                                    <span className="text-green-500 text-sm font-bold flex items-center gap-1">+12% <BarChart3 size={14} /></span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl relative overflow-hidden group">
                            <FileText className="absolute -right-4 -bottom-4 text-gray-700 opacity-20 group-hover:scale-110 transition-transform" size={120} />
                            <div className="relative z-10">
                                <p className="text-gray-400 font-medium mb-1">Total Resources</p>
                                <h3 className="text-4xl font-bold">{stats.resourceCount}</h3>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl relative overflow-hidden group">
                            <BarChart3 className="absolute -right-4 -bottom-4 text-gray-700 opacity-20 group-hover:scale-110 transition-transform" size={120} />
                            <div className="relative z-10">
                                <p className="text-gray-400 font-medium mb-1">Announcements</p>
                                <h3 className="text-4xl font-bold">{stats.announcementCount}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Settings size={20} className="text-gray-400" /> Platform Configuration
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                                <p className="font-bold mb-2">College Domain Restriction</p>
                                <p className="text-gray-500 mb-4">Current: Active (@college.edu)</p>
                                <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600">Configure</button>
                            </div>
                            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                                <p className="font-bold mb-2">Maintenance Mode</p>
                                <p className="text-gray-500 mb-4">Current: Inactive</p>
                                <button className="bg-red-900/20 text-red-500 border border-red-500/20 px-4 py-2 rounded hover:bg-red-900/40">Activate</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-900 border-b border-gray-700 text-gray-400 text-sm font-semibold">
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center font-bold text-xs">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{u.name}</p>
                                                    <p className="text-xs text-gray-500">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'Admin' ? 'bg-red-500/10 text-red-500' : u.role === 'Club Secretary' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                {u.isApproved ? <Check size={14} className="text-green-500" /> : <Clock size={14} className="text-yellow-500" />}
                                                {u.isApproved ? 'Verified' : 'Pending Verification'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {u.role === 'Student' && (
                                                <button
                                                    onClick={() => handleApproveSecretary(u._id)}
                                                    className="text-xs bg-blue-600/10 text-blue-500 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1 ml-auto"
                                                >
                                                    <UserCheck size={14} /> Promote to Secretary
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple Clock mock since I didn't import Clock
const Clock = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

export default AdminDashboard;
