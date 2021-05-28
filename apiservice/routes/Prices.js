const express = require("express");
const {getDateTickerPrice} = require("../controllers/Prices");
const { getAllTickerPrices } = require("../controllers/Prices");
const { getTickerPrices, pruebaPort, getDateRange } = require("../controllers/Prices");

const router = express.Router();

router.route("/portfolio_prices")
  .post(getAllTickerPrices);

router.route("/prueba")
  .post(pruebaPort);

router.route("/ticker/:ticker")
  .get(getTickerPrices);

router.route("/dates")
  .post(getDateRange);

router.route("/")
    .post(getDateTickerPrice)

module.exports = router;
