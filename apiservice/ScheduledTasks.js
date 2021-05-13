const cron = require("node-cron");
const fs = require("fs");
const { checkMissingIndexes } = require("./controllers/recurringtasks/Indexes");
const { storeGeneralDataScheduled } = require("./controllers/recurringtasks/Other");
const { fetchAvailableIndexes } = require("./controller");
const { fetchAllIndexesPrices } = require("./controller");
const { makePortfolio } = require("./controllers/Personas")

const runScheduledTasks = () => {
  cron.schedule("* * 1 * * *", writeAllIndexPrices);
  cron.schedule("* * 1 * * *", () => storeGeneralDataScheduled("gainers losers"));
  cron.schedule("* * 1 * * *", () => storeGeneralDataScheduled("topactives"));
  cron.schedule("* * 1 * * *", makePortfolio);
}

const writeAllIndexPrices = async (req, res) => {
  try {
    const availableIndexes = await fetchAvailableIndexes();
    if (availableIndexes) {
      try {
        const dataf = await fetchAllIndexesPrices(availableIndexes);
        if (dataf.length > 0) {
          fs.writeFileSync("indices.json", JSON.stringify(dataf));
          try {
            // here the file could be rewritting in case of missing indexes
            const datos = await checkMissingIndexes();
            res.send({ data: datos, modo: "first write" });
          } catch (error) {
            fs.writeFileSync("scheduledtasks-erors.txt", error.message);
          }
        } else {
          fs.writeFileSync("scheduledtasks-erors.txt", "no companies found");
        }
      } catch (error) {
        fs.writeFileSync("scheduledtasks-erors.txt", error.message);
      }
    } else {
      fs.writeFileSync("scheduledtasks-erors.txt", "no available indexes");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = runScheduledTasks