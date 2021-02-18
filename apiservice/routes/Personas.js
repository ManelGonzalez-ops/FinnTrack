const {listPeople, makePortfolio, showUsers, showUser} = require("../controllers/Personas")

const express = require("express")

const router = express.Router()

router.route("/")
.get(listPeople)

router.route("/porfolio")
.get(makePortfolio)

router.route("/main")
.get(makePortfolio)

router.route("/:id")
.get(showUser)

module.exports = router