const express = require("express")
const {addOperationsBulk} = require("../controllers/Operations");
const { getReadyOperations, updatePortfolio, addOperationDB, getPortfolioInitialDate } = require("../controllers/Operations")

const router = express.Router()

router.route("/")
.post(getReadyOperations)

//update or add
router.route("/update")
.post(updatePortfolio)


router.route("/addoperation")
.post(addOperationDB)

router.route("/addoperationsBulk")
    .post(addOperationsBulk)

router.route("/initial")
.post(getPortfolioInitialDate)

module.exports = router