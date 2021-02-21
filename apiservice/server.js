const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const fs = require("fs")
const path = require("path")
const { fetcharS, fetcharP, fetcharN, fetcharH, fetcharM, fetchQuoteConstituents, fetchprueba, fetchAllIndexesPrices, fetchAvailableIndexes, fetchCompanyAdditional, fetchAllQuotes, fetchEmptyLogo, fetchMostActives, fetchDispatcher } = require("./controller")
const oktaClient = require('./lib/oktaClient');
const cookieParser = require("cookie-parser")
const { createUserTable, addNewUser, findUser, addOperation, createOperationTable, getOperations, addCompanyInfo, getCompanyInfo, createCompanyInfo, createCompaniesJsonTable, getMostActives, storeMostActives, deletePreviousDateRecord, createPortfolioTable } = require("../db/services")
const { prepareStoredOperations, setInitialPossesions } = require("./dataPreparation")
const { convertUnixToHuman } = require("./dataUtils")
const peopleRoutes = require("./routes/Personas.js")
const operationRoutes = require("./routes/Operations.js")
const pricesRoutes = require("./routes/Prices.js")
const validationRoutes = require("./routes/Validation")
const usersRoutes = require("./routes/Users")
const postsRoutes = require("./routes/Posts")
const db = require("../db/db")
const { createInterestTable } = require("../db/services/interestsService")
const { createPostRegister, createPostStructure } = require("../db/services/PostServices")
const authRoutes = require("./routes/Auth")

createUserTable((err) => {
    console.log("que concha")
    if (err) {
        console.log(err, "error al crear usuarios")
    }
})
createOperationTable((err) => {
    console.log("que conchu")
    if (err) {
        console.log(err, "error al crear usuarios")
    }
})
createCompanyInfo((err) => {
    console.log("que conchu")
    if (err) {
        console.log(err, "error al crear usuarios")
    }
})
createCompaniesJsonTable((err) => {
    console.log("que conchu")
    if (err) {
        console.log(err, "error al crear usuarios")
    }
})
createPortfolioTable((err) => {
    console.log("que conchu")
    if (err) {
        console.log(err, "error al crear portfolios")
    }
})
createInterestTable((err) => {
    console.log("que conchu")
    if (err) {
        console.log(err, "error al crear portfolios")
    }
})
createPostRegister((err) => {
    console.log("que conchu")
    if (err) {
        console.log(err, "error al crear portfolios")
    }
})
createPostStructure((err) => {
    console.log("que conchu")
    if (err) {
        console.log(err, "error al crear portfolios")
    }
})

// addNewUser({firstName: "manilox", lastName: "del nilox", email: "monilo@gmail.com"})
// .then(res=>{console.log("succes baby")})
// .catch(err=>{console.log(err, "error baby")})

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//añadidos al hacer lo del okta
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.json())
//app.use(express.json())
app.use("/api/v1/people", peopleRoutes)
app.use("/api/v1/operations", operationRoutes)
//the url has to change to prices, is better name
app.use("/api/v1/prices", pricesRoutes)
app.use("/api/v1/validation", validationRoutes)
app.use("/api/v1/users", usersRoutes)
app.use("/api/v1/posts", postsRoutes)
app.use("/api/v1/auth", authRoutes)
app.use((err, req, res, next)=>{
    console.log(err, "error thrown at")
    //console.log(err.stack, "trace error")
})

app.get("/", (req, res) => {
    res.status(200).send("xuucla nena")
})

const dataExample = {
    "2020-11-18": {
        "portfolioCost": 928,
        "portfolioValue": 915.84,
        "accruedIncome": 0,
        "liquidativeValue": 1000
    },
    "2020-11-19": {
        "portfolioCost": 928,
        "portfolioValue": 904.96,
        "accruedIncome": 0,
        "liquidativeValue": 1000
    },
    "2020-11-20": {
        "portfolioCost": 928,
        "portfolioValue": 906.24,
        "accruedIncome": 0,
        "liquidativeValue": 1001.4144271570013
    },
    "2020-11-23": {
        "portfolioCost": 928,
        "portfolioValue": 915.84,
        "accruedIncome": 0,
        "liquidativeValue": 1012.022630834512
    },
    "2020-11-24": {
        "portfolioCost": 928,
        "portfolioValue": 935.36,
        "accruedIncome": 0,
        "liquidativeValue": 1033.5926449787837
    },
    "2020-11-25": {
        "portfolioCost": 928,
        "portfolioValue": 927.68,
        "accruedIncome": 0,
        "liquidativeValue": 1025.1060820367752
    },
    "2020-11-27": {
        "portfolioCost": 928,
        "portfolioValue": 928.96,
        "accruedIncome": 0,
        "liquidativeValue": 1026.5205091937767
    },
    "2020-11-30": {
        "portfolioCost": 928,
        "portfolioValue": 920,
        "accruedIncome": 0,
        "liquidativeValue": 1016.6195190947667
    },
    "2020-12-01": {
        "portfolioCost": 928,
        "portfolioValue": 923.84,
        "accruedIncome": 0,
        "liquidativeValue": 1020.8628005657711
    },
    "2020-12-02": {
        "portfolioCost": 928,
        "portfolioValue": 930.88,
        "accruedIncome": 0,
        "liquidativeValue": 1028.642149929279
    },
    "2020-12-03": {
        "portfolioCost": 928,
        "portfolioValue": 935.36,
        "accruedIncome": 0,
        "liquidativeValue": 1033.592644978784
    },
    "2020-12-04": {
        "portfolioCost": 928,
        "portfolioValue": 945.28,
        "accruedIncome": 0,
        "liquidativeValue": 1044.5544554455448
    },
    "2020-12-07": {
        "portfolioCost": 928,
        "portfolioValue": 948.48,
        "accruedIncome": 0,
        "liquidativeValue": 1048.0905233380486
    },
    "2020-12-08": {
        "portfolioCost": 928,
        "portfolioValue": 985.92,
        "accruedIncome": 0,
        "liquidativeValue": 1089.46251768034
    },
    "2020-12-09": {
        "portfolioCost": 928,
        "portfolioValue": 1006.72,
        "accruedIncome": 0,
        "liquidativeValue": 1112.4469589816129
    },
    "2020-12-10": {
        "portfolioCost": 928,
        "portfolioValue": 982.08,
        "accruedIncome": 0,
        "liquidativeValue": 1085.2192362093356
    },
    "2020-12-11": {
        "portfolioCost": 928,
        "portfolioValue": 992.32,
        "accruedIncome": 0,
        "liquidativeValue": 1096.5346534653468
    },
    "2020-12-14": {
        "portfolioCost": 928,
        "portfolioValue": 977.6,
        "accruedIncome": 0,
        "liquidativeValue": 1080.2687411598304
    },
    "2020-12-15": {
        "portfolioCost": 928,
        "portfolioValue": 978.56,
        "accruedIncome": 0,
        "liquidativeValue": 1081.3295615275813
    },
    "2020-12-16": {
        "portfolioCost": 928,
        "portfolioValue": 969.28,
        "accruedIncome": 0,
        "liquidativeValue": 1071.074964639321
    },
    "2020-12-17": {
        "portfolioCost": 928,
        "portfolioValue": 947.84,
        "accruedIncome": 0,
        "liquidativeValue": 1047.3833097595475
    },
    "2020-12-18": {
        "portfolioCost": 928,
        "portfolioValue": 940.8,
        "accruedIncome": 0,
        "liquidativeValue": 1039.6039603960396
    },
    "2020-12-21": {
        "portfolioCost": 928,
        "portfolioValue": 928.32,
        "accruedIncome": 0,
        "liquidativeValue": 1025.8132956152758
    },
    "2020-12-22": {
        "portfolioCost": 928,
        "portfolioValue": 908.8,
        "accruedIncome": 0,
        "liquidativeValue": 1004.2432814710041
    },
    "2020-12-23": {
        "portfolioCost": 928,
        "portfolioValue": 920,
        "accruedIncome": 0,
        "liquidativeValue": 1016.6195190947667
    },
    "2020-12-24": {
        "portfolioCost": 928,
        "portfolioValue": 918.08,
        "accruedIncome": 0,
        "liquidativeValue": 1014.4978783592646
    },
    "2020-12-28": {
        "portfolioCost": 928,
        "portfolioValue": 913.6,
        "accruedIncome": 0,
        "liquidativeValue": 1009.5473833097597
    },
    "2020-12-29": {
        "portfolioCost": 928,
        "portfolioValue": 913.28,
        "accruedIncome": 0,
        "liquidativeValue": 1009.1937765205092
    },
    "2020-12-30": {
        "portfolioCost": 928,
        "portfolioValue": 911.68,
        "accruedIncome": 0,
        "liquidativeValue": 1007.4257425742575
    },
    "2020-12-31": {
        "portfolioCost": 928,
        "portfolioValue": 920.32,
        "accruedIncome": 0,
        "liquidativeValue": 1016.9731258840171
    },
    "2021-01-04": {
        "portfolioCost": 928,
        "portfolioValue": 942.08,
        "accruedIncome": 0,
        "liquidativeValue": 1041.0183875530413
    },
    "2021-01-05": {
        "portfolioCost": 928,
        "portfolioValue": 936.32,
        "accruedIncome": 0,
        "liquidativeValue": 1034.6534653465349
    },
    "2021-01-06": {
        "portfolioCost": 928,
        "portfolioValue": 954.56,
        "accruedIncome": 0,
        "liquidativeValue": 1054.8090523338049
    },
    "2021-01-07": {
        "portfolioCost": 928,
        "portfolioValue": 957.12,
        "accruedIncome": 0,
        "liquidativeValue": 1057.6379066478078
    },
    "2021-01-08": {
        "portfolioCost": 928,
        "portfolioValue": 928.64,
        "accruedIncome": 0,
        "liquidativeValue": 1026.1669024045261
    },
    "2021-01-11": {
        "portfolioCost": 928,
        "portfolioValue": 923.84,
        "accruedIncome": 0,
        "liquidativeValue": 1020.8628005657708
    },
    "2021-01-12": {
        "portfolioCost": 928,
        "portfolioValue": 920,
        "accruedIncome": 0,
        "liquidativeValue": 1016.6195190947666
    },
    "2021-01-13": {
        "portfolioCost": 928,
        "portfolioValue": 915.52,
        "accruedIncome": 0,
        "liquidativeValue": 1011.6690240452616
    },
    "2021-01-14": {
        "portfolioCost": 928,
        "portfolioValue": 937.28,
        "accruedIncome": 0,
        "liquidativeValue": 1035.7142857142858
    },
    "2021-01-15": {
        "portfolioCost": 928,
        "portfolioValue": 933.44,
        "accruedIncome": 0,
        "liquidativeValue": 1031.4710042432816
    },
    "2021-01-19": {
        "portfolioCost": 928,
        "portfolioValue": 926.4,
        "accruedIncome": 0,
        "liquidativeValue": 1023.6916548797739
    },
    "2021-01-20": {
        "portfolioCost": 928,
        "portfolioValue": 926.72,
        "accruedIncome": 0,
        "liquidativeValue": 1024.0452616690243
    },
    "2021-01-21": {
        "portfolioCost": 928,
        "portfolioValue": 922.56,
        "accruedIncome": 0,
        "liquidativeValue": 1019.4483734087696
    },
    "2021-01-22": {
        "portfolioCost": 928,
        "portfolioValue": 925.76,
        "accruedIncome": 0,
        "liquidativeValue": 1022.9844413012731
    },
    "2021-01-25": {
        "portfolioCost": 928,
        "portfolioValue": 931.52,
        "accruedIncome": 0,
        "liquidativeValue": 1029.3493635077793
    },
    "2021-01-26": {
        "portfolioCost": 928,
        "portfolioValue": 952,
        "accruedIncome": 0,
        "liquidativeValue": 1051.980198019802
    },
    "2021-01-27": {
        "portfolioCost": 928,
        "portfolioValue": 932.48,
        "accruedIncome": 0,
        "liquidativeValue": 1030.4101838755305
    },
    "2021-01-28": {
        "portfolioCost": 928,
        "portfolioValue": 921.6,
        "accruedIncome": 0,
        "liquidativeValue": 1018.3875530410185
    },
    "2021-01-29": {
        "portfolioCost": 928,
        "portfolioValue": 916.16,
        "accruedIncome": 0,
        "liquidativeValue": 1012.3762376237624
    },
    "2021-02-01": {
        "portfolioCost": 928,
        "portfolioValue": 916.8,
        "accruedIncome": 0,
        "liquidativeValue": 1013.0834512022631
    },
    "2021-02-02": {
        "portfolioCost": 928,
        "portfolioValue": 913.28,
        "accruedIncome": 0,
        "liquidativeValue": 1009.1937765205091
    },
    "2021-02-03": {
        "portfolioCost": 928,
        "portfolioValue": 912.32,
        "accruedIncome": 0,
        "liquidativeValue": 1008.1329561527582
    },
    "2021-02-04": {
        "portfolioCost": 928,
        "portfolioValue": 924.48,
        "accruedIncome": 0,
        "liquidativeValue": 1021.5700141442717
    },
    "2021-02-05": {
        "portfolioCost": 928,
        "portfolioValue": 925.76,
        "accruedIncome": 0,
        "liquidativeValue": 1050.9844413012731
    }
}

app.get("/probe", (req, res) => {
    //onst ixi = JSON.parse(dataExample)
    db.query("update portfolios set portfolio = ? where userId = 2", [JSON.stringify(dataExample)], (err) => {
        if (err) {
            throw new Error(err.message)
        }
    })
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
app.get("/metadata/:dates", (req, res) => {
    try {

    }
    catch (err) {

    }
})
app.get("/prices/:ticker", async (req, res) => {
    console.log("chupamelaaaaaaaaaaaaaaaaaaa")
    try {
        const ticker = req.params.ticker
        const metaData = await fetcharM(ticker)
        if (metaData) {
            //console.log(metaData, "comeee nena")
            const { startDate, endDate } = metaData
            try {
                const data = await fetcharH(ticker, startDate, endDate)
                if (data) {
                    res.send({ data })
                }
                else {
                    console.log(metaData, "errur")
                }
            }
            catch (err) {
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

//ojo aqui si existe query: "?dates=true" no buscaremos precios historicos, 
app.post("/portfolio", async (req, res) => {
    const tickerList = req.body
    console.log(req.body, "body")
    console.log(tickerList, "tickrr")
    const metadataArrPromise = tickerList.map(ticker => fetcharM(ticker))
    const { dates } = req.query
    //ojo esto puede haber error
    let metadataArr;
    try {
        metadataArr = await Promise.all(metadataArrPromise)
        //console.log(metadataArr, "metadata")
        if (!metadataArr.length) {
            return res.status(400).send("no metadata found")
        }
    }
    catch (err) {
        return res.status(404).send({ err })
    }

    if (dates) {
        return res.status(200).send(metadataArr)
    } else {
        try {
            const pricesArrPromise = metadataArr.map((item) => fetcharH(item.ticker, item.startDate, item.endDate, true))

            const pricesArrs = await Promise.all(pricesArrPromise)
            if (pricesArrs.length >= 0) {
                return res.status(200).send(pricesArrs)
            } else {
                console.log(pricesArrs, "error no result prices")
                return res.status(400).send("no prices found")
            }
        }
        catch (err) {
            console.log(err, "fallo1")
            return res.status(400).send(err.message, "fallo2")
        }
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

app.post("/indexes/constituents/:index", async (req, res) => {
    console.log("hola")
    const constituentsArr = req.body.ticker
    console.log(req.params.index, "que index es")
    //console.log(constituentsArr, "mierda")
    try {
        fs.readFile(`${req.params.index}.json`, async (err, data) => {
            if (err) {
                const dataf = await fetchQuoteConstituents(constituentsArr)
                if (dataf.length > 0) {
                    fs.writeFileSync(`${req.params.index}.json`, JSON.stringify(dataf))
                    res.send({ dataf, modo: "first write" })
                }
            }
            else {
                //we already have the file
                //const dota = JSON.parse(data)
                res.send({ data: JSON.parse(data.toString()), modo: "readed" })
            }
        })

    }
    catch (err) {
        res.status(404).send(err.message)
    }
})

app.get("/countriesPopulation", (req, res) => {
    console.log("tu pùta madre")
    fs.readFile(path.join(__dirname, "/data/own_countries_by_population.json"), async (err, data) => {
        if (err) {
            console.log(err, "error")
            res.status(404).send(err)
        } else {
            res.status(200).send(JSON.parse(data.toString()))
        }
    })
})

const checkMissingIndexes = async () => {

    let hasMissingIndex = true
    let allIndexPrices = ""
    let cycleNum = 0
    let contador = 0
    console.log("putona")
    //prueba poniendo negacion en el while !

    while (hasMissingIndex === true) {
        cycleNum++
        console.log("start", cycleNum)
        // eslint-disable-next-line no-loop-func

        // eslint-disable-next-line no-loop-func
        await new Promise(resolve => {
            setTimeout(() => {
                //give some time before call the api again to minimize usage limits errors
                contador++
                if (contador >= 10) {
                    hasMissingIndex = false
                }
                //resolve()
                console.log("dentro")
                console.log(contador, "cuenta debe ir lento")
                fs.readFile("indices.json", async (err, data) => {
                    if (!err) {
                        const rest = await handleStoredResponse("available_indexes", fetchAvailableIndexes)
                        //console.log(rest, "resulttado")
                        if (rest.success) {
                            const allIndex = rest.data.map(item => {
                                if (item.symbol) {
                                    return item.symbol
                                }
                            })
                            console.log(allIndex, "all index")
                            const storedIndex = JSON.parse(data.toString()).map(item => {
                                if (item.symbol) {
                                    return item.symbol
                                }
                            }).filter(item => item !== undefined)
                            console.log(storedIndex, "stored index")
                            const missingIndex = allIndex.map(symbol => {
                                if (!storedIndex.includes(symbol)) {
                                    return symbol
                                    //wel it will return undefined
                                }
                            }).filter(item => item !== undefined)

                            console.log(missingIndex, "missin indexxes")
                            if (!missingIndex.length) {
                                console.log("executad")
                                hasMissingIndex = false
                                resolve()
                            }
                            console.log(missingIndex, "la clave")
                            try {
                                const dataf = await fetchAllIndexesPrices(missingIndex)
                                if (dataf) {
                                    data = [...data, ...dataf]
                                    data.filter(item => !item["Error Message"])
                                    allIndexPrices = data
                                    resolve()
                                }
                                else {
                                    console.log("xupaculoos")
                                    resolve()
                                }
                            } catch (err) {
                                //ad reject here if goes wrong
                                resolve()
                                console.log(err.message, "punto3")
                            }

                        } else {
                            console.log(rest.error.msg, "ue huevpos")
                            resolve()
                        }
                    } else {
                        console.log("WTF is appening")
                        resolve()
                    }
                })
            }, 6000)
        })
    }
    if (allIndexPrices) {
        return allIndexPrices
    } else {
        return "something went wrong"
    }


}



const handleStoredResponse = async (filename, fetchCallback) => {
    const promiser = () => new Promise(resolve => {
        return fs.readFile(`${filename}.json`, async (err, data) => {
            if (err) {
                try {
                    const datas = await fetchCallback()
                    if (datas) {
                        //console.log(datas, "daaatas")
                        resolve({ success: true, data: datas })

                    } else {
                        console.log(datas, "erruuuuru")
                        resolve({ success: false, error: { mag: "no data found" } })
                    }
                }
                catch (err) {
                    resolve({ success: false, error: { msg: err.message } })
                }
            }
            else {
                //we already have the file
                //const dota = JSON.parse(data)
                resolve({ success: true, data, error: "" })
            }
        })
    })
    return await promiser()
}
app.get("/indexes/allprices", (req, res) => {
    console.log("gooooooolfa")
    fs.readFile("indices.json", async (err, data) => {
        if (err) {
            try {
                const availableIndexes = await fetchAvailableIndexes()
                if (availableIndexes) {
                    try {
                        const dataf = await fetchAllIndexesPrices(availableIndexes)
                        if (dataf.length > 0) {
                            fs.writeFileSync("indices.json", JSON.stringify(dataf))
                            try {
                                const datos = await checkMissingIndexes()
                                if (datos) {
                                    res.send({ data: datos, modo: "first write" })
                                } else {
                                    console.log("pero que putas pasa")
                                }
                            }
                            catch (err) {
                                res.status(404).send(err, availableIndexes)
                            }
                        } else {
                            res.status(404).send("no companies found", availableIndexes)
                        }
                    }
                    catch (err) {
                        res.status(404).send(err.message)
                    }
                } else {
                    res.status(404).send("no companies found", availableIndexes)
                }
            }
            catch (err) {
                res.status(404).send(err.message)
            }

        }
        else {
            //we already have the file
            const dota = JSON.parse(data)
            try {
                const datos = await checkMissingIndexes()
                console.log(datos, "watafucck")
                if (datos) {
                    res.send({ data: JSON.parse(data.toString()), modo: "readed" })
                } else {
                    console.log("pero que putas pasa")
                }
            }
            catch (err) {
                res.status(404).send(err, "que coñu")
            }
        }
    })

})

app.get("/pricesIndex", (req, res) => {
    fs.readFile("indices.json", async (err, data) => {
        if (err) {
            console.log(err, "erruur")
            try {
                const avIndex = await fetchAvailableIndexes()
                if (avIndex) {
                    console.log(avIndex)
                    const result = await fetchAllIndexesPrices(avIndex)
                    if (data) {
                        res.status(200).send(result)
                    } else {
                        res.status(404).send("no data returned")
                    }

                } else {
                    res.status(404).send("no index available")
                }
            }
            catch (err) {
                res.status(404).send(err, "linea")
            }
        }
        else {
            console.log("sejndingg")
            res.status(200).send(JSON.parse(data.toString()))
        }
    })

})

app.post('/api/users', (req, res, next) => {
    console.log(req.body, "queee pooooooooa")
    const { email } = req.body
    if (!req.body) return res.sendStatus(400);
    const newUser = {
        profile: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            login: req.body.email
        },
        credentials: {
            password: {
                value: req.body.password
            }
        }
    };
    oktaClient
        .createUser(newUser)
        .then(user =>
            addNewUser(user, email)
                .then(user => {
                    res.status(201);
                    res.send(user);
                })
                .catch(err => { res.status(400).send(err) })
        )
        //   .then(res=>new Promise((resolve, reject)=>{

        //   }))
        .catch(err => {
            res.status(400);
            res.send(err, "xucloooona");
        });
});


// app.post("/api/operations", async (req, res) => {

// })

app.post("/api/companies_url", async (req, res) => {
    const { positions } = req.body
    console.log(req.body, "putapasa")
    console.log(positions, "posicionees")
    if (positions.length > 0) {
        const promiseArrAll = positions.map(position => getCompanyInfo(position.ticker)
        )
        let alreadyStored = await Promise.all(promiseArrAll)

        let missingStocks = [];
        //alreadyStored.forEach(item=>{console.log(item.status)}, "statuuuuuus")
        alreadyStored = alreadyStored.filter(item => item.length > 0).map(item => item[0])
        const alreadyStoredTickers = alreadyStored.map(item => item.ticker)
        console.log(alreadyStoredTickers, "despres")
        //we compare against existing companies in the db to find missing one
        positions.forEach(item => {
            if (!alreadyStoredTickers.includes(item.ticker)) {
                missingStocks.push(item.ticker)
            }
        })
        if (missingStocks.length === 0) {
            return res.status(200).send(alreadyStored)
        }
        else {
            const missingCompaniesDataArr = await fetchTillAllSucceed(missingStocks)
            addCompanyInfo(missingCompaniesDataArr)
                .then((response) => {
                    console.log(response, "reeeeepi")
                    const readyResponse = response.map(stock => ({
                        ticker: stock[0],
                        logourl: stock[1],
                        weburl: stock[2],
                        name: stock[3]
                    }))
                    const allData = [...alreadyStored, ...readyResponse]
                    return res.status(200).send(allData)
                })
                .catch(err => { console.log(err, "fataaaal errorrrr") })
        }

    }
})

const fetchTillAllSucceed = async (missingStocks) => {
    //console.log(missingStocks,"execuuuuted")
    let currentMissings = missingStocks
    console.log(currentMissings, "currmisings")
    let successArr = []
    while (currentMissings.length > 0) {
        // eslint-disable-next-line no-loop-func
        await new Promise(resolve => {
            setTimeout(async () => {
                const promiseArrMissing = currentMissings.map(position => fetchCompanyAdditional(position))
                const missingData = await Promise.all(promiseArrMissing)
                console.log(missingData, "missing data")
                for (let promise of missingData) {
                    console.log(promise, promise.status, "resuueelta")
                    // // if (!promise.logo) {
                    // //     const logourl = await fetchEmptyLogo(promise)
                    // //     promise.logourl = logourl
                    // // }

                    successArr = [...successArr, promise]

                }
                console.log(missingStocks, "que conxaa1")
                console.log(successArr, "que conxaa2")
                for (let poss of missingStocks) {
                    //console.log(poss, successArr[0].ticker)
                    const stockSuccesfullyFetched = successArr.find(item => item.ticker === poss)
                    if (stockSuccesfullyFetched) {
                        console.log("encontradoo")
                        currentMissings = currentMissings.filter(ticker => ticker !== poss)
                    }
                }
                resolve()
            }, 5000)
        })
    }

    return successArr

}

app.post("/api/portfolio/quotes", async (req, res) => {
    const { tickers } = req.body
    console.log(tickers, "aquii tickerrs")
    if (tickers && tickers.length > 0) {
        try {
            const dataArr = await fetchAllQuotes(tickers)
            if (dataArr.length > 0) {
                return res.status(200).send(dataArr)
            } else {
                return res.status(400).send(dataArr, "la funcion no ha dao empty arr")
            }
        }
        catch (err) {
            return res.status(400).send(err.message, "errruuur")
        }
    }
    else {
        console.log("client sent empty body")
    }
})

app.get("/api/direct_json", async (req, res) => {
    const { field } = req.query
    const validDbDate = convertUnixToHuman(Date.now())
    try {
        const mostActiveCompanies = await getMostActives(field, validDbDate)
        console.log(mostActiveCompanies, "awiii1")
        if (mostActiveCompanies.length > 0) {
            //we need to parse db's json field we'll do it in the client

            res.status(200).send(mostActiveCompanies[0])
        }
        else {
            console.log("jodeeer")
            try {
                const data = await fetchDispatcher(field)
                console.log(data, "thee datau")
                if (data.length > 0) {
                    await deletePreviousDateRecord(field)
                    const sameDataButFromDb = await storeMostActives(field, validDbDate, data)
                    res.status(200).send(sameDataButFromDb)
                } else {
                    res.status(400).send("error, the message was empty")
                }
            } catch (err) {
                res.status(400).send(err, "error when fetching most actives")
            }
        }
    }
    catch (err) {
        res.status(400).send(err, "databse error")
    }

})


app.listen(8001, () => {
    console.log("essto funca")
})

//we have to save state.currentPossesions in the database too