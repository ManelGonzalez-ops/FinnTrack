const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { getUser, storeNewUser } = require("../../db/services/AuthService")

const login = async (req, res) => {
    console.log("received")
    const { email, password } = req.body
    try {

        const { username, hashedPwd } = await getUser(email)
        //here we check if user is registered
        //email and username match existing account
        //make sure password is correct
        await comparePassword(password, hashedPwd)
        //we generate a token
        //we don't really need to sign the username
        const token = jwt.sign({ username, email }, "caranchoa")
        res.status(200).send({ token })
    }
    catch (err) {
        res.status(400).send(err)
    }
}
const comparePassword = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {

        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) reject(err);
            if (!result) reject("password is incorrect")
            if (result) resolve()
        })
    })
}
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

const hashPassword = (password) => {
    const saltRounds = 12
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) { reject(err) }
            bcrypt.hash(password, salt, (err, hashedPwd) => {

                if (err) { reject(err) }
                console.log(hashedPwd, "hashed password")
                resolve(hashedPwd)
            })
        })
    })
}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        //we have to check that email & username doesn't exists yet
        const hashedPwd = await hashPassword(password)
        await storeNewUser({ username, email, hashedPwd })
        const token = jwt.sign({ username, password }, "caranchoa")
        return res.status(200).send({ token })
    }
    catch (err) {
        console.log(err)
        return res.status(400).send(err.message)
    }

}

class Register {

    constructor() {

    }


}

module.exports = { login, protectedRoute, unpackToken, register }