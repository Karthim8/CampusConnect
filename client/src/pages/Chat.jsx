import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Send, User as UserIcon, Shield, ShieldOff, Search, Circle } from 'lucide-react';

const Chat = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io(window.location.protocol === 'https:' ? window.location.origin : 'http://localhost:5000');
        setSocket(newSocket);
        newSocket.emit('join', user._id);

        newSocket.on('userStatus', (userIds) => setOnlineUsers(userIds));
        newSocket.on('receiveMessage', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => newSocket.close();
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const msg = {
            senderId: user._id,
            receiverId: selectedUser._id,
            content: newMessage,
            timestamp: new Date()
        };

        socket.emit('sendMessage', msg);
        setMessages(prev => [...prev, msg]);
        setNewMessage('');
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Sidebar - Users List */}
            <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            placeholder="Search students..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-md pl-9 pr-3 py-1.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {onlineUsers.filter(id => id !== user._id).map(id => (
                        <div
                            key={id}
                            onClick={() => setSelectedUser({ _id: id, name: `User ${id.substring(0, 4)}` })}
                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-700 transition-colors ${selectedUser?._id === id ? 'bg-gray-700' : ''}`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center font-bold">
                                    {id.charAt(0).toUpperCase()}
                                </div>
                                <Circle className="absolute bottom-0 right-0 text-green-500 fill-green-500 border-2 border-gray-800" size={10} />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-white truncate">Student {id.substring(0, 4)}</p>
                                <p className="text-xs text-green-500">Online</p>
                            </div>
                        </div>
                    ))}
                    {onlineUsers.length <= 1 && (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            <p>No other students online right now.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold">{selectedUser.name}</h3>
                                    <p className="text-xs text-gray-400">Student Profile</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Block User">
                                    <ShieldOff size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-900">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-lg text-sm ${msg.senderId === user._id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200 border border-gray-700'}`}>
                                        {msg.content}
                                        <p className="text-[10px] mt-1 opacity-50 text-right">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 border-t border-gray-700">
                            <div className="flex gap-4">
                                <input
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                                />
                                <button type="submit" className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <MessageSquare size={64} className="mb-4 opacity-20" />
                        <p className="text-lg">Select a student to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Mock icon because I forgot to import MessageSquare
const MessageSquare = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

export default Chat;
