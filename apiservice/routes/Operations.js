const express = require("express")
const { getReadyOperations, updatePortfolio, addOperationDB } = require("../controllers/Operations")

const router = express.Router()

router.route("/")
.post(getReadyOperations)

//update or add
router.route("/update")
.post(updatePortfolio)


router.route("/addoperation")
.post(addOperationDB)

module.exports = router