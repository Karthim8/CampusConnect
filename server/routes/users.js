const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { fetchLeetCodeStats, fetchCodeforcesStats } = require('../services/statsService');

// @route   GET api/users/profile
// @desc    Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/profile
// @desc    Update user profile
router.put('/profile', auth, async (req, res) => {
    const { details, professionalLinks, codingProfiles, careerStatus } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (details) user.details = { ...user.details, ...details };
        if (professionalLinks) user.professionalLinks = { ...user.professionalLinks, ...professionalLinks };
        if (codingProfiles) user.codingProfiles = { ...user.codingProfiles, ...codingProfiles };
        if (careerStatus) user.careerStatus = { ...user.careerStatus, ...careerStatus };

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users/refresh-stats
// @desc    Refresh coding stats
router.post('/refresh-stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (user.codingProfiles.leetcode) {
            const lcStats = await fetchLeetCodeStats(user.codingProfiles.leetcode);
            if (lcStats) user.codingStats.leetcode = lcStats;
        }

        if (user.codingProfiles.codeforces) {
            const cfStats = await fetchCodeforcesStats(user.codingProfiles.codeforces);
            if (cfStats) user.codingStats.codeforces = cfStats;
        }

        await user.save();
        res.json(user.codingStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
