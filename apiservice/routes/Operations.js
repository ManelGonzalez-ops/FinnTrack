const express = require("express")
const { getReadyOperations, updatePortfolio, addOperationDB, getPortfolioInitialDate } = require("../controllers/Operations")

const router = express.Router()

router.route("/")
.post(getReadyOperations)

//update or add
router.route("/update")
.post(updatePortfolio)


router.route("/addoperation")
.post(addOperationDB)

router.route("/initial")
.post(getPortfolioInitialDate)

module.exports = router