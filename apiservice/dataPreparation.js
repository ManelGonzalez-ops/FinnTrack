const { unitaryCostMean } = require("./dataUtils");

module.exports = {
  prepareStoredOperations: (ops) => ops.map((op) => {
    let costOrPrice;
    costOrPrice = op.operationtype === "buy" ? { unitaryCost: op.price } : { priceSold: op.price };
    // aqui deberiamos añadir un dia, porque al hacer JSON.parse(JSON.stringify) no se porque se le resta un dia
    console.log(op.opdate.toString(), "fuckingg date", JSON.parse(JSON.stringify(op.opdate)).split("T")[0], "wuut");
    return {
      date: JSON.parse(JSON.stringify(op.opdate)).split("T")[0],
      operationType: op.operationtype,
      isFirstOperation: op.isFirstOperation !== 0,
      details: {
        ticker: op.ticker.toUpperCase(),
        amount: op.amount,
        ...costOrPrice,
      },
    };
  }),
  // this will once, when user sign in then any other operation will be handled in the frontend (stockShop.js)
  setInitialPossesions: (arr) => {
    const initialCash = 200000;
    let userCash = initialCash;
    let uniqueStocks = [];
    let currentStocks = [];
    arr.forEach((op) => {
      console.log(currentStocks, "current");
      if (!uniqueStocks.includes(op.ticker.toUpperCase())) {
        uniqueStocks = [...uniqueStocks, op.ticker.toUpperCase()];
      }
      const alreadyOwned = currentStocks.find((item) => item.ticker === op.ticker.toUpperCase());
      if (alreadyOwned) {
        let newAmount;
        if (op.operationtype === "buy") {
          userCash -= op.price * op.amount;
          newAmount = alreadyOwned.amount + op.amount;
          const updatedPosesions = currentStocks.map((item) => {
            if (item.ticker === op.ticker.toUpperCase()) {
              item.amount = newAmount;
              item.unitaryCost = unitaryCostMean(item, op.amount, op.price);
            }
            return item;
          });
          currentStocks = updatedPosesions;
        } else {
          userCash += op.price * op.amount;
          newAmount = alreadyOwned.amount - op.amount;
          if (newAmount > 0) {
            const updatedPosesions = currentStocks.map((item) => {
              if (item.ticker === op.ticker.toUpperCase()) {
                item.amount = newAmount;
              }
              return item;
            });
            currentStocks = updatedPosesions;
          } else {
            const filteredPossesions = currentStocks.filter((item) => item.ticker !== op.ticker.toUpperCase());
            currentStocks = filteredPossesions;
          }
        }
      } else if (op.operationtype === "buy") {
        userCash -= op.price * op.amount;
        const readyDate = JSON.parse(JSON.stringify(op.opdate)).split("T")[0];
        currentStocks = [...currentStocks,
          // important to make it uppercase for the operation involving peopleFunds
          {
            ticker: op.ticker.toUpperCase(), amount: op.amount, date: readyDate, unitaryCost: op.price, assetType: op.assetType,
            fundId: op.fundId
          }];
      } else {
        throw new Error("no puedes vender lo que no tienes");
      }
    });
    return { uniqueStocks, currentStocks, userCash };
  },
};
