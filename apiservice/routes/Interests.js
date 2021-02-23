const express = require("express")
const { addInterest, populate } = require("../controllers/Interests")
const router = express.Router()
//db services come from interests and Additional
router.route("/interests")
.get(addInterest)
router.route("/populate")
.get(populate)

router.route("/userInfo")
.post()
module.exports = router