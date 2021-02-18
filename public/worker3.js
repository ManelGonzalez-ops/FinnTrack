let polyfillPrices = {}
let portfolioHistory
let generatedSeries
this.onmessage = e => {
    const { _portfolioHistory, _generatedSeries } = e.data
    portfolioHistory = _portfolioHistory
    generatedSeries = _generatedSeries
    const { masterSerie, companiesPerformanceImpact } = generateSerie()
    this.postMessage({ portfolioSeries: masterSerie, companiesPerformanceImpact })

}
const getLastPrice = (lastDate, asset) => {
    const theresLastPrice = portfolioHistory[lastDate][asset.ticker.toUpperCase()]
    if (theresLastPrice) {
        return portfolioHistory[lastDate][asset.ticker.toUpperCase()].close
    }
    return polyfillPrices[asset.ticker]
}

const calculadorMedia = (asset, stockPrice, lastDate, portfolioValue) => {

    //console.log(asset.amount, asset.price, portfolioValue, date, lastDate, asset.ticker, "rururu")
    //console.log(portfolioHistory, "historria")
    const relativeSize = (asset.amount * stockPrice) / portfolioValue
    const lastPrice = getLastPrice(lastDate, asset)
    const change = (stockPrice - lastPrice) / lastPrice
    //console.log(relativeSize, "rururu")
    //console.log((currentPrice - lastPrice) / lastPrice, "rururu")
    //console.log(change, relativeSize, "rururu")
    const koko = relativeSize * change
    return koko
}

const addRelativePerformance = (companiesPerformance, date, aportacion, asset) => {
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

const generateSerie = () => {
    let masterSerie = {}
    let liquidativeInitial = 1000
    let accruedIncome = 0
    let companiesPerformanceImpact = {}
    let change, lastDate, lastIncome, liquidativeValue;
    let wtf = []
    //polifill, if some price is unexpectly missing we will use the last valid price.
    let validDates = []
    let stocksProcesed = []
    const dateKeys = Object.keys(generatedSeries.data.dates)
    console.log(dateKeys, "dataKeyss")
    let firstIteration = true
    dateKeys.forEach((date) => {
        if (portfolioHistory[date] !== undefined) {
            let portfolioCost = 0
            let portfolioValue = 0
            generatedSeries.data.dates[date].positions.forEach(asset => {
                portfolioCost += asset.amount * asset.unitaryCost
                const stockRegister = portfolioHistory[date][asset.ticker.toUpperCase()]
                let stockClosePrice;
                if (stockRegister === undefined) {
                    let lastValidPrice = polyfillPrices[asset.ticker]
                    stockClosePrice = lastValidPrice ? lastValidPrice : asset.unitaryCost
                    polyfillPrices[asset.ticker] = stockClosePrice
                } else {
                    stockClosePrice = stockRegister.close
                    polyfillPrices[asset.ticker] = stockClosePrice
                }
                console.log(asset.ticker, stockClosePrice, "paro ka")
                const positionVal = stockClosePrice * asset.amount
                portfolioValue += positionVal
            })
            if (firstIteration) {
                firstIteration = false
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
                console.log(validDates, lastDate, "ka ous")
                //console.log(lastDate, "luuust")
                let lastLiquidativeValue = masterSerie[lastDate].liquidativeValue
                //calculate portfolioValue and costs
                //calculate liquidative Value

                generatedSeries.data.dates[date].positions.forEach(asset => {
                    let isFirstRecord = false
                    if (!stocksProcesed.includes(asset.ticker.toUpperCase())) {
                        stocksProcesed = [...stocksProcesed, asset.ticker.toUpperCase()]
                        isFirstRecord = true
                    }

                    const stockRegister = portfolioHistory[date][asset.ticker.toUpperCase()]
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
                    const aportacion = isFirstRecord ? 0 : calculadorMedia(asset, stockClosePrice, lastDate, portfolioValue)
                    valueIncrement += aportacion
                    addRelativePerformance(companiesPerformanceImpact, date, aportacion, asset)

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

        }
    })
    console.log(companiesPerformanceImpact, "perfi")

    return { masterSerie, companiesPerformanceImpact }
}