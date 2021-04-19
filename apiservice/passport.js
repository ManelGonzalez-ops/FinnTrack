const passport = require("passport")
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt')
const facebookStrategy = require("passport-facebook")
const LocalStrategy = require("passport-local").Strategy
const { findUserById } = require("../db/services")
const { findUserBySocialId, storeNewUserSocial, getUser } = require("../db/services/AuthService")
const config = require("./config")
const { comparePassword } = require("./controllers/Auth")
const { userDetailsFactory, getBirthday } = require("./factories")
const { addContactInfo, uploadImage } = require("../db/services/UserService")
//this is for authorization

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
    try {
        console.log(payload, "jwt payload")
        // Find the user specified in token
        const user = await findUserById(payload.sub);

        // If user doesn't exists, handle it
        if (!user) {
            return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);
    } catch (error) {
        console.log(err.message, "errorr")
        done(error, false);
    }
}));


//this is for authentication
passport.use('facebook', new facebookStrategy({
    clientID: config.facebook.CLIENT_ID,
    clientSecret: config.facebook.CLIENT_SECRET,
    callbackURL: '/api/v1/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'name', 'picture.type(large)', 'birthday', 'gender', 'location'],
}, async (access_token, refresh_token, profile, done) => {

    console.log(profile, "peeerfil")
    const user = await findUserBySocialId(profile.id, "facebook")
    console.log(user, "theuser")
    if (user) {
        const idDB = user.userId
        //normalize req fields between register and login cases
        console.log(profile._json.picture.data, "iiimagen")


        return done(null, { ...user, idDB })
    }

    try {
        const email = profile.emails[0].value
        const username = profile.displayName
        const userOkPacket = await storeNewUserSocial(profile.id, "facebook", email, username)
        const userDetails = userDetailsFactory({
            dateBirth: getBirthday(profile),
            gender: profile._json.gender,
            firstName: profile._json.first_name,
            lastName: profile._json.last_name,
            image: profile.photos[0].value,
            country: profile._json.location.name.split(",")[1].trim()
        })
        console.log(userDetails, "userDetails")
        const userId = userOkPacket.insertId
        await addContactInfo(userId, userDetails)
        const newUser = { ...profile, idDB: userId }
        done(null, newUser)
    }

    catch (error) {
        done(error, false)
    }
}))

passport.use(new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {

        try {
            const user = await getUser(email)
            if (!user) {
                return done("user doesn't exist", false)
            }

            const isMatch = await comparePassword(password, user.hashedPwd)
            console.log(isMatch, "match")
            if (!isMatch) {
                //we generate a token
                //we don't really need to sign the username
                return done("incorrect password", false)
            }

            done(false, user)
        }
        catch (err) {
            done(err, false)
        }

    }))
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


