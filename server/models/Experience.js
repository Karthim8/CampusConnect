const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        index: true
    },
    role: {
        type: String,
        required: true
    },
    interviewRounds: [{
        roundName: String,
        description: String
    }],
    preparationStrategy: String,
    commonQuestions: [String],
    outcome: {
        type: String,
        enum: ['Selected', 'Not Selected', 'Waitlisted', 'Pending'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);
