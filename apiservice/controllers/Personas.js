const fs = require("fs");
const { getAllOperations, getOperationsByUserId, getAllPortfoliosDB } = require("../db/services");
const Logic = require("../logic/state.js");
const { prepareStoredOperations, setInitialPossesions } = require("../dataPreparation");
const { getFundImage, getAllUserInfoById } = require("../db/services/PeopleService");


const listPeople = (req, res) => {
  console.log("ejecutao 4");
  getAllOperations()
    .then((data) => {
      console.log(data, "personas");
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
};

const makePortfolio = async () => {
  console.log("ejecutao 1");
  const initialTime = Date.now()
  try {
    const logicInstance = new Logic();
    return await logicInstance.initAll();
  } catch (err) {
    fs.writeFileSync("scheduledtasks-erors.txt", err);
    // res.status(400).send(err.message)
    throw err
  }
  finally {
    console.log((Date.now() - initialTime) / 1000, "seconds")
  }
};

const sendPortfolios = async (req, res, next) => {
  try {
    const peopleCollection = await makePortfolio();
    res.status(200).send(peopleCollection);
  } catch (err) {
    next(err);
    // res.status(400).send(err.message)
  }
};

const getPortfolios = async (req, res, next) => {
  const portfolios = await getAllPortfoliosDB()
  const promiseArr = portfolios.map(port => getAllUserInfoById(port.userId))
  const usersData = (await Promise.all(promiseArr)).flatMap(item=>item)
  console.log(usersData)
  const matchData = () => {
    const data = [];
    usersData.forEach(user => {
      portfolios.forEach(port => {
        //console.log(port.userId, user)
        if (port.userId === user.userId) {
          data.push({ user, portfolio: port.portfolio })
        }
      })
    })
    return data
  }
  const readyData = matchData()
  return res.status(200).send(readyData)

}

const showUsers = (req, res) => {
  console.log("ejecutao 2");
  const rawData = fs.readFileSync("porfolios.json");
  const data = JSON.parse(rawData);
  return res.status(200).send(data);
};
const showUser = async (req, res, next) => {
  console.log("ejecutao 3");
  try {
    const { id } = req.params;
    const additionalStats = await getCurrentPosessions(id);
    const logicInstance = new Logic();
    logicInstance.initOne(id)
      .then((data) => res.status(200).send({ ...data, ...additionalStats }))
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
};

const getCurrentPosessions = async (id) => {
  try {
    const operations = await getOperationsByUserId(id);
    const readyOperations = prepareStoredOperations(operations);
    const { uniqueStocks, currentStocks, userCash } = setInitialPossesions(operations);
    return {
      readyOperations, uniqueStocks, currentStocks, userCash,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const getImage = async (req, res, next) => {
  const { fundId } = req.params
  try {
    const fundCreator = await getFundImage(fundId)
    res.status(200).json(fundCreator.image)
  }
  catch (err) {
    res.status(400).send(err.message)
  }
}

module.exports = {
  listPeople, makePortfolio, showUsers, showUser, sendPortfolios,
  getImage, getPortfolios
};
