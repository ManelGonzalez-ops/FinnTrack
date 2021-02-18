const { checkEmailExists, checkUserExists } = require("../../db/services/validationServices")

const emailValidator = async (req, res) => {
    console.log(req.body, "boody email")
    const { email } = req.body
    try {
        await checkEmailExists(email)
        res.status(200).send({error: false, msg: "email is valid"})
    }
    catch (err) {
        res.status(200).send({error: true, msg: err})
    }
}
const userValidator = async (req, res) => {
    console.log(req.body, "boody email")
    const { email } = req.body

    checkUserExists(email)
        .then(() => {
            res.status(200).send("username is valid")
        })
        .catch(err => {
            res.status(400).send(err)
        })
}

module.exports = { emailValidator, userValidator }