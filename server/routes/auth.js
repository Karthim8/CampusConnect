const { auth } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/auth/google
// @desc    Authenticate with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET api/auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const payload = {
            user: {
                id: req.user.id,
                role: req.user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                // Redirect to frontend with token
                res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
            }
        );
    }
);

// @route   GET api/auth/me
// @desc    Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-googleId');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
