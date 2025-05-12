const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Address = require('../models/Address');
const ContactDetail = require('../models/Contact');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({
            where: { googleId: profile.id },
            include: [Address, ContactDetail]
        });
        if (!user) {
            user = await User.findOne({
                where: { email: profile.emails[0].value },
                include: [Address, ContactDetail]
            });

            if (user && user.authType === 'local') {
                return done(null, false, { message: 'Email already registered with password login' });
            }
        }
        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                authType: 'google'
            });
        }

        return done(null, user);
    } catch (err) {
        console.error('Google OAuth Error:', err);
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
