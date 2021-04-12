const express = require("express")
const { login, protectedRoute, unpackToken, register, checkCredentials } = require("../controllers/Auth")
const router = express.Router()
const passport = require("passport")
const passportConf = require("../passport")

router.route("/login")
    .post(login)

router.use("/post", unpackToken)
router.route("/post")
    .get(protectedRoute)

router.use("/credentials", unpackToken)

router.route("/credentials")
    .post(checkCredentials)
router.route("/register")
    .post(register)

router.route("/oauth/facebook", passport.authenticate("facebook"), )


module.exports = router