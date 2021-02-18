const express = require("express")
const { addInterest, populate } = require("../controllers/Users")
const router = express.Router()

router.route("/interests")
.get(addInterest)
router.route("/populate")
.get(populate)


module.exports = router