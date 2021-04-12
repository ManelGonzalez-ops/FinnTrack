const passport = require("passport")
const JwtStrategy = require('passport-jwt').Strategy;
const facebookStrategy = require("passport-facebook")
const { findUserById } = require("../db/services")
const { findUserBySocialId } = require("../db/services/AuthService")

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
    try {
        // Find the user specified in token
        const user = await findUserById(payload.sub);

        // If user doesn't exists, handle it
        if (!user) {
            return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.use('facebook', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
}, (access_token, refresh_token, profile, done) => {

    const user = await findUserBySocialId(profile.id, "facebook")
    if (user) {
        return done(null, user)
    }
    try {
        const newUser = await storeNewUserSocial(profile.id, "facebook", profile.email)
        
        done(null, newUser)
    }
    catch (err) {
        done(error, false)
    }
}))