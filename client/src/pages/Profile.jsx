import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Globe, Github, Linkedin, Save, RefreshCw } from 'lucide-react';

const Profile = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        details: {
            department: '',
            year: '',
            semester: '',
            class: '',
            section: '',
            batchYear: ''
        },
        professionalLinks: {
            github: '',
            linkedin: ''
        },
        codingProfiles: {
            leetcode: '',
            codeforces: '',
            hackerrank: '',
            codechef: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                details: user.details || formData.details,
                professionalLinks: user.professionalLinks || formData.professionalLinks,
                codingProfiles: user.codingProfiles || formData.codingProfiles
            });
        }
    }, [user]);

    const handleChange = (e, section) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, formData);
            // We don't needs to reload as user object in context won't update automatically
            // But we can trigger a reload or just update context manually if we add update function
            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshStats = async () => {
        setRefreshing(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/users/refresh-stats`);
            alert('Stats refreshed! Please reload to see changes.');
        } catch (err) {
            console.error(err);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <User className="text-blue-500" /> Student Profile
                </h1>
                <button
                    onClick={handleRefreshStats}
                    disabled={refreshing}
                    className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    Refresh Stats
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Academic Details */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Globe className="text-green-500" size={20} /> Academic Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Department</label>
                            <input
                                name="department"
                                value={formData.details.department}
                                onChange={(e) => handleChange(e, 'details')}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Year</label>
                            <input
                                name="year"
                                type="number"
                                value={formData.details.year}
                                onChange={(e) => handleChange(e, 'details')}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Semester</label>
                            <input
                                name="semester"
                                type="number"
                                value={formData.details.semester}
                                onChange={(e) => handleChange(e, 'details')}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Links */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Github className="text-purple-500" size={20} /> Professional Links
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <Github className="text-gray-400" />
                            <input
                                placeholder="GitHub Profile URL"
                                name="github"
                                value={formData.professionalLinks.github}
                                onChange={(e) => handleChange(e, 'professionalLinks')}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Linkedin className="text-blue-400" />
                            <input
                                placeholder="LinkedIn Profile URL"
                                name="linkedin"
                                value={formData.professionalLinks.linkedin}
                                onChange={(e) => handleChange(e, 'professionalLinks')}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Coding Profiles */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Target className="text-red-500" size={20} /> Coding Profile Usernames
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">LeetCode Username</label>
                            <input
                                name="leetcode"
                                value={formData.codingProfiles.leetcode}
                                onChange={(e) => handleChange(e, 'codingProfiles')}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Codeforces Username</label>
                            <input
                                name="codeforces"
                                value={formData.codingProfiles.codeforces}
                                onChange={(e) => handleChange(e, 'codingProfiles')}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <Save size={20} />
                    {loading ? 'Saving...' : 'Save Profile Changes'}
                </button>
            </form>
        </div>
    );
};

export default Profile;
