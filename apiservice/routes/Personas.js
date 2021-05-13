const express = require("express");
const {
  listPeople, makePortfolio, showUser,
  sendPortfolios,
  getImage,
} = require("../controllers/Personas");

const router = express.Router();

router.route("/")
  .get(listPeople);

router.route("/porfolio")
  .get(makePortfolio);

router.route("/main")
  .get(sendPortfolios);

router.route("/:id")
  .get(showUser);

router.route("/image/:fundId")
  .get(getImage);

module.exports = router;
