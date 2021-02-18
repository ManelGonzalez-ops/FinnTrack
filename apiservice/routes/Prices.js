const express = require("express")
const { getTickerPrices, pruebaPort} = require("../controllers/Prices")

const router = express.Router()


router.route("/portfolio_prices")
.post(getTickerPrices)

router.route("/prueba")
.post(pruebaPort)
module.exports = router