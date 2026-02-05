const axios = require('axios');

const fetchLeetCodeStats = async (username) => {
    try {
        const response = await axios.get(`https://leetcode-api-pied.vercel.app/user/${username}`);
        const data = response.data;
        return {
            totalSolved: data.totalSolved,
            easy: data.easySolved,
            medium: data.mediumSolved,
            hard: data.hardSolved,
            lastUpdated: new Date()
        };
    } catch (error) {
        console.error(`Error fetching LeetCode stats for ${username}:`, error.message);
        return null;
    }
};

const fetchCodeforcesStats = async (username) => {
    try {
        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
        if (response.data.status === 'OK') {
            const data = response.data.result[0];
            return {
                rating: data.rating || 0,
                solvedCount: data.maxRating || 0, // Placeholder for solved count if not directly in user.info
                lastUpdated: new Date()
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching Codeforces stats for ${username}:`, error.message);
        return null;
    }
};

module.exports = {
    fetchLeetCodeStats,
    fetchCodeforcesStats
};
