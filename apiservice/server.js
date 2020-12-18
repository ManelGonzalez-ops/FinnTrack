const express = require("express")
const app = express()
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const { fetcharS, fetcharP, fetcharN, fetcharH, fetcharM, fetchQuoteConstituents, fetchprueba, fetchAllIndexesPrices, fetchAvailableIndexes } = require("./controller")
const oktaClient = require('./lib/oktaClient');
const cookieParser = require("cookie-parser")
const { createUserTable, addNewUser, findUser, addOperation, createOperationTable } = require("../db/services")


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

// addNewUser({firstName: "manilox", lastName: "del nilox", email: "monilo@gmail.com"})
// .then(res=>{console.log("succes baby")})
// .catch(err=>{console.log(err, "error baby")})

app.use(cors())
//añadidos al hacer lo del okta
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use(express.json())
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
            addNewUser(user)
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

app.post("/api/addoperation", (req, res)=>{
    const email = req.body.user
    //const {operationType, ticker, amount, price} = req.body.order
    findUser(email)
    .then(userId=>{
        return addOperation(req.body.order, userId)})
    //if this sends success, will update context api state
    .then(()=>res.status(200).send("success"))
    .catch(err=>res.status(400).send(err))
})

app.listen(8001, () => {
    console.log("essto funca")
})

//we have to save state.currentPossesions in the database too