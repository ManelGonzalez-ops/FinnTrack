const path = require("path")
const { findUser } = require("../../db/services")
const { uploadImage, addContactInfo, getUserDetailsDB, getUserImageDB } = require("../../db/services/UserService")
const uploadImg = async (req, res, next) => {
    const { email } = req.body
    if (!req.file) {
        next(new Error("server received no image"))
    }
    try {
        const userId = await findUser(email)
        await uploadImage(userId, req.file)
        // console.log(path.join(__dirname, "../", req.file.path), "diirname")
        res.status(200).sendFile(path.join(__dirname, "../", req.file.path))
        // res.status(200).send("image uploaded succesfully to database")
    }
    catch (err) {
        next(new Error(err))
    }
}

const completeInfo = async (req, res) => {
    const infoClass = new UserInfo(req, res)
    await infoClass.completeInfo()
}

const getUserInfo = async (req, res) => {
    const infoClass = new UserInfo(req, res)
    await infoClass.getUserInfo()
}
const getUserImage = async (req, res) => {
    const infoClass = new UserInfo(req, res)
    await infoClass.getUserImage()
}

class UserInfo {

    constructor(req, res) {
        this.req = req
        this.res = res
    }

    fieldFactory = ({ country, gender, dateBirth, firstName, lastName }) => {
        let body = {};
        if (country) body.country = country;
        if (gender) body.gender = gender;
        if (dateBirth) body.nacimiento = dateBirth;
        if (firstName) body.firstName = firstName;
        if (lastName) body.lastName = lastName;
        return body
    }

    getUserId = async (email) => {
        try {
            const userId = await findUser(email)
            return userId
        }
        catch (err) {
            return this.res.status(400).send(err.message)
        }
    }

    completeInfo = async () => {
        const { email } = this.req.body
        console.log(email, "elemaail")
        const fieldsToUpdate = this.fieldFactory(this.req.body)
        const userId = await this.getUserId(email)
        try {
            await addContactInfo(userId, fieldsToUpdate)
            return this.res.status(200).send({ msg: "succes bibor" })
        }
        catch (err) {
            return this.res.status(400).send(err.message)
        }
    }

    getUserInfo = async () => {
        const { email } = this.req.body
        const userId = await this.getUserId(email)
        try {
            const userInfo = await getUserDetailsDB(userId)
            console.log("userInfo", userInfo)
            return this.res.status(200).send(userInfo[0])
        }
        catch (err) {
            return this.res.status(400).send(err.message)
        }
    }


    getUserImage = async () => {
        const { email } = this.req.body
        const userId = await this.getUserId(email)
        try {
            const imagePath = await getUserImageDB(userId)
            console.log("imagePath", imagePath)
            return this.res.status(200).sendFile(path.join(__dirname, "../", imagePath))
        }
        catch (err) {
            return this.res.status(400).send(err.message)
        }
    }


}

module.exports = { uploadImg, completeInfo, getUserInfo, getUserImage }