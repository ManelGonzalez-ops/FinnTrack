const jwt = require("jsonwebtoken")
const { getUser } = require("../../db/services/AuthService")
const login = (req, res) => {
    console.log("received")
    const { email } = req.body
    try {

        const { username } = getUser(email)
        //here we check if user is registered
        //email and username match
        //we generate a token
        const token = jwt.sign({ username, email }, "caranchoa")
        res.send({ token })
    }
    catch (err) {
        res.status(400).send(err.message)
    }
}
const comparePassword = () => null
const protectedRoute = (req, res) => {
    console.log(req.token, "ell tokeeun")
    jwt.verify(req.token, "caranchoa", (err, decoded) => {
        if (err) {
            //if we put send instead of json the error won't be handle by .catch in the frontend, which is a fuckery
            return res.status(400).json("error token not valid")
        }
        return res.status(200).send({ message: "authorized", userData: decoded })
    })
}

const unpackToken = (req, res, next) => {
    console.log(req.method)
    //if (req.method === "GET") { next() }
    const bearer = req.headers["authorization"]
    if (!bearer) {
        res.status(400).send("no authorization headers")
    }
    console.log(bearer, "el bearer")
    const token = bearer.split(" ")[1]
    req.token = token
    next()
}
module.exports = { login, protectedRoute, unpackToken }