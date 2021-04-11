const { getAllOperations, getOperationsByUserId } = require("../../db/services")
const Logic = require("../logic/state.js")
const fs = require("fs")
const { prepareStoredOperations, setInitialPossesions } = require("../dataPreparation")

const listPeople = (req, res) => {
    console.log("ejecutao 4")
    getAllOperations()
        .then(data => {
            console.log(data, "personas")
            res.status(200).send(data)
        })
        .catch(err => {
            console.log(err)
            res.status(400).send(err)
        }
        )
}


const makePortfolio = async (req, res, next) => {
    console.log("ejecutao 1")
    try {
        const logicInstance = new Logic()
        const peopleCollection = await logicInstance.initAll()
        //console.log(peopleCollection, "q cohone")
        res.status(200).send(peopleCollection)
    }
    catch (err) {
        next(err)
        //res.status(400).send(err.message)
    }
}

const showUsers = (req, res) => {
    console.log("ejecutao 2")
    const rawData = fs.readFileSync("porfolios.json")
    const data = JSON.parse(rawData)
    return res.status(200).send(data)
}
const showUser = async (req, res, next) => {
    console.log("ejecutao 3")
    try {
        const { id } = req.params
        const additionalStats = await getCurrentPosessions(id)
        const logicInstance = new Logic()
        logicInstance.initOne(id)
            .then(data => {
                return res.status(200).send({ ...data, ...additionalStats })
            })
            .catch(err => next(err))
    }
    catch (err) {
        next(err)
    }
}

const getCurrentPosessions = async (id) => {
    try {
        const operations = await getOperationsByUserId(id)
        const readyOperations = prepareStoredOperations(operations)
        const { uniqueStocks, currentStocks, userCash } = setInitialPossesions(operations)
        return { readyOperations, uniqueStocks, currentStocks, userCash }
    } catch (err) {
        throw new Error(err)
    }

}

module.exports = { listPeople, makePortfolio, showUsers, showUser }