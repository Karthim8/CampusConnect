import React from 'react';
import { Trophy, Code, Target, Zap } from 'lucide-react';

const StatsCard = ({ platform, stats }) => {
    if (!stats) return null;

    const renderLeetCode = () => (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-yellow-500" />
                <h3 className="text-xl font-bold">LeetCode</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-400 text-sm">Total Solved</p>
                    <p className="text-2xl font-bold text-white">{stats.totalSolved}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-green-500">Easy</span>
                        <span>{stats.easy}</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: `${(stats.easy / stats.totalSolved) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                        <span className="text-yellow-500">Medium</span>
                        <span>{stats.medium}</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full" style={{ width: `${(stats.medium / stats.totalSolved) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                        <span className="text-red-500">Hard</span>
                        <span>{stats.hard}</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full" style={{ width: `${(stats.hard / stats.totalSolved) * 100}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCodeforces = () => (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <Code className="text-blue-500" />
                <h3 className="text-xl font-bold">Codeforces</h3>
            </div>
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-gray-400 text-sm">Rating</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.rating}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 text-sm">Max Rating</p>
                    <p className="text-xl font-semibold text-gray-200">{stats.solvedCount}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-2 text-sm text-gray-400">
                <Zap size={14} className="text-yellow-400" />
                <span>Actively Solving</span>
            </div>
        </div>
    );

    return platform === 'leetcode' ? renderLeetCode() : renderCodeforces();
};

export default StatsCard;
