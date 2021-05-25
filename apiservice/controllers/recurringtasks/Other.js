const path = require("path");
const fs = require("fs");
const { fetcharS } = require("../../controller");
const { storeGeneralData } = require("../../db/services");
const { fetchDispatcher } = require("../../controller");
const { deletePreviousDateRecord } = require("../../db/services");
const { getGeneralDataJson } = require("../../db/services");
const { convertUnixToHuman } = require("../../dataUtils");

const getCountriesPopulation = async (req, res) => {
  fs.readFile(path.resolve(__dirname, "../../data/own_countries_by_population.json"), async (err, data) => {
    if (err) {
      console.log(err, "error");
      res.status(404).send(err);
    } else {
      res.status(200).send(JSON.parse(data.toString()));
    }
  });
};

const storeGeneralDataScheduled = async (field) => {
  const validDbDate = convertUnixToHuman(Date.now());
  try {
    const data = await fetchDispatcher(field);
    console.log(data, "thee datau");
    if (data.length > 0) {
      await storeGeneralData(field, validDbDate, data);
    } else {
      fs.writeFileSync("scheduledtasks-erors.txt", "error, the message was empty");
    }
  } catch (err) {
    console.log(err, "erruraso")
    fs.writeFileSync("scheduledtasks-erors.txt", err);
  }
};
const getGeneralData = async (req, res) => {
  const { field } = req.query;
  const validDbDate = convertUnixToHuman(Date.now());
  try {
    let jsonData = await getGeneralDataJson(field, validDbDate);
    console.log(jsonData, "awiii1");
    if (jsonData.length > 0) {
      res.status(200).send(jsonData[0]);
    } else {
      await storeGeneralDataScheduled(field);
      jsonData = await getGeneralDataJson(field, validDbDate);
      if (jsonData.length > 0) {
        res.status(200).send(jsonData[0]);
      } else {
        res.status(400).send("error, reload the page to see ful data");
      }
    }
  } catch (err) {
    res.status(400).send(err, "databse error");
  }
};

const getSearchResults = async (req, res) => {
  console.log(req.params.word);
  try {
    const data = await fetcharS(req.params.word);
    if (data) {
      console.log(data, "comeee nena");
      res.send({ data });
    } else {
      console.log(data, "el error que es");
    }
  } catch (err) {
    res.status(404).send({ err });
  }
};

module.exports = {
  getCountriesPopulation, getGeneralData, getSearchResults, storeGeneralDataScheduled,
};
