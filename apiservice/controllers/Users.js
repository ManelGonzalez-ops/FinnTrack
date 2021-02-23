const path = require("path")
const { findUser } = require("../../db/services")
const { uploadImage } = require("../../db/services/UserService")
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

module.exports = { uploadImg }