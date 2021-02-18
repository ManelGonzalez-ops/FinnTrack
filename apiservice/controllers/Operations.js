const { getOperations, findUser, addPortfolioDB, updatePortfolioDB, portfolioExists, addOperation } = require("../../db/services")
const { getUserInterests } = require("../../db/services/interestsService")
const { prepareStoredOperations, setInitialPossesions } = require("../dataPreparation")
const { convertUnixToHuman } = require("../dataUtils")

const getReadyOperations = async (req, res) => {
    const { email } = req.body
    console.log(email, "emaillll")
    try {
        const operations = await getOperations(email)
        const interests = await userInterests(email)
        if (operations) {
            console.log(operations, "operatiuns")
            const readyOperations = prepareStoredOperations(operations)
            const { uniqueStocks, currentStocks, userCash } = setInitialPossesions(operations)
            res.status(200).send({ readyOperations, uniqueStocks, currentStocks, userCash, interests })
        } else {
            res.status(400).send("error esto viene vacio", operations)
        }
    } catch (err) {
        res.status(400).send(err, "errur")
    }
}

const userInterests = async (email) => {
    const data = await getUserInterests(email)
    return data.length ?
        JSON.parse(data[0].interests_arr)
        :
        null
}

//creo ue no necesitamos esto
const updatePortfolio = async (req, res) => {
    const { email, portfolio } = req.body
    const today = convertUnixToHuman(Date.now())
    console.log(today, "hoyy beiba")
    try {

        const userId = await findUser(email)
        const alreadyInDB = await portfolioExists(userId)
        if (alreadyInDB) {
            await updatePortfolioDB(userId, portfolio, today)
        } else {
            await addPortfolioDB(userId, portfolio, today)
        }
        res.status(200).send("OK")

    }
    catch (err) {
        res.status(400).send(err.message)
        throw new Error(err.message)
    }
}

const addOperationDB = (req, res) => {
    const email = req.body.user
    console.log(req.body.user, "la faking user")
    console.log(req.body.order, "la faking order")
    //const {operationType, ticker, amount, price} = req.body.order
    findUser(email)
        .then(userId => {
            console.log(userId, "el poto id")
            return addOperation(req.body.order, userId)
        })
        //if this sends success, will update context api state
        .then(() => res.status(200).json("success"))
        .catch(err => res.status(400).send(err.message))
}


module.exports = { getReadyOperations, updatePortfolio, addOperationDB }