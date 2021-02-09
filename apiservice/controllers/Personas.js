const { getAllOperations } = require("../../db/services")
const Logic = require("../logic/state.js")
const fs = require("fs")

const listPeople = (req, res) => {
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

const makePortfolio = async (req, res) => {
    const logicInstance = new Logic()
    try {
        const peopleCollection = await logicInstance.initAll()
        res.status(200).send(peopleCollection)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

const showUsers = (req, res) => {
    const rawData = fs.readFileSync("porfolios.json")
    const data = JSON.parse(rawData)
    return res.status(200).send(data)
}
const showUser = (req, res) => {
    const { id } = req.params
    const logicInstance = new Logic()
    logicInstance.initOne(id)
        .then(data => {
            return res.status(200).send(data)
        })
        .catch(err => res.status(400).send(err))
}

module.exports = { listPeople, makePortfolio, showUsers, showUser }