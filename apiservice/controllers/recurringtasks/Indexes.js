const fs = require("fs");
const { fetchQuoteConstituents, fetchAvailableIndexes, fetchAllIndexesPrices } = require("../../controller");

const getIndexConstituents = async (req, res) => {
  console.log("hola");
  const constituentsArr = req.body.ticker;
  console.log(req.params.index, "que index es");
  // console.log(constituentsArr, "mierda")
  try {
    fs.readFile(`${req.params.index}.json`, async (err, data) => {
      if (err) {
        const dataf = await fetchQuoteConstituents(constituentsArr);
        if (dataf.length > 0) {
          fs.writeFileSync(`${req.params.index}.json`, JSON.stringify(dataf));
          res.send({ dataf, modo: "first write" });
        }
      } else {
        // we already have the file
        // const dota = JSON.parse(data)
        res.send({ data: JSON.parse(data.toString()), modo: "readed" });
      }
    });
  } catch (err) {
    res.status(404).send(err.message);
  }
};

const handleStoredResponse = async (filename, fetchCallback) => {
  const promiser = () => new Promise((resolve) => fs.readFile(`${filename}.json`, async (err, data) => {
    if (err) {
      try {
        const datas = await fetchCallback();
        if (datas) {
          // console.log(datas, "daaatas")
          resolve({ success: true, data: datas });
        } else {
          console.log(datas, "erruuuuru");
          resolve({ success: false, error: { mag: "no data found" } });
        }
      } catch (error) {
        resolve({ success: false, error: { msg: error.message } });
      }
    } else {
      // we already have the file
      // const dota = JSON.parse(data)
      resolve({ success: true, data, error: "" });
    }
  }));
  // eslint-disable-next-line no-return-await
  return await promiser();
};

const checkMissingIndexes = async () => {
  let hasMissingIndex = true;
  let allIndexPrices = "";
  let cycleNum = 0;
  let contador = 0;
  console.log("putona");

  while (hasMissingIndex) {
    cycleNum++;
    console.log("start", cycleNum);

    // eslint-disable-next-line no-loop-func
    await new Promise((resolve) => {
      setTimeout(() => {
        // give some time before call the api again to minimize usage limits errors
        contador++;
        if (contador >= 10) {
          hasMissingIndex = false;
        }
        // resolve()
        console.log("dentro");
        console.log(contador, "cuenta debe ir lento");
        fs.readFile("indices.json", async (err, data) => {
          if (!err) {
            const rest = await handleStoredResponse("available_indexes", fetchAvailableIndexes);
            // console.log(rest, "resulttado")
            if (rest.success) {
              const allIndex = rest.data.map((item) => {
                if (item.symbol) {
                  return item.symbol;
                }
                return undefined;
              });
              console.log(allIndex, "all index");
              const storedIndex = JSON.parse(data.toString()).map((item) => {
                if (item.symbol) {
                  return item.symbol;
                }
                return undefined;
              }).filter((item) => item !== undefined);
              console.log(storedIndex, "stored index");
              const missingIndex = allIndex.map((symbol) => {
                if (!storedIndex.includes(symbol)) {
                  return symbol;
                  // wel it will return undefined
                }
                return undefined;
              }).filter((item) => item !== undefined);

              console.log(missingIndex, "missin indexxes");
              if (!missingIndex.length) {
                console.log("executad");
                hasMissingIndex = false;
                resolve();
              }
              console.log(missingIndex, "la clave");
              try {
                const dataf = await fetchAllIndexesPrices(missingIndex);
                if (dataf) {
                  // eslint-disable-next-line no-param-reassign
                  data = [...data, ...dataf];
                  data.filter((item) => !item["Error Message"]);
                  allIndexPrices = data;
                  resolve();
                } else {
                  resolve();
                }
              } catch (error) {
                // ad reject here if goes wrong
                resolve();
                console.log(error.message, "punto3");
              }
            } else {
              console.log(rest.error.msg, "ue huevpos");
              resolve();
            }
          } else {
            console.log("WTF is appening");
            resolve();
          }
        });
      }, 6000);
    });
  }
  if (allIndexPrices) {
    return allIndexPrices;
  } else {
    return "something went wrong";
  }
};



const sendIndexPrices = (req, res, next) => {
  fs.readFile("indices.json", (error, data) => {
    if (error) {
      next(error);
    }
    res.send({ data: JSON.parse(data.toString()), modo: "readed" });
  });
};

module.exports = { getIndexConstituents, checkMissingIndexes, sendIndexPrices };
