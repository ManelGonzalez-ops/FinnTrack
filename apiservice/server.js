const express = require("express");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const passport = require("passport");
const {
  fetcharH, fetcharM
} = require("./controller");

const peopleRoutes = require("./routes/Personas.js");
const operationRoutes = require("./routes/Operations.js");
const pricesRoutes = require("./routes/Prices.js");
const validationRoutes = require("./routes/Validation");
const interestsRoutes = require("./routes/Interests");
const postsRoutes = require("./routes/Posts");
require("./db/db");
const authRoutes = require("./routes/Auth");
const usersRoutes = require("./routes/Users");
const { handleError } = require("./handleError");
const { initDb } = require("./db/init");
const recurringTaskRoutes = require("./routes/RecurringTask");
const runScheduledTasks = require("./ScheduledTasks")

initDb();
runScheduledTasks();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}---${file.originalname}`);
  },
});

const upload = multer({ storage: fileStorage });
// añadidos al hacer lo del okta
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
// app.use(express.json())

app.use(passport.initialize());

app.use("/api/v1/people", peopleRoutes);
app.use("/api/v1/operations", operationRoutes);
// the url has to change to prices, is better name
app.use("/api/v1/prices", pricesRoutes);
app.use("/api/v1/validation", validationRoutes);
app.use("/api/v1/interests", interestsRoutes);
app.use("/api/v1/posts", postsRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/recurringTasks", recurringTaskRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));


app.post("/uploads/single", upload.single("image"), (req, res) => {
  console.log(req.file, "fiiiile");
  res.status(200).send("single image upload success");
});

app.get("/", (req, res)=>{
  res.send("welcome to finnTrack backend");
})


// ojo aqui si existe query: "?dates=true" no buscaremos precios historicos,
// app.post("/portfolio", async (req, res) => {
//   const tickerList = req.body;
//   console.log(req.body, "body");
//   console.log(tickerList, "tickrr");
//   const metadataArrPromise = tickerList.map((ticker) => fetcharM(ticker));
//   const { dates } = req.query;
//   // ojo esto puede haber error
//   let metadataArr;
//   try {
//     metadataArr = await Promise.all(metadataArrPromise);
//     // console.log(metadataArr, "metadata")
//     if (!metadataArr.length) {
//       return res.status(400).send("no metadata found");
//     }
//   } catch (err) {
//     return res.status(404).send({ err });
//   }

//   if (dates) {
//     return res.status(200).send(metadataArr);
//   } else {
//     try {
//       const pricesArrPromise = metadataArr.map((item) => fetcharH(item.ticker, item.startDate, item.endDate, true));

//       const pricesArrs = await Promise.all(pricesArrPromise);
//       if (pricesArrs.length >= 0) {
//         return res.status(200).send(pricesArrs);
//       } else {
//         console.log(pricesArrs, "error no result prices");
//         return res.status(400).send("no prices found");
//       }
//     } catch (err) {
//       console.log(err, "fallo1");
//       return res.status(400).send(err.message, "fallo2");
//     }
//   }
// });


app.use((err, res, next) => {
  console.log(err.message);
  handleError(err, res);
});

const PORT = process.env.PORT || 8001
app.listen(PORT, () => {
  console.log("essto funca, running port ", PORT);
});
