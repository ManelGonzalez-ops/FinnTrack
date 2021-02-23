const express = require("express")
const { uploadImg } = require("../controllers/Users")
const {upload} = require("../middlewares/imageUpload")
const router = express.Router()

router.use("/upload", upload.single("image"))
router.route("/upload")
.post(uploadImg)

module.exports = router