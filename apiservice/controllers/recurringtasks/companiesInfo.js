// eslint-disable-next-line no-undef
const { fetchCompanyAdditional, fetchAllQuotes } = require("../../controller");
const { addCompanyInfo, getCompanyInfo } = require("../../../db/services");

const fetchTillAllSucceed = async (missingStocks) => {
  let currentMissings = missingStocks;
  let successArr = [];
  while (currentMissings.length > 0) {
    // eslint-disable-next-line no-loop-func
    await new Promise((resolve) => {
      setTimeout(async () => {
        // eslint-disable-next-line max-len
        const promiseArrMissing = currentMissings.map((position) => fetchCompanyAdditional(position));
        const missingData = await Promise.all(promiseArrMissing);
        for (const promise of missingData) {
          successArr = [...successArr, promise];
        }

        for (const poss of missingStocks) {
          // eslint-disable-next-line max-len
          const stockSuccesfullyFetched = successArr.find((item) => item.ticker === poss);
          if (stockSuccesfullyFetched) {
            // eslint-disable-next-line max-len
            currentMissings = currentMissings.filter((ticker) => ticker !== poss);
          }
        }
        resolve();
      },
      // eslint-disable-next-line no-magic-numbers
      5000);
    });
  }

  return successArr;
};

// eslint-disable-next-line consistent-return
const getCompaniesInfo = async (req, res) => {
  const { positions } = req.body;

  if (positions.length > 0) {
    const promiseArrAll = positions.map((position) => getCompanyInfo(position.ticker));
    let alreadyStored = await Promise.all(promiseArrAll);

    const missingStocks = [];

    alreadyStored = alreadyStored.filter((item) => item.length > 0).map((item) => item[0]);
    //toUpperCase important rightnow for peopleFund records in DB 
    const alreadyStoredTickers = alreadyStored.map((item) => item.ticker.toUpperCase());
    console.log(alreadyStoredTickers, "despres");
    // we compare against existing companies in the db to find missing one
    positions.forEach((item) => {
      if (!alreadyStoredTickers.includes(item.ticker)) {
        missingStocks.push(item.ticker);
      }
    });
    if (missingStocks.length === 0) {
      return res.status(200).send(alreadyStored);
    } else {
      const missingCompaniesDataArr = await fetchTillAllSucceed(missingStocks);
      console.log(missingCompaniesDataArr, "missingCompaniesArro")
      addCompanyInfo(missingCompaniesDataArr)
        .then((response) => {
          console.log(response, "reeeeepi");
          const readyResponse = response.map((stock) => ({
            ticker: stock[0],
            logourl: stock[1],
            weburl: stock[2],
            name: stock[3],
          }));
          const allData = [...alreadyStored, ...readyResponse];
          return res.status(200).send(allData);
        })
        .catch((err) => { console.log(err, "fataaaal errorrrr"); });
    }
  }
};

const getCompanyQuoteInfo = async (req, res) => {
  const { tickers } = req.body;
  if (tickers && tickers.length > 0) {
    try {
      const dataArr = await fetchAllQuotes(tickers);
      if (dataArr.length > 0) {
        return res.status(200).send(dataArr);
      } else {
        return res.status(400).send(dataArr, "la funcion no ha dao empty arr");
      }
    } catch (err) {
      return res.status(400).send(err.message, "errruuur");
    }
  } else {
    return res.status(400).send("empty body");
  }
};

module.exports = { getCompaniesInfo, getCompanyQuoteInfo };
