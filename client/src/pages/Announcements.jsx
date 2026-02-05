import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Plus, Calendar, MapPin, ExternalLink, Filter } from 'lucide-react';

const Announcements = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newAnn, setNewAnn] = useState({
        title: '',
        description: '',
        posterUrl: '',
        registrationLink: '',
        visibility: { department: [], year: [] }
    });

    const canPost = ['Club Secretary', 'Admin'].includes(user?.role);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/announcements`);
            setAnnouncements(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/announcements`, newAnn);
            alert('Announcement posted successfully!');
            setShowAdd(false);
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
            alert('Failed to post announcement');
        }
    };

    return (
        <div className="p-8 text-white min-h-screen bg-gray-900">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Megaphone className="text-yellow-500" /> Campus Announcements
                    </h1>
                    <p className="text-gray-400 mt-1">Stay updated with latest club events and college news</p>
                </div>
                {canPost && (
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="bg-yellow-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-yellow-700 transition-all shadow-lg shadow-yellow-900/20"
                    >
                        <Plus size={20} /> {showAdd ? 'Cancel' : 'Post Announcement'}
                    </button>
                )}
            </div>

            {showAdd && (
                <div className="mb-12 bg-gray-800 p-8 rounded-xl border border-yellow-500/20 shadow-2xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="text-yellow-500" /> Create New Announcement
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400">Event Title</label>
                                <input
                                    required
                                    placeholder="e.g., Annual Tech Symposium 2026"
                                    className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg outline-none focus:border-yellow-500 transition-all"
                                    onChange={e => setNewAnn({ ...newAnn, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400">Poster Image URL</label>
                                <input
                                    placeholder="https://example.com/poster.jpg"
                                    className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg outline-none focus:border-yellow-500 transition-all"
                                    onChange={e => setNewAnn({ ...newAnn, posterUrl: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400">Full Description</label>
                            <textarea
                                required
                                placeholder="What is this event about? Mention details like venue, time, and rules..."
                                className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg h-32 outline-none focus:border-yellow-500 transition-all"
                                onChange={e => setNewAnn({ ...newAnn, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-400">Registration Link</label>
                                <input
                                    placeholder="https://forms.gle/..."
                                    className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg outline-none focus:border-yellow-500 transition-all"
                                    onChange={e => setNewAnn({ ...newAnn, registrationLink: e.target.value })}
                                />
                            </div>
                            <div className="flex items-end">
                                <button type="submit" className="w-full bg-yellow-600 py-3 rounded-lg font-bold text-white hover:bg-yellow-700 transition-all shadow-lg">
                                    Broadcast Announcement
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center mt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {announcements.map(ann => (
                        <div key={ann._id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/30 transition-all flex flex-col md:flex-row shadow-xl">
                            {ann.posterUrl ? (
                                <div className="md:w-48 h-48 md:h-auto overflow-hidden">
                                    <img src={ann.posterUrl} alt={ann.title} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="md:w-48 h-48 md:h-auto bg-gray-700 flex items-center justify-center text-gray-500">
                                    <Megaphone size={48} />
                                </div>
                            )}
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold">{ann.title}</h3>
                                        <span className="text-[10px] bg-yellow-600/20 text-yellow-500 px-2 py-1 rounded-full border border-yellow-500/20 font-bold uppercase tracking-wider">
                                            Event
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                                        {ann.description}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} className="text-blue-500" />
                                            <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <span>By {ann.author?.name}</span>
                                    </div>

                                    {ann.registrationLink && (
                                        <a
                                            href={ann.registrationLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-600 hover:text-white hover:border-yellow-600 transition-all group"
                                        >
                                            Register Now
                                            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                            <Megaphone size={64} className="mx-auto mb-4 opacity-10" />
                            <p className="text-gray-500">No active announcements at the moment.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Announcements;
