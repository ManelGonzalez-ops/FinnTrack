const express = require("express")
const { emailValidator, userValidator } = require("../controllers/Validation")
const router = express.Router()

router.route("/email")
.post(emailValidator)

router.route("/users")
.post(userValidator)

module.exports = router