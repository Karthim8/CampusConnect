const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

const passport = require('passport');
require('./services/passport');

// Load environment variables
dotenv.config();

const app = express();
const server = require('http').createServer(app);
const io = require('./socket')(server);
const PORT = process.env.PORT || 5000;

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/admin', require('./routes/admin'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to CampusConnect API' });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
