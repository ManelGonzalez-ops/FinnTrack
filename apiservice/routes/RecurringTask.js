const express = require("express");
const { getSearchResults, getGeneralData, sendDailyMarketData } = require("../controllers/recurringtasks/Other");
const { getCountriesPopulation } = require("../controllers/recurringtasks/Other");
const { getCompaniesInfo, getCompanyQuoteInfo } = require("../controllers/recurringtasks/companiesInfo");
const { getIndexConstituents, sendIndexPrices } = require("../controllers/recurringtasks/Indexes");

const router = express.Router();
//  get and or store company info
router.route("/companiesInfo/companies_url").post(getCompaniesInfo);
router.route("/companiesInfo/quotes")
  .post(getCompanyQuoteInfo);

router.route("/indexes/constituents/:index")
  .post(getIndexConstituents);

// needs to run recurrently, every 10h
router.route("/indexes/allprices")
  .get(sendIndexPrices);

router.route("/direct_json")
  .get(sendDailyMarketData);

router.route("/other/countriesPopulation")
  .get(getCountriesPopulation);

router.route("/search/:word")
  .get(getSearchResults);

module.exports = router;
