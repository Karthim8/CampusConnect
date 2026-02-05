const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { auth, checkRole } = require('../middleware/auth');

// @route   GET api/announcements
// @desc    Get announcements (visible to all students)
router.get('/', auth, async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate('author', 'name')
            .sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/announcements
// @desc    Post a new announcement (Club Secretary or Admin only)
router.post('/', auth, checkRole(['Club Secretary', 'Admin']), async (req, res) => {
    const { title, description, posterUrl, registrationLink, visibility } = req.body;
    try {
        const newAnn = new Announcement({
            title,
            description,
            posterUrl,
            registrationLink,
            visibility,
            author: req.user.id
        });
        const announcement = await newAnn.save();
        res.json(announcement);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
