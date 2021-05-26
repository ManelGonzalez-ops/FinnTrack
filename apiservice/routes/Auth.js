const express = require("express");
const {
    login, protectedRoute, unpackToken, register, checkCredentials, handleSocialLogin, signToken,
} = require("../controllers/Auth");

const router = express.Router();
const passport = require("passport");
const passportConf = require("../passport");
const config = require("../config");

const passportJWT = passport.authenticate("jwt", { session: false });
const passportLocal = passport.authenticate("local", { session: false });

router.route("/login")
    .post(passportLocal, login)

router.use("/post", unpackToken);
router.route("/post")
    .get(protectedRoute);

router.use("/credentials", unpackToken);

router.route("/credentials")
    .post(checkCredentials);
router.route("/register")
    .post(register);

router.route("/oauth/facebook")
    .get(passport.authenticate("facebook", {
        session: false,
        scope:
            ["email",
                // "user_birthday",
                //  'user_gender',
                //  'user_location',
                //  'user_posts',
                //  'user_friends'
            ],
    }));

router.route('/facebook/callback')
    .get(passport.authenticate('facebook', {
        session: false,
        failureRedirect: `${config.FRONTEND_HOST}/error`,
    }), (req, res) => {
        // this is not a normal req, it got added other keys
        // console.log(req, "el bodyy de la sucess callback")
        // console.log(req.session.passport.user, "session passport user")
        // res.cookie("authh", req.session.passport.user)
        // res.cookie("token", req.session.passport.user.jwtToken)
        // console.log(req)
        console.log(req.user, "el userr");
        // console.log(req.session.passport.user, "el user")
        const token = signToken(req.user.idDB);
        res.cookie("token", token);
        return res.redirect(`${config.FRONTEND_HOST}`);
    });

router.route('/oauth/google')
    .get(passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.route("/google/callback")
    .get(passport.authenticate('google', {
        session: false,
        failureRedirect: `${config.FRONTEND_HOST}/error`,
    }),
        (req, res) => {
            console.log(req.user, "el userr");
            // console.log(req.session.passport.user, "el user")
            const token = signToken(req.user.idDB);
            res.cookie("token", token);
            res.redirect(config.FRONTEND_HOST);
        });

router.route("/secret")
    .get(passportJWT, (req, res, next) => {
        res.status(200).send(req.user);
    });

module.exports = router;
