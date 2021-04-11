const express = require("express")
const { uploadImg, completeInfo, getUserInfo, getUserImage } = require("../controllers/Users")
const {upload} = require("../middlewares/imageUpload")
const router = express.Router()

router.use("/upload", upload.single("image"))
router.route("/upload")
.post(uploadImg)

router.route("/complete")
.post(completeInfo)

router.route("/populate")
.post(getUserInfo)

router.route("/image")
.post(getUserImage)


module.exports = router