let polyfillPrices = {}
let portfolioHistory
let generatedSeries
this.onmessage = e => {
    const { _portfolioHistory, _generatedSeries, quotes, initialDate } = e.data
    portfolioHistory = _portfolioHistory
    generatedSeries = _generatedSeries
    //id addfirstSerie=false, quotes and initialDate will be null
    const portfolioInstance = new PortfolioGenerator(initialDate, quotes)
    const { masterSerie, companiesPerformanceImpact } = portfolioInstance.generateSerie2()
    this.postMessage({ portfolioSeries: masterSerie, companiesPerformanceImpact })

}

class PortfolioGenerator {
    initialDate;
    quotes;
    today;
    date;
    constructor(initialDate, quotes) {
        this.initialDate = initialDate;
        this.quotes = quotes
        this.today = convertUnixToHuman(Date.now())
    }

    setDate = (date) => { this.date = date }
    isFirstDay = () => this.date === this.initialDate
    isToday = () => this.initialDate === this.today
    isTodayFirstDay = () => this.isFirstDay() && this.isToday()
    isWeekend = (date) => {
        const day = new Date(convertHumanToUnixInit(date))
        if (day.getDay() === 6 || day.getDay() === 0) {
            return true
        }
        return false
    }

    getPortfolioStats = () => {
        let masterInfo = {}
        Object.keys(generatedSeries.data.dates).forEach(date => {
            let portfolioCost = 0;
            let portfolioValue = 0;
            let companiesPrice = {}
            generatedSeries.data.dates[date].positions.forEach(asset => {
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
                    if (!portfolioHistory[date]) {
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
                        //else we continue as we should have polyfilled price already set
                    }
                    stockRegister = portfolioHistory[date][asset.ticker.toUpperCase()]
                    stockClosePrice = stockRegister.close

                    if (stockRegister === undefined) {
                        let lastValidPrice = polyfillPrices[asset.ticker]
                        stockClosePrice = lastValidPrice ? lastValidPrice : asset.unitaryCost
                        polyfillPrices[asset.ticker] = stockClosePrice
                    } else {
                        stockClosePrice = stockRegister.close
                        polyfillPrices[asset.ticker] = stockClosePrice
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

    generateSerie2 = () => {
        let masterSerie = {}
        let liquidativeInitial = 1000
        let accruedIncome = 0
        let liquidativeValue
        let companiesPerformanceImpact = {}
        let validDates = []
        const dateKeys = Object.keys(generatedSeries.data.dates)
        const masterInfo = this.getPortfolioStats()
        console.log(masterInfo, "masterInnnfo")

        dateKeys.forEach(date => {

            companiesPerformanceImpact[date] = []
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
                //console.log(lastDate, "luuust")
                lastLiquidativeValue = masterSerie[lastDate].liquidativeValue
            }

            generatedSeries.data.dates[date].positions.forEach(asset => {
                this.setDate(date)
                //
                const stockClosePrice = masterInfo[date].companiesPrice[asset.ticker]

                // aportacion = isFirstRecord ? 0 : this.calculadorMedia(asset, stockClosePrice, lastDate, portfolioValue)
                const aportacion = this.calculadorMedia(asset, stockClosePrice, lastDate, portfolioValue)


                this.addRelativePerformance(companiesPerformanceImpact, date, aportacion, asset)
                //
                valueIncrement += aportacion

            })

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
            }

            validDates = [...validDates, date]
        })
        return { masterSerie, companiesPerformanceImpact }
    }


    generateSerie = () => {

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
        const calculateLiquidative = (asset) => {

        }
        const calculateValue = (asset, isInitial) => {


        }
        dateKeys.forEach((date) => {
            //that could mean is the first date, or it is the last day
            this.setDate(date)
            let portfolioCost = 0
            let portfolioValue = 0
            //when initialDate = today
            generatedSeries.data.dates[date].positions.forEach(asset => {
                let stockClosePrice;
                stocksProcesed = [...stocksProcesed, asset.ticker.toUpperCase()]
                portfolioCost += asset.amount * asset.unitaryCost
                if (this.isTodayFirstDay()) {
                    //la primera serie no debe ser guardada...
                    console.log("ejecutaaao")
                    const stockRegister = this.quotes.find(item => item.ticker === asset.ticker)
                    stockClosePrice = stockRegister.priceInfo.adjClose
                }
                else {
                    if (!portfolioHistory[date]) {
                        return
                    }
                    const stockRegister = portfolioHistory[date][asset.ticker.toUpperCase()]
                    stockClosePrice = stockRegister.close
                    //stockRegister shouldn't be undefined anymore


                    if (stockRegister === undefined) {
                        let lastValidPrice = polyfillPrices[asset.ticker]
                        stockClosePrice = lastValidPrice ? lastValidPrice : asset.unitaryCost
                        polyfillPrices[asset.ticker] = stockClosePrice
                    } else {
                        stockClosePrice = stockRegister.close
                        polyfillPrices[asset.ticker] = stockClosePrice
                    }
                }
                console.log(asset.ticker, stockClosePrice, "paro ka")
                const positionVal = stockClosePrice * asset.amount
                portfolioValue += positionVal
            })
            if (this.isTodayFirstDay()) {
                //si pasa por aqui tenemos que prependear portfolioCost = portfolioValue, liquidativeValue = 1000, but lets do it into the chart component directly
                const initialPerformance = portfolioValue / portfolioCost
                liquidativeValue = liquidativeInitial * initialPerformance
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


            companiesPerformanceImpact[date] = []
            let valueIncrement = 0
            let lastLiquidativeValue
            let lastDate;
            if (!validDates.length) {
                lastLiquidativeValue = 1000
            } else {
                lastDate = validDates[validDates.length - 1]
                console.log(validDates, lastDate, "ka ous")
                //console.log(lastDate, "luuust")
                lastLiquidativeValue = masterSerie[lastDate].liquidativeValue
            }
            //calculate portfolioValue and costs
            //calculate liquidative Value
            //T Esto sale nulo el primer día
            generatedSeries.data.dates[date].positions.forEach(asset => {
                let stockClosePrice;
                let aportacion;
                let stockRegister;
                if (this.isTodayFirstDay()) {
                    stockRegister = this.quotes.find(item => item.ticker === asset.ticker)
                    stockClosePrice = stockRegister.priceInfo.adjClose
                    aportacion = this.calculadorMedia(asset, stockClosePrice, lastDate, portfolioValue)
                } else {
                    let isFirstRecord = false
                    // if (!stocksProcesed.includes(asset.ticker.toUpperCase())) {
                    //     stocksProcesed = [...stocksProcesed, asset.ticker.toUpperCase()]
                    //     isFirstRecord = true
                    // }

                    if (!portfolioHistory[date]) {
                        return
                    }
                    stockRegister = portfolioHistory[date][asset.ticker.toUpperCase()]

                    if (stockRegister === undefined) {
                        stockClosePrice = polyfillPrices[asset.ticker]
                    } else {
                        stockClosePrice = stockRegister.close
                        //polyfillPrices[asset.ticker] = stockClosePrice
                    }

                    aportacion = isFirstRecord ? 0 : this.calculadorMedia(asset, stockClosePrice, lastDate, portfolioValue)
                }

                // if (stockClosePrice === undefined) {
                //     stockClosePrice = getLastValidPrice(asset.ticker.toUpperCase())
                // }
                valueIncrement += aportacion
                this.addRelativePerformance(companiesPerformanceImpact, date, aportacion, asset)

            })
            console.log(valueIncrement, "incrementovalor")
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


        })
        console.log(companiesPerformanceImpact, "perfi")

        return { masterSerie, companiesPerformanceImpact }
    }

    getLastPrice = (lastDate, asset) => {
        if (!portfolioHistory[lastDate]) {
            return asset.unitaryCost
        }
        const theresLastPrice = portfolioHistory[lastDate][asset.ticker.toUpperCase()]
        if (theresLastPrice) {
            return portfolioHistory[lastDate][asset.ticker.toUpperCase()].close
        }
        return polyfillPrices[asset.ticker]
    }

    calculadorMedia = (asset, stockPrice, lastDate, portfolioValue) => {

        //console.log(asset.amount, asset.price, portfolioValue, date, lastDate, asset.ticker, "rururu")
        //console.log(portfolioHistory, "historria")
        const relativeSize = (asset.amount * stockPrice) / portfolioValue
        let lastPrice;
        if (this.isTodayFirstDay()) {
            lastPrice = asset.unitaryCost
        } else {
            lastPrice = this.getLastPrice(lastDate, asset)
        }
        const change = (stockPrice - lastPrice) / lastPrice
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
}

const convertUnixToHuman = (unix) => {
    const d = new Date(unix)
    const handleDoubleDigit = (num, isMonth = false) => {
        //solve retard javascript month index starting at 0
        if (isMonth) {
            if (num === 11) {
                return (num + 1).toString()
            }
            num++
        }
        return num.toString().length === 1 ?
            `0${num.toString()}`
            :
            num.toString()
    }
    const monthNum = handleDoubleDigit(d.getMonth(), true)
    const dayNum = handleDoubleDigit(d.getDate())

    return d.getFullYear() + '-' + (monthNum) + '-' + dayNum
}


const convertHumanToUnixInit = (date) => {
    const actualDate = date.split("-")
    const mongol = parseInt(actualDate[1]) - 1
    const formatedDate = new Date(
        actualDate[0],
        mongol.toString(),
        actualDate[2]
    );
    return formatedDate.getTime();
}



//when generatedSeries has length 1 means our portfolio was created today.
//portfolio history won't have any register
//generating a provisional chart is easy, two points from 1000 to 1000*(price-cost)
//so when user buys something the first day, we display the chart showing 1000 to the price that has currently in that moment (x axis will be in datetime)


//when generatedSeries has length 2 means our portfolio was created yesterday.
//portfolio history will have 1 register, and the price chart will show 1 point. We need to again get today's missing portofolioHistorypoint with the current price in the moment (fetch every time component is rendered)


//if we are in the first day we need to fetch quotes for every ticker,

//**las acciones que se compran el fin de semana se dejan en espera, ya que queremos eliminar los findes de las generatedSeries

//al final el initialDate ya no es hoy, las series se crearan como antes. 
const isInitialDate = (intialDate) => {
    const today = convertUnixToHuman(Date.now())
    if (initialDate === today) {
        return true
    }
    return false
}

