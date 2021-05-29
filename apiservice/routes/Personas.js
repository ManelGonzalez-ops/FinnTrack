const express = require("express");
const {
  listPeople, makePortfolio, showUser,
  sendPortfolios,
  getImage,
  getPortfolios
} = require("../controllers/Personas");

const router = express.Router();

router.route("/send")
  .get(getPortfolios)

router.route("/porfolio")
  .get(makePortfolio);

router.route("/main")
  .get(sendPortfolios);

router.route("/:id")
  .get(showUser);

  router.route("/")
  .get(listPeople);

router.route("/image/:fundId")
  .get(getImage);

module.exports = router;
