const express = require("express")
const { login, protectedRoute, unpackToken } = require("../controllers/Auth")
const router = express.Router()

router.route("/login")
.post(login)

router.use("/post", unpackToken)
router.route("/post")
    .get(protectedRoute)

module.exports = router