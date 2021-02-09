const { prepareStoredOperations, setInitialPossesions } = require("../dataPreparation")
const fs = require("fs")
const { getAllUsers, getAllOperations, getOperations, findUser, getOperationsByUserId, findUserById, getOutdatedPortfoliosDB, addPortfolio, portfolioExists, updatePortfolioDB } = require("../../db/services")
const PricesServer = require("./prices")
const PossesionsSeries = require("./posesionsSeries")
const Portfolio = require("./portfolioPrices")
const { convertUnixToHuman } = require("../dataUtils")


class Logic {

    people
    //
    user
    //
    operations
    userOperations
    prices
    posessionsSeries
    portfolio
    today
    upToDatePortfolios = []
    outdatedPortfolios = []
    masterObj = []
    fechaPrueba1 = "2021-2-4"
    fechaPrueba2 = "2021-2-7"
    fechaPrueba3 = "2021-2-8"
    constructor() {
        this.today = convertUnixToHuman(Date.now())
    }

    async initAll() {
        this.people = await this.getUsers()
        this.operations = await this.getUsersOperations()
        return this.dispatchUsers()
    }

    async initOne(id) {
        this.user = await findUserById(id)
        this.operations = await getOperationsByUserId(id)
        await this.dispatchUsers(true)
        return { prices: this.prices, possesionsSeries: this.posessionsSeries, portfolio: this.outdatedPortfolio, user: this.user }
    }

    async getUsers() {
        try {
            return await getAllUsers()
            //console.log(usersReq, "putos people")
            //const people = await usersReq.json()
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async getUsersOperations() {
        try {
            return await getAllOperations()
            //const operations = await operationReq.json()
        }
        catch (err) {
            throw new Error(err.message)
        }
    }
    async classifyPortfoliosByStats() {
        const allPortfoliosReq = await getAllPortfolios()
        const allPortfolios = allPortfoliosReq.map(item => item[0])
        allPortfolios.forEach(row => {
            console.log(row["last_updated"], "fecha portfolio last updated")
            if (row["last_updated"] === this.today) {
                this.upToDatePortfolios.push(row)
            } else {
                this.outdatedPortfolios.push(row)
            }
        })
    }

    handleUpToDatePortfolios() {
        upToDatePortfolios.forEach(row => {
            const userInfo = this.people.find(user => user.userId === row.userId)
            this.masterObj.push({ user: userInfo, portfolio })
        })
    }

    async dispatchUsers(individual = false) {

        if (individual) {
            await this.getUserData(this.operations)
            return
        }
        await this.classifyPortfoliosByStats()
        this.handleUpToDatePortfolios()
        await this.handleOutdatedPotfolios()
        return this.masterObj
        //this.storeJson()
    }

    handleOutdatedPotfolios = async () => {
        for (let row of this.outdatedPortfolios) {
            const userOps = this.operations.filter(op => op.userId === row.userId)

            //if user has operations we generate portfolio
            console.log(row, "userrrnmae")
            //si el usuario no ha realizado operaciones tampoco tendrñia portofolio por lo que la comprobavion userOps.length es redundante
            const updatedPortfolio = await this.getUserData(userOps)
            //en principio en caso de que el usuario haya operado, su portfolio ya existe, (a no ser que cuando realizara la operacion el cliente cerrara la app antes de que el nuevo portfolio fuera generado en el cliente o que la base de datos fallara en gurdarlo)
            await updatePortfolioDB(user.userId, updatedPortfolio, this.today)
            const user = this.people.find(user => user.userId === row.userId)
            this.masterObj.push({ user: user, portfolio: updatedPortfolio })
        }
    }


    async getUserData(userOps) {
        this.userOperations = userOps
        const { readyOperations,
            uniqueStocks,
            currentStocks,
            userCash } = this.structureData()
        await this.getPricesHistory(currentStocks)
        await this.getGeneratedPossesions(readyOperations)
        return this.getPortfolioSeries()
    }

    structureData() {
        const readyOperations = prepareStoredOperations(this.userOperations)
        const { uniqueStocks, currentStocks, userCash } = setInitialPossesions(this.userOperations)
        return { readyOperations, uniqueStocks, currentStocks, userCash }

    }

    async getPricesHistory(currentStocks) {
        const priceInstance = new PricesServer(currentStocks)
        this.prices = await priceInstance.getPraices()
    }

    async getGeneratedPossesions(userActivity) {
        const possesionsSeries = new PossesionsSeries(userActivity)
        this.posessionsSeries = await possesionsSeries.init()
    }

    getPortfolioSeries() {
        const porfolioSeries = new Portfolio(this.prices, this.posessionsSeries)
        return porfolioSeries.init()
    }

    storeJson() {
        fs.writeFileSync("porfolios.json", JSON.stringify(this.masterObj))
    }
}

module.exports = Logic