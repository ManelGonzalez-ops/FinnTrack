

class Portfolio {

    portfolioHistory
    generatedSeries
    constructor(portfolioHistory, generatedSeries){
        this.portfolioHistory = portfolioHistory
        this.generatedSeries = generatedSeries
    }

    init(){
        return this.generateSerie()
    }

    calculadorMedia = (asset, stockPrice, date, lastDate, portfolioValue) => {

        // console.log(asset.amount, asset.price, portfolioValue, date, lastDate, asset.ticker, "rururu")
        const relativeSize = (asset.amount * stockPrice) / portfolioValue
        const currentPrice = this.portfolioHistory[date][asset.ticker.toUpperCase()].close
        const lastPrice = this.portfolioHistory[lastDate][asset.ticker.toUpperCase()].close
        const change = (currentPrice - lastPrice) / lastPrice
        //console.log(relativeSize, "rururu")
        //console.log((currentPrice - lastPrice) / lastPrice, "rururu")
        //console.log(change, relativeSize, "rururu")
        const koko = relativeSize * change
        return koko
    }

     addRelativePerformance = (companiesPerformance, date, aportacion, asset) => {
        const aportacionR = aportacion * 100
        if (Math.abs(aportacionR) < 0.1) {
            const otherCategory = companiesPerformance[date].find(item => item.ticker === "other")
            if (!otherCategory) {
                companiesPerformance[date] = [
                    ...companiesPerformance[date],
                    {
                        ticker: "other",
                        performance: aportacionR
                    }
                ]
            } else {
                otherCategory.performance = otherCategory.performance + aportacionR
            }

        } else {
            companiesPerformance[date] = [...companiesPerformance[date],
            {
                ticker: asset.ticker.toUpperCase(),
                performance: aportacionR
            }
            ]
        }
    }


    generateSerie = () => {
        let masterSerie = {}
        let validDates = []
        let liquidativeInitial = 1000
        let accruedIncome = 0
        let companiesPerformanceImpact = {}
        let liquidativeValue;
        //polifill, if some price is unexpectly missing we will use the last valid price.
        let polyfillPrices = {}
        let stocksProcesed = []
        //console.log(this.generatedSeries, "WTFFF")
        const dateKeys = Object.keys(this.generatedSeries.dates)
        let isFirstDay = true
        dateKeys.forEach((date, index) => {
            if (this.portfolioHistory[date] !== undefined) {
                let portfolioCost = 0
                let portfolioValue = 0
                
                this.generatedSeries.dates[date].positions.forEach(asset => {
                    portfolioCost += asset.amount * asset.unitaryCost
                    const stockRegister = this.portfolioHistory[date][asset.ticker.toUpperCase()]
                    let stockClosePrice;
                    if (stockRegister === undefined) {
                        stockClosePrice = polyfillPrices[asset.ticker]
                    } else {
                        stockClosePrice = stockRegister.close
                        polyfillPrices[asset.ticker] = stockClosePrice
                    }

                    const positionVal = stockClosePrice * asset.amount
                    portfolioValue += positionVal
                })
                if (isFirstDay) {
                    liquidativeValue = liquidativeInitial
                    validDates = [...validDates, date]
                    masterSerie = {
                        ...masterSerie,
                        [date]: {
                            portfolioCost,
                            portfolioValue,
                            accruedIncome,
                            liquidativeValue
                        }
                    }
                }
                else {
                    companiesPerformanceImpact[date] = []
                    let valueIncrement = 0
                    let lastDate = validDates[validDates.length - 1]
                    //console.log(lastDate, "luuust")
                    let lastLiquidativeValue = masterSerie[lastDate].liquidativeValue
                    //calculate portfolioValue and costs
                    //calculate liquidative Value

                    this.generatedSeries.dates[date].positions.forEach(asset => {
                        let isFirstRecord = false
                        if (!stocksProcesed.includes(asset.ticker.toUpperCase())) {
                            stocksProcesed = [...stocksProcesed, asset.ticker.toUpperCase()]
                            isFirstRecord = true
                        }

                        const stockRegister = this.portfolioHistory[date][asset.ticker.toUpperCase()]
                        let stockClosePrice;
                        if (stockRegister === undefined) {
                            stockClosePrice = polyfillPrices[asset.ticker]
                        } else {
                            stockClosePrice = stockRegister.close
                            //polyfillPrices[asset.ticker] = stockClosePrice
                        }
                        // if (stockClosePrice === undefined) {
                        //     stockClosePrice = getLastValidPrice(asset.ticker.toUpperCase())
                        // }
                        const aportacion = isFirstRecord ? 0 : this.calculadorMedia(asset, stockClosePrice, date, lastDate, portfolioValue)
                        valueIncrement += aportacion
                        this.addRelativePerformance(companiesPerformanceImpact, date, aportacion, asset)

                    })

                    liquidativeValue = lastLiquidativeValue * (1 + valueIncrement)

                    masterSerie = {
                        ...masterSerie,
                        [date]: {
                            portfolioCost,
                            portfolioValue,
                            accruedIncome,
                            liquidativeValue
                        }
                    }
                    //we should store this array in the context to acces easily in the updateSeries
                    validDates = [...validDates, date]
                }

                isFirstDay = false
            }
        })
        //console.log(companiesPerformanceImpact, "perfi")
        //console.log(masterSerie, "lo fucking tenemos")
        return masterSerie
        
    }
}

module.exports = Portfolio