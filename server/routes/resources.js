const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { auth } = require('../middleware/auth');

// @route   GET api/resources
// @desc    Get resources with filters
router.get('/', auth, async (req, res) => {
    const { department, semester, subject, type } = req.query;
    let query = {};
    if (department) query.department = department;
    if (semester) query.semester = semester;
    if (subject) query.subject = subject;
    if (type) query.type = type;

    try {
        const resources = await Resource.find(query).populate('uploadedBy', 'name');
        res.json(resources);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/resources
// @desc    Upload a resource
router.post('/', auth, async (req, res) => {
    const { title, description, department, semester, subject, type, fileUrl } = req.body;
    try {
        const newResource = new Resource({
            title,
            description,
            department,
            semester,
            subject,
            type,
            fileUrl,
            uploadedBy: req.user.id
        });
        const resource = await newResource.save();
        res.json(resource);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
