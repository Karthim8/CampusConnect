import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Search, Plus, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

const Experiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [newExp, setNewExp] = useState({
        companyName: '',
        role: '',
        preparationStrategy: '',
        outcome: 'Selected',
        difficulty: 'Medium',
        interviewRounds: [{ roundName: 'Round 1', description: '' }]
    });

    useEffect(() => {
        fetchExperiences();
    }, [search]);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/experiences?company=${search}`);
            setExperiences(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRound = () => {
        setNewExp({
            ...newExp,
            interviewRounds: [...newExp.interviewRounds, { roundName: `Round ${newExp.interviewRounds.length + 1}`, description: '' }]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/experiences`, newExp);
            alert('Experience submitted successfully!');
            setShowAdd(false);
            fetchExperiences();
        } catch (err) {
            console.error(err);
            alert('Failed to submit experience');
        }
    };

    const getOutcomeColor = (outcome) => {
        switch (outcome) {
            case 'Selected': return 'text-green-500';
            case 'Not Selected': return 'text-red-500';
            default: return 'text-yellow-500';
        }
    };

    return (
        <div className="p-8 text-white min-h-screen bg-gray-900">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Briefcase className="text-blue-500" /> Interview Experiences
                </h1>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="bg-blue-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={18} /> {showAdd ? 'Cancel' : 'Share Experience'}
                </button>
            </div>

            <div className="mb-8 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        placeholder="Search by company name..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 outline-none focus:border-blue-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {showAdd && (
                <div className="mb-12 bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl">
                    <h2 className="text-xl font-semibold mb-6">Submit Your Experience</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                                <input
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500"
                                    onChange={e => setNewExp({ ...newExp, companyName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Role</label>
                                <input
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500"
                                    onChange={e => setNewExp({ ...newExp, role: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Preparation Strategy</label>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 p-2 rounded h-24 outline-none focus:border-blue-500"
                                onChange={e => setNewExp({ ...newExp, preparationStrategy: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Outcome</label>
                                <select
                                    className="w-full bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500"
                                    onChange={e => setNewExp({ ...newExp, outcome: e.target.value })}
                                >
                                    <option value="Selected">Selected</option>
                                    <option value="Not Selected">Not Selected</option>
                                    <option value="Waitlisted">Waitlisted</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                                <select
                                    className="w-full bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500"
                                    onChange={e => setNewExp({ ...newExp, difficulty: e.target.value })}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm text-gray-400">Interview Rounds</label>
                                <button
                                    type="button"
                                    onClick={handleAddRound}
                                    className="text-blue-500 text-sm hover:underline"
                                >
                                    + Add Round
                                </button>
                            </div>
                            {newExp.interviewRounds.map((round, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <input
                                        placeholder="Round Name"
                                        className="w-1/3 bg-gray-900 border border-gray-700 p-2 rounded outline-none"
                                        value={round.roundName}
                                        onChange={e => {
                                            const rounds = [...newExp.interviewRounds];
                                            rounds[idx].roundName = e.target.value;
                                            setNewExp({ ...newExp, interviewRounds: rounds });
                                        }}
                                    />
                                    <input
                                        placeholder="Brief description of the round"
                                        className="flex-1 bg-gray-900 border border-gray-700 p-2 rounded outline-none"
                                        onChange={e => {
                                            const rounds = [...newExp.interviewRounds];
                                            rounds[idx].description = e.target.value;
                                            setNewExp({ ...newExp, interviewRounds: rounds });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="w-full bg-green-600 py-3 rounded font-bold hover:bg-green-700 transition-colors">
                            Submit Feedback
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center mt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {experiences.map(exp => (
                        <div key={exp._id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{exp.companyName}</h3>
                                    <p className="text-blue-400 font-medium">{exp.role}</p>
                                </div>
                                <div className={`flex items-center gap-2 font-bold ${getOutcomeColor(exp.outcome)}`}>
                                    {exp.outcome === 'Selected' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                    {exp.outcome}
                                </div>
                            </div>
                            <p className="text-gray-400 mb-6 italic">"{exp.preparationStrategy || 'No preparation strategy shared.'}"</p>

                            <div className="space-y-4 mb-6">
                                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Interview Flow</h4>
                                <div className="flex flex-wrap gap-4">
                                    {exp.interviewRounds.map((r, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-700 text-sm">
                                            <span className="bg-blue-600 text-xs w-5 h-5 flex items-center justify-center rounded-full text-white">{i + 1}</span>
                                            <span className="text-gray-200">{r.roundName}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-700 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-blue-400 font-bold">
                                        {exp.user?.name?.charAt(0)}
                                    </span>
                                    <span>{exp.user?.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {experiences.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No experiences found. Be the first to share!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Experiences;
