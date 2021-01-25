const express = require("express")
const app = express()
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const { fetcharS, fetcharP, fetcharN, fetcharH, fetcharM, fetchQuoteConstituents, fetchprueba, fetchAllIndexesPrices, fetchAvailableIndexes, fetchCompanyAdditional, fetchAllQuotes, fetchEmptyLogo, fetchMostActives, fetchDispatcher } = require("./controller")
const oktaClient = require('./lib/oktaClient');
const cookieParser = require("cookie-parser")
const { createUserTable, addNewUser, findUser, addOperation, createOperationTable, getOperations, addCompanyInfo, getCompanyInfo, createCompanyInfo, createCompaniesJsonTable, getMostActives, storeMostActives, deletePreviousDateRecord } = require("../db/services")
const { prepareStoredOperations, setInitialPossesions } = require("./dataPreparation")
const { convertUnixToHuman } = require("./dateUtils")


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

app.post("/portfolio2", async (req, res) => {
    const possesions = req.body
    console.log(possesions, "posesionses ostia")
    console.log(req.body, "body")
    const { dates, missingTicker } = req.query
    let metadataArrPromise

    metadataArrPromise = possesions.map(item => fetcharM(item.ticker))

    //ojo esto puede haber error
    let metadataArr;
    try {
        metadataArr = await Promise.all(metadataArrPromise)
        //console.log(metadataArr, "metadata")
        console.log(metadataArr, "laametaaaadata")
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
            console.log(possesions, "poooossesion")
            const pricesArrPromise = metadataArr.map((item) => {
                console.log(item.ticker, "tickuu")
                const startDate = possesions.find(asset =>
                    asset.ticker.toUpperCase() === item.ticker.toUpperCase()
                ).date


                console.log(startDate, "la puta startdate")
                console.log(startDate, item.endDate, "startandenddddd")
                return fetcharH(item.ticker, startDate, item.endDate, true)
            }
            )

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

app.post("/api/addoperation", (req, res) => {
    const email = req.body.user
    console.log(req.body.order, "la faking order")
    //const {operationType, ticker, amount, price} = req.body.order
    findUser(email)
        .then(userId => {
            console.log(userId, "el poto id")
            return addOperation(req.body.order, userId)
        })
        //if this sends success, will update context api state
        .then(() => res.status(200).send("success"))
        .catch(err => res.status(400).send(err))
})

app.post("/api/operations", async (req, res) => {
    const { email } = req.body
    console.log(email, "emaillll")
    try {
        const operations = await getOperations(email)
        if (operations) {
            console.log(operations, "operatiuns")
            const readyOperations = prepareStoredOperations(operations)
            const { uniqueStocks, currentStocks, userCash } = setInitialPossesions(operations)
            res.status(200).send({ readyOperations, uniqueStocks, currentStocks, userCash })
        } else {
            res.status(400).send("error esto viene vacio", operations)
        }
    } catch (err) {
        res.status(400).send(err, "errur")
    }
})

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