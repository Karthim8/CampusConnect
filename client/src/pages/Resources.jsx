import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Search, Upload, FileText, Download, Filter } from 'lucide-react';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        department: '',
        semester: '',
        type: ''
    });
    const [showUpload, setShowUpload] = useState(false);
    const [uploadData, setUploadData] = useState({
        title: '',
        description: '',
        department: '',
        semester: '',
        subject: '',
        type: 'Notes',
        fileUrl: ''
    });

    const resourceTypes = ['Notes', 'Question Paper', 'Important Questions', 'Exam Feedback', 'Lab Manual'];

    useEffect(() => {
        fetchResources();
    }, [filters]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/resources?${params.toString()}`);
            setResources(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/resources`, uploadData);
            alert('Resource uploaded successfully!');
            setShowUpload(false);
            fetchResources();
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        }
    };

    return (
        <div className="p-8 text-white min-h-screen bg-gray-900">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <BookOpen className="text-blue-500" /> Academic Resources
                </h1>
                <button
                    onClick={() => setShowUpload(!showUpload)}
                    className="bg-blue-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Upload size={18} /> {showUpload ? 'Cancel' : 'Upload Resource'}
                </button>
            </div>

            {showUpload && (
                <div className="mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Upload New Resource</h2>
                    <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            placeholder="Title"
                            required
                            className="bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500"
                            onChange={e => setUploadData({ ...uploadData, title: e.target.value })}
                        />
                        <input
                            placeholder="Subject"
                            required
                            className="bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500"
                            onChange={e => setUploadData({ ...uploadData, subject: e.target.value })}
                        />
                        <select
                            className="bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500"
                            onChange={e => setUploadData({ ...uploadData, type: e.target.value })}
                        >
                            {resourceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input
                            placeholder="File URL (Temporary)"
                            required
                            className="bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500"
                            onChange={e => setUploadData({ ...uploadData, fileUrl: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            className="md:col-span-2 bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500"
                            onChange={e => setUploadData({ ...uploadData, description: e.target.value })}
                        />
                        <div className="flex gap-4">
                            <input
                                placeholder="Dept (e.g. CSE)"
                                required
                                className="w-full bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500"
                                onChange={e => setUploadData({ ...uploadData, department: e.target.value })}
                            />
                            <input
                                placeholder="Sem (1-8)"
                                type="number"
                                required
                                className="w-full bg-gray-900 border border-gray-700 p-2 rounded outline-none focus:border-blue-500"
                                onChange={e => setUploadData({ ...uploadData, semester: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="md:col-span-2 bg-green-600 py-2 rounded font-bold hover:bg-green-700">Submit Resource</button>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-400">Filters:</span>
                </div>
                <select
                    value={filters.department}
                    onChange={e => setFilters({ ...filters, department: e.target.value })}
                    className="bg-gray-900 border border-gray-700 p-1.5 rounded text-sm outline-none"
                >
                    <option value="">All Departments</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="IT">IT</option>
                </select>
                <select
                    value={filters.semester}
                    onChange={e => setFilters({ ...filters, semester: e.target.value })}
                    className="bg-gray-900 border border-gray-700 p-1.5 rounded text-sm outline-none"
                >
                    <option value="">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                </select>
                <select
                    value={filters.type}
                    onChange={e => setFilters({ ...filters, type: e.target.value })}
                    className="bg-gray-900 border border-gray-700 p-1.5 rounded text-sm outline-none"
                >
                    <option value="">All Types</option>
                    {resourceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center mt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map(res => (
                        <div key={res._id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-500/10 p-2 rounded-lg">
                                    <FileText className="text-blue-500" />
                                </div>
                                <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">{res.type}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-1 truncate">{res.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{res.description || 'No description provided.'}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>By {res.uploadedBy?.name}</span>
                                <span>{res.subject}</span>
                            </div>
                            <a
                                href={res.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-700 py-2 rounded text-sm font-semibold group-hover:bg-blue-600 transition-colors"
                            >
                                <Download size={14} /> View / Download
                            </a>
                        </div>
                    ))}
                    {resources.length === 0 && <p className="col-span-full text-center text-gray-500 mt-10">No resources found for this criteria.</p>}
                </div>
            )}
        </div>
    );
};

export default Resources;
