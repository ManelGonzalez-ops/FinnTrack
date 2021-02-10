const { getAllOperations } = require("../../db/services")
const Logic = require("../logic/state.js")
const fs = require("fs")

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

const makePortfolio = async (req, res) => {
    console.log("ejecutao 1")
    try {
        const logicInstance = new Logic()
        const peopleCollection = await logicInstance.initAll()
        res.status(200).send(peopleCollection)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

const showUsers = (req, res) => {
    console.log("ejecutao 2")
    const rawData = fs.readFileSync("porfolios.json")
    const data = JSON.parse(rawData)
    return res.status(200).send(data)
}
const showUser = (req, res) => {
    console.log("ejecutao 3")
    const { id } = req.params
    const logicInstance = new Logic()
    logicInstance.initOne(id)
        .then(data => {
            return res.status(200).send(data)
        })
        .catch(err => res.status(400).send(err))
}

module.exports = { listPeople, makePortfolio, showUsers, showUser }