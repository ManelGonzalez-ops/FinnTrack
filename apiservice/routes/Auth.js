const express = require("express")
const { login, protectedRoute, unpackToken, register } = require("../controllers/Auth")
const router = express.Router()

router.route("/login")
    .post(login)

router.use("/post", unpackToken)
router.route("/post")
    .get(protectedRoute)

router.route("/register")
    .post(register)
    

module.exports = router