const { fetcharH, fetcharM } = require("../controller")
const { getUserByUsername, getPortfoliosByIds, proba } = require("../../db/services")

const getTickerPrices = async (req, res) => {
    const possesions = req.body
    console.log(possesions, "posesionses ostia")
    //console.log(req.body, "body")
    const { dates, missingTicker } = req.query
    let metadataArrPromise

    metadataArrPromise = possesions.map(item => fetcharM(item.ticker))

    //ojo esto puede haber error
    let metadataArr;
    try {
        metadataArr = await Promise.all(metadataArrPromise)
        //console.log(metadataArr, "metadata")
        //console.log(metadataArr, "laametaaaadata")
        if (!metadataArr.length) {
            return res.status(400).send("no metadata found")
        }
    }
    catch (err) {
        return res.status(404).send({ err })
    }

    if (dates) {
        return res.status(200).send(metadataArr)

    } else {
        try {
            // console.log(possesions, "poooossesion")
            // const pricesArrPromise = metadataArr.map((item) => {
            //     console.log(item.ticker, "tickuu")
            //     const startDate = possesions.find(asset =>
            //         asset.ticker.toUpperCase() === item.ticker.toUpperCase()
            //     ).date


            //     console.log(startDate, "la puta startdate")
            //     console.log(startDate, item.endDate, "startandenddddd")
            //     return fetcharH(item.ticker, startDate, item.endDate, true)
            // }
            // )

            // const pricesArrs = await Promise.all(pricesArrPromise)
            // if (pricesArrs.length >= 0) {
            //     return res.status(200).send(pricesArrs)
            // } else {
            //     console.log(pricesArrs, "error no result prices")
            //     return res.status(400).send("no prices found")
            // }
            const priceInstance = new PriceService(possesions, "puta2") 
            const pricesCollection = await priceInstance.init()
            res.status(200).send(pricesCollection)
        }
        catch (err) {
            console.log(err, "fallo1")
            return res.status(400).send(err.message, "fallo2")
        }
    }
}

const pruebaPort = (req, res) => {
    const possesions = req.body
    const priceInstance = new PriceService(possesions, "puta1")
    priceInstance.init()
}

//not in routes
class PriceService {

    possesions
    metadata
    assets = {
        stocks: [],
        portfolioFunds: []
    }

    usersPortfolioIds = []

    constructor(possesions, koko) {
        this.possesions = possesions
        console.log(possesions, koko, "posesions classe iniciada")
    }


     handleTickers = async()=> {
        await this.getMetadata()
        const prices = await this.getPrices()
        return prices
    }

     handlePortfolioFunds = async ()=> {
       return await this.getPortfoliosCotizacion()
    }

    async init() {
        try {
            this.filterAssetType()
            const funcArr = [this.handleTickers, this.handlePortfolioFunds]
            const prices = await Promise.all(funcArr.map(func => func()))
            const mergedPrices = prices.map(item=>[...item])
            //console.log(JSON.stringify(prices, null, 2), "acabaaao")
            const mergedSeries = this.mergeSeries(mergedPrices)
            //console.log(mergedSeries, "acabaaao")
            return mergedSeries
        }

        catch (err) {
            return this.errorCatcher(err.message)
        }
    }

    mergeSeries(mergedPrices){
        let mergedSeries = []
        mergedPrices.forEach(typeCollection=>{
            mergedSeries = [...mergedSeries, ...typeCollection]
        })
        return mergedSeries
    } 



    filterAssetType() {
        console.log(this.possesions, "poosis")
        this.possesions.forEach(asset => {
            asset.assetType === "stock" ?
                this.assets.stocks.push(asset)
                :
                this.assets.portfolioFunds.push(asset)
        })
    }

    async getPortfoliosCotizacion() {
       // console.log("pero que mielda")
        const usernames = this.assets.portfolioFunds.map(item => item.ticker)
        //console.log(usernames, "usernames")
        try {
            const promiseUserArr = usernames.map(username => getUserByUsername(username))
            const usirs = await Promise.all(promiseUserArr)
            //console.log(usirs, "usuuuarios")
            const users = usirs.map(user => user[0])
            const promisePortfolioArr = users.map(user => this.getPortfolios(user.userId))
            const portfoliosArr = await Promise.all(promisePortfolioArr)
            console.log(portfoliosArr, "portarrrrr")
            const portfoliosParsed = portfoliosArr
                .map(item => item[0])
                .map(item => {
                    item.portfolio = JSON.parse(item.portfolio)
                    return item
                })

            const readyPortfolio = this.addMissingInfo(users, portfoliosParsed)
            return this.getPortfoliosSeries(readyPortfolio)

        }

        catch (err) {
            console.log(err, "errroru")
        }

    }

    addMissingInfo = (users, portfolios) => {
        let portfolioWithUser = []
        users.forEach(user => {
            portfolios.forEach(portfoItem => {
                if (portfoItem.userId === user.userId) {
                    const selection = this.assets.portfolioFunds.find(item => item.date)
                    const startDate = selection.date
                    //we just really need startDate
                    portfolioWithUser = [...portfolioWithUser,
                    {
                        ...portfoItem,
                        username: user.username,
                        startDate
                    }
                    ]
                }
            })
        })
        return portfolioWithUser
    }

    async getPortfolios(userIds) {
        console.log(userIds, "iduser")
        const portfoliosArr = await getPortfoliosByIds(userIds)
        console.log(portfoliosArr, "que conxiiiiiii")
        return portfoliosArr
    }

    getPortfoliosSeries = (portfolios) => {
        const dataReady = []
        portfolios.forEach(porf => {
            const { startDate, portfolio, username } = porf
            let pricePoints = []
            let enter = false
            Object.keys(portfolio).forEach(date => {
                if (date === startDate) {
                    enter = true
                }
                if (enter) {
                    const price = portfolio[date].liquidativeValue
                    pricePoints = [
                        ...pricePoints,
                        {
                            date,
                            close: price,
                        }
                        
                    ]
                }
            })
            dataReady.push({[username]: pricePoints})
        })
       //console.log(dataReady, "lo teniim")
        return dataReady
    }

   async getMetadata() {
      console.log(this.assets.stocks, "the stocks")
        const tickersArr = this.assets.stocks.map(item => fetcharM(item.ticker))
        try {
            const metadataArr = await Promise.all(tickersArr)
            //console.log(metadataArr,metadataArr.length, "la pota metadata")
            if (metadataArr.length > 0) {
                this.metadata = metadataArr
                return metadataArr
            } else {
                throw new Error("metada is empty")
            }
            //console.log(metadataArr, "metadatauu")

        }
        catch (err) {
            throw new Error(err.message)
        }
    }

    //not in routes
    getPrices = async () => {
        try {
            // console.log(this.possesions, "poooossesion")
            // console.log(this.metadata, "meeetaaa")
            const pricesArrPromise = this.metadata.map((item) => {
                const startDate = this.assets.stocks.find(asset =>
                    asset.ticker.toUpperCase() === item.ticker.toUpperCase()
                ).date
                    console.log(startDate, "fecha inicio")
                return fetcharH(item.ticker, startDate, item.endDate, true)
            }
            )

            const pricesArrs = await Promise.all(pricesArrPromise)
            if (pricesArrs.length >= 0) {
                return pricesArrs
            } else {
                throw new Error("prices are empty")
            }
        }
        catch (err) {
            throw new Error(err.message)
        }
    }



    errorCatcher(err) {
        throw new Error(err)
    }
}

module.exports = {
    PriceService,
    getTickerPrices,
    pruebaPort
}