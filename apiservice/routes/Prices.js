const express = require("express");
const { getAllTickerPrices } = require("../controllers/Prices");
const { getTickerPrices, pruebaPort } = require("../controllers/Prices");

const router = express.Router();

router.route("/portfolio_prices")
  .post(getAllTickerPrices);

router.route("/prueba")
  .post(pruebaPort);

router.route("/ticker/:ticker")
  .get(getTickerPrices);
module.exports = router;
