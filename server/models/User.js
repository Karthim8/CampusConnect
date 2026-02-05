const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['Student', 'Club Secretary', 'Admin'],
        default: 'Student'
    },
    details: {
        department: String,
        year: Number,
        semester: Number,
        class: String,
        section: String,
        batchYear: Number
    },
    professionalLinks: {
        github: String,
        linkedin: String
    },
    codingProfiles: {
        leetcode: String,
        hackerrank: String,
        codechef: String,
        codeforces: String
    },
    codingStats: {
        leetcode: {
            totalSolved: Number,
            easy: Number,
            medium: Number,
            hard: Number,
            lastUpdated: Date
        },
        codeforces: {
            rating: Number,
            solvedCount: Number,
            lastUpdated: Date
        }
        // Add more platforms as needed
    },
    careerStatus: {
        isPlaced: { type: Boolean, default: false },
        placedBatch: String,
        company: String,
        year: Number,
        internshipStatus: {
            type: String,
            enum: ['None', 'Ongoing', 'Completed'],
            default: 'None'
        },
        internshipCompany: String,
        internshipDuration: String,
        tags: [String] // e.g., "Open to Internship", "Open to Placement"
    },
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isApproved: {
        type: Boolean,
        default: true // Student profiles usually don't need approval, but Club Secretary might
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
