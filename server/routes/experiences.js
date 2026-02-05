const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const { auth } = require('../middleware/auth');

// @route   GET api/experiences
// @desc    Get all experiences or filter by company
router.get('/', auth, async (req, res) => {
    const { company } = req.query;
    let query = {};
    if (company) query.companyName = new RegExp(company, 'i');

    try {
        const experiences = await Experience.find(query)
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(experiences);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/experiences
// @desc    Submit a new experience
router.post('/', auth, async (req, res) => {
    const { companyName, role, interviewRounds, preparationStrategy, commonQuestions, outcome, difficulty } = req.body;
    try {
        const newExp = new Experience({
            companyName,
            role,
            interviewRounds,
            preparationStrategy,
            commonQuestions,
            outcome,
            difficulty,
            user: req.user.id
        });
        const experience = await newExp.save();
        res.json(experience);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
