const { convertHumanToUnixInit, convertUnixToHuman } = require("../dataUtils")



class Portfolio {
    date
    today
    portfolioHistory
    generatedSeries
    polyfillPrices = {}
    publicHolidays = []
    constructor(portfolioHistory, generatedSeries) {
        this.portfolioHistory = portfolioHistory
        this.generatedSeries = generatedSeries
        this.today = convertUnixToHuman(Date.now())
        console.log("tus muertos")
    }

    init() {
        return this.generateSerie()
    }


    setDate = (date) => { this.date = date }
    isFirstDay = () => false
    isToday = () => this.date === this.today
    isTodayFirstDay = () => false
    isWeekend = (date) => {
        const day = new Date(convertHumanToUnixInit(date))
        if (day.getDay() === 6 || day.getDay() === 0) {
            return true
        }
        return false
    }

    workingDays = () => {
        const koko = Object.keys(this.generatedSeries.dates).filter(date => this.isWeekend(date))
        return koko
    }
    removeWeekends = (obj) => {
        Object.keys(obj).forEach(date => {
            this.isWeekend(date) && delete obj[date]
        })

        return obj
    }

    addPublicHoliday = (date) => {
        this.publicHolidays.push(date)
    }
    isPublicHolidays = (date) => {
        return this.publicHolidays.find(item => item === date)
    }


    calculadorMedia = (asset, stockPrice, lastDate, portfolioValue) => {

        const relativeSize = (asset.amount * stockPrice) / portfolioValue
        let lastPrice;
        if (this.isTodayFirstDay()) {
            lastPrice = asset.unitaryCost
        } else {
            lastPrice = this.getLastPrice(lastDate, asset)
        }
        const change = (stockPrice - lastPrice) / lastPrice

        const koko = relativeSize * change
        if (asset.ticker === "MRNA") {
            console.log(stockPrice, lastPrice, change, koko, lastDate, "mrana")
        }
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
    getPortfolioStats = () => {
        let masterInfo = {}
        Object.keys(this.generatedSeries.dates).forEach(date => {
            let portfolioCost = 0;
            let portfolioValue = 0;
            let companiesPrice = {}
            this.generatedSeries.dates[date].positions.forEach(asset => {
                //we have to omit weekend days because when we start the portfolio in the weekend prices will be undefined
                this.setDate(date)
                let stockRegister;
                let stockClosePrice;
                if (this.isTodayFirstDay()) {
                    console.log("pasa por aquiii")
                    //la primera serie no debe ser guardada...
                    stockRegister = this.quotes.find(item => item.ticker === asset.ticker)
                    stockClosePrice = stockRegister.priceInfo.adjClose
                } else {
                    //ojo con esto que puede dar a problemss en generateSeries2
                    if (!this.portfolioHistory[date]) {
                        if (this.isWeekend(date)) {
                            console.log(date, "is weekend")
                            companiesPrice = {
                                ...companiesPrice,
                                [asset.ticker]: asset.unitaryCost
                            }
                            const val = asset.unitaryCost * asset.amount
                            portfolioValue += val
                            portfolioCost += val
                            return
                        }
                        else {
                            //means is today
                            if (this.isToday()) {
                                console.log("hoy mooooooo", date)
                                return
                            } else {
                                console.log("public holliday")
                                this.addPublicHoliday(date)
                            }
                        }
                        //else we continue as we should have polyfilled price already set
                    }
                    console.log(date, "fechaau")
                    if (this.portfolioHistory[date]) {
                        stockRegister = this.portfolioHistory[date][asset.ticker.toUpperCase()]
                        stockClosePrice = stockRegister.close
                    } else {
                        stockRegister = undefined
                    }

                    if (stockRegister === undefined) {
                        let lastValidPrice = this.polyfillPrices[asset.ticker]
                        stockClosePrice = lastValidPrice ? lastValidPrice : asset.unitaryCost
                        this.polyfillPrices[asset.ticker] = stockClosePrice
                    } else {
                        stockClosePrice = stockRegister.close
                        this.polyfillPrices[asset.ticker] = stockClosePrice
                    }
                }

                companiesPrice = {
                    ...companiesPrice,
                    [asset.ticker]: stockClosePrice
                }
                const positionVal = stockClosePrice * asset.amount
                portfolioValue += positionVal
                portfolioCost += asset.amount * asset.unitaryCost
            })

            masterInfo = {
                ...masterInfo,
                [date]: {
                    portfolioCost,
                    portfolioValue,
                    companiesPrice
                }
            }
        })

        return masterInfo
    }

    generateSerie = () => {
        let masterSerie = {}
        let liquidativeInitial = 1000
        let accruedIncome = 0
        let liquidativeValue
        let companiesPerformanceImpact = {}
        let validDates = []
        console.log(this.generatedSeries, "q cullons")
        const dateKeys = Object.keys(this.generatedSeries.dates)
        const masterInfo = this.getPortfolioStats()
        console.log(masterInfo, "masterInnnfo")
        const impactHelper = new ImpactHelper(masterInfo)
        dateKeys.forEach(date => {

            companiesPerformanceImpact[date] = []
            this.setDate(date)
            let valueIncrement = 0
            let lastLiquidativeValue
            let lastDate;
            const portfolioCost = masterInfo[date].portfolioCost
            const portfolioValue = masterInfo[date].portfolioValue

            if (!validDates.length) {
                lastLiquidativeValue = 1000
            } else {
                lastDate = validDates[validDates.length - 1]
                console.log(validDates, lastDate, "ka ous")
                lastLiquidativeValue = masterSerie[lastDate].liquidativeValue
            }

            if (this.isWeekend(date) || this.isPublicHolidays(date)) {
                return
            }

            this.generateImpact(impactHelper, lastDate, portfolioValue, companiesPerformanceImpact)

            if (this.isTodayFirstDay()) {
                const initialPerformance = portfolioValue / portfolioCost
                liquidativeValue = liquidativeInitial * initialPerformance
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
                console.log("weeen")
                if (this.isToday()) {
                    return
                }
                console.log(impactHelper.valueIncrement, "valincre")
                liquidativeValue = lastLiquidativeValue * (1 + impactHelper.valueIncrement)

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
            }

            impactHelper.resetValueIncrement()

            validDates = [...validDates, date]
            console.log("tus muelos")
            //console.log(masterSerie, "masterSeries")
        })
        return { masterSerie: masterSerie, companiesPerformanceImpact: companiesPerformanceImpact }
    }

    getLastPrice = (lastDate, asset) => {
        if (!this.portfolioHistory[lastDate]) {
            return asset.unitaryCost
        }
        const theresLastPrice = this.portfolioHistory[lastDate][asset.ticker.toUpperCase()]
        if (theresLastPrice) {
            return this.portfolioHistory[lastDate][asset.ticker.toUpperCase()].close
        }
        return this.polyfillPrices[asset.ticker]
    }



    generateImpact = (impactHelper, lastDate, portfolioValue, companiesPerformanceImpact) => {
        this.generatedSeries.dates[this.date].positions.forEach((asset, index) => {

            if (this.isToday() && !this.isTodayFirstDay()) {
                //if is today and is not first day we will omit it,
                //if today is first day we don0t want to omit as we want to show de generated serie
                console.log(this.date, this.today, this.isToday(), "qe cojinis")
                return
            }

            const stockClosePrice = impactHelper.masterInfo[this.date].companiesPrice[asset.ticker]


            // aportacion = isFirstRecord ? 0 : this.calculadorMedia(asset, stockClosePrice, lastDate, portfolioValue)
            const aportacion = this.calculadorMedia(asset, stockClosePrice, lastDate, portfolioValue)
            if (asset.ticker === "MRNA") {
                console.log(stockClosePrice, portfolioValue, this.date, aportacion, "qa wabs")
            }

            this.addRelativePerformance(companiesPerformanceImpact, this.date, aportacion, asset)
            //
            impactHelper.addValueIncrement(aportacion)

        })
    }
}

class ImpactHelper {

    valueIncrement = 0
    constructor(masterInfo) {
        this.masterInfo = masterInfo
    }
    addValueIncrement = (val) => {
        this.valueIncrement += val
    }
    resetValueIncrement = () => {
        this.valueIncrement = 0
    }
}


module.exports = Portfolio