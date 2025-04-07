const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');

const app = express();

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/google/callbacks',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/google/failure'
    })
);

app.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
});

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.send('Goodbye!');
        });
    });
});

app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate.');
});

app.listen(5000, () => console.log('Listening on port 5000'));
