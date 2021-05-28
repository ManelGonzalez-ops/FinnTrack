const multer = require("multer");
const fetch = require("node-fetch");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({ 
    cloud_name: 'dt64i9m5y', 
    api_key: '387248965797718', 
    api_secret: 'CEXL106_-PBkU-Pm-q4m-rzeVfQ' 
  });

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}---${file.originalname}`);
    },
});

// const upload = multer({ storage: fileStorage });
const upload = multer();

const updloadCloud = async (req, res, next) => {
    console.log(req.file, "uploads body");
    console.log(req.body, "uploads bodyy");
    const image = req.file;
    const { secure_url } = await streamUpload(req)
        .catch((err) => {
            console.error(err);
            return res.status(404).send(err.message);
        });
    console.log(secure_url, "putatatatatat");
    req.imageUrl = secure_url;
    next();
};

const streamUpload = (req) => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
        (error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        },
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
});

module.exports = { upload, updloadCloud };
