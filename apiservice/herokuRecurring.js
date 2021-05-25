const { storeGeneralDataScheduled } = require("./controllers/recurringtasks/Other");
const { makePortfolio } = require("./controllers/Personas")
const { writeAllIndexPrices } = require("./ScheduledTasks")

const herokuTasks = async () => {
    await writeAllIndexPrices()
    await storeGeneralDataScheduled("gainers losers")
    await storeGeneralDataScheduled("topactives")
    await makePortfolio()
}

herokuTasks()