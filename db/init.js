
const { createUserTable, addNewUser, findUser, addOperation, createOperationTable, getOperations, addCompanyInfo, getCompanyInfo, createCompanyInfo, createCompaniesJsonTable, getMostActives, storeMostActives, deletePreviousDateRecord, createPortfolioTable } = require("./services")
const { createInterestTable } = require("./services/interestsService")
const { createPostRegister, createPostStructure } = require("./services/PostServices")
const { createUserDetails } = require("./services/UserService")

const initDb = () => {
    createUserTable((err) => {
        console.log("que concha")
        if (err) {
            console.log(err, "error al crear usuarios")
        }
    })
    createOperationTable((err) => {
        console.log("que conchu")
        if (err) {
            console.log(err, "error al crear usuarios")
        }
    })
    createCompanyInfo((err) => {
        console.log("que conchu")
        if (err) {
            console.log(err, "error al crear usuarios")
        }
    })
    createCompaniesJsonTable((err) => {
        console.log("que conchu")
        if (err) {
            console.log(err, "error al crear usuarios")
        }
    })
    createPortfolioTable((err) => {
        console.log("que conchu")
        if (err) {
            console.log(err, "error al crear portfolios")
        }
    })
    createInterestTable((err) => {
        console.log("que conchu")
        if (err) {
            console.log(err, "error al crear portfolios")
        }
    })
    createPostRegister((err) => {
        console.log("que conchu")
        if (err) {
            console.log(err, "error al crear portfolios")
        }
    })
    createPostStructure((err) => {
        console.log("que conchu")
        if (err) {
            console.log(err, "error al crear portfolios")
        }
    })
    createUserDetails((err) => {
        console.log("que conchu")
        if (err) {
            console.log(err, "error al crear portfolios")
        }
    })

}

module.exports = {initDb}
