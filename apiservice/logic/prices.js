const { PriceService } = require("../controllers/Prices");

class PricesServer extends PriceService {

    pricesDirty

    constructor(possesions) {
        super(possesions)
    }
    async getPraices() {

        try {

            this.pricesDirty = await super.init()
            return this.structurePrices()
        }
        catch (err) {
            throw new Error(err)
        }
    }

    structurePrices() {
        let portfolioHistoryByDate = {}
        //console.log(this.pricesDirty, "tumuela")
        this.pricesDirty.forEach(company => {
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
        console.log(portfolioHistoryByDate, "pooorfiin funciona")
        return portfolioHistoryByDate
    }
}

module.exports = PricesServer