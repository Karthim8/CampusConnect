const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resource = require('../models/Resource');
const Announcement = require('../models/Announcement');
const { auth, checkRole } = require('../middleware/auth');

// All routes here are restricted to Admin only
router.use(auth, checkRole(['Admin']));

// @route   GET api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-googleId');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/approve-secretary/:id
// @desc    Approve a Club Secretary
router.put('/approve-secretary/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.role = 'Club Secretary';
        user.isApproved = true;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/resource/:id
// @desc    Moderate (delete) a resource
router.delete('/resource/:id', async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Resource removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/stats
// @desc    Get system-wide stats
router.get('/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const resourceCount = await Resource.countDocuments();
        const announcementCount = await Announcement.countDocuments();
        res.json({ userCount, resourceCount, announcementCount });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
