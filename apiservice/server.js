const express = require("express")
const app = express()
const cors = require("cors")
const { fetcharS, fetcharP, fetcharN, fetcharH, fetcharM } = require("./prueba")

app.use(cors())
//app.use(express.json())
app.get("/", (req, res) => {
    res.status(200).send("xuucla nena")
})

app.get("/search/:word", async (req, res, next) => {
    console.log(req.params.word)
    try {
        const data = await fetcharS(req.params.word)
        if (data) {
            console.log(data, "comeee nena")
            res.send({ data })
        } else {
            console.log(data, "el error que es")
        }
    }
    catch (err) {
        res.status(404).send({ err: err })
    }
})

// app.get("/prices/:ticker", async (req, res) => {
//     try {
//         const data = await fetcharP(req.params.ticker)
//         if (data) {
//             console.log(data, "comeee nena")
//             res.send({ data })
//         } else {
//             console.log(data, "el error que es")
//         }
//     }
//     catch (err) {
//         res.status(404).send({ err: err })
//     }
// })
app.get("/prices/:ticker", async (req, res) => {
    try {
        const ticker = req.params.ticker
        const metaData = await fetcharM(ticker)
        if (metaData) {
            console.log(metaData, "comeee nena")
            const { startDate, endDate } = metaData
            try {
                const data = await fetcharH(ticker, startDate, endDate)
                if(data){
                    res.send({ data })
                }
                else{
                    console.log(metaData, "errur")
                }
            }
            catch(err){
                res.status(404).send({ err: err })
            }
            
        } else {
            console.log(metaData, "el error que es")
        }
    }
    catch (err) {
        res.status(404).send({ err: err })
    }
})

app.get("/news/:ticker?", async (req, res) => {
    try {
        const data = await fetcharN(req.params.ticker)
        if (data) {
            console.log(data, "comeee nena")
            res.send({ data })
        } else {
            console.log(data, "el error que es")
        }
    }
    catch (err) {
        res.status(404).send({ err: err })
    }
})
app.get("/historical/:ticker", async (req, res) => {
    try {
        const data = await fetcharH(req.params.ticker)
        if (data) {
            console.log(data, "comeee nena")
            res.send({ data })
        } else {
            console.log(data, "el error que es")
        }
    }
    catch (err) {
        res.status(404).send({ err: err })
    }
})



app.listen(8001, () => {
    console.log("essto funca")
})