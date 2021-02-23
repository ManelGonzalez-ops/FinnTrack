const express = require("express")
const { login, protectedRoute, unpackToken, register,checkCredentials } = require("../controllers/Auth")
const router = express.Router()

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
    

module.exports = router