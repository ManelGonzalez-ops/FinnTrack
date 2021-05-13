const { PriceService } = require("../controllers/Prices");

class PricesServer {

    possesions
    constructor(possesions) {
        this.possesions = possesions
    }
    async getPraices() {

        try {
            const priceService = new PriceService(this.possesions, "puta3")
            const pricesDirty = await priceService.init()
            return this.structurePrices(pricesDirty)
        }
        catch (err) {
            throw new Error(err)
        }
    }

    structurePrices(pricesDirty) {
        let portfolioHistoryByDate = {}
        pricesDirty.forEach(company => {
            //we take the unique key which is the ticker
            const ticker = Object.keys(company)[0]
            if (company[ticker].length > 0) {
                //console.log(company[ticker, "pooouto"])
                company[ticker].forEach(register => {
                    //handle portfolioFunds as they already come with clean dates
                    const isDateFormated = register.date.split("").find(char => char === "T")
                    let date = isDateFormated ?
                        register.date.split("T")[0]
                        :
                        register.date

                    portfolioHistoryByDate[date] = {
                        ...portfolioHistoryByDate[date],
                        //aqui podriamos poner close high y todos
                        [ticker]: {
                            close: register.close
                        }
                    }
                })
            }
        })
        //console.log(portfolioHistoryByDate, "pooorfiin funciona")
        return portfolioHistoryByDate
    }
}

module.exports = PricesServer