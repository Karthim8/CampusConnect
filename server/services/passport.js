const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;

        // College domain restriction
        // if (!email.endsWith('@college.edu')) {
        //   return done(null, false, { message: 'Only college emails allowed' });
        // }

        try {
            let user = await User.findOne({ googleId: id });
            if (!user) {
                user = await User.create({
                    googleId: id,
                    name: displayName,
                    email: email,
                    role: 'Student'
                });
            }
            return done(null, user);
        } catch (err) {
            console.error(err);
            return done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});
