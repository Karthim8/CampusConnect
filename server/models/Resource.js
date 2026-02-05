const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    department: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Notes', 'Question Paper', 'Important Questions', 'Exam Feedback', 'Lab Manual'],
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
