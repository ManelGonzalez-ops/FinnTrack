import { useEffect, useRef } from "react";
import { useDataLayer } from "../Context";
import { convertHumanToUnixInit, convertHumanToUnixInitial, convertUnixToHuman, milisencondsInADay } from "../utils/datesUtils";
import { usePortfolioGenerator } from "./portfolioGenerator2";
//we lost lot of time by not realising .map() mutate object, so each time we were changing th eamount of one date we were change all the amount of the past dates as well kind of magically. That is because each date is an array of objects, and this objects are references from the previous object as we generate the the series from the objects of the date before. So everytime we were fining the updatedInfo, we were using the same object (as they werre pointing to he same memory dir), instead of a copy..


//we are injecting this from App.js



//let initialTimeUnix = 0
//gastamos 12.000 en acciones de amzn
//vendemos 10 acciones a 3000, ingresando 30.000, ganamos 12.000

const findFirstDate = (userActivity) => {
    let valu
    userActivity.forEach(operation => {
        if (operation.isFirstOperation) {
            // console.log(operation.date)
            valu = convertHumanToUnixInit(operation.date)
        }
    })
    return valu
}



const getTotalDaysElapsed = (initialTime) => {
    //const initialTime = findFirstDate()
    const date = convertUnixToHuman(Date.now())
    //console.log(date, "duuuu")
    const todayUnix00 = convertHumanToUnixInit(date)

    //console.log(todayUnix00,"duuu2", initialTime)
    const totalMilisecons = todayUnix00 - initialTime
    if (totalMilisecons > 0) {
        return totalMilisecons / milisencondsInADay
    } else {
        //this will only run in the day 0 
        return 0
    }
}



export const useLogicPruebas = () => {

    const { state, dispatch } = useDataLayer()

    const createTimelaspse = (initialTime) => {
        const firstDate = convertUnixToHuman(initialTime)
        let timelapse = [firstDate]
        let lastDate = initialTime
        //let initialTime = findFirstDate(state.userActivity)
        const range = getTotalDaysElapsed(initialTime)
        //let unixDate = initialTimeUnix.current
        //console.log(range, "raaango")
        //console.log(initialTime, "ostiatime")
        Array.from(Array(Math.random(range)).keys()).forEach(_ => {
            lastDate += milisencondsInADay
            timelapse = [...timelapse, convertUnixToHuman(lastDate)]
        })
        return timelapse
    }

    const handleSell = (costMeanXud, amountSold, priceSold) => {
        const income = (priceSold * amountSold) - (costMeanXud * amountSold)
        return { income }
    }

    // const addToGeneratedSeries = (newOperation, cb) => {
    //     //we could save the first date in database intead of calculating everytime
    //     console.log("queee hostiaaaaaaa")
    //     let today;
    //     const { unitaryCost, ticker, amount } = newOperation.details
    //     const currentGeneratedSerie = state.generatedSeries
    //     //we need to get today's serie last key
    //     console.log(JSON.parse(JSON.stringify(currentGeneratedSerie)), "quepaso1")
    //     if (newOperation.isFirstOperation) {
    //         //the generated serie won't have any date
    //         today = convertUnixToHuman(Date.now())
    //         const updatedSeries = {
    //             ...state.generatedSeries,
    //             dates: {
    //                 [today]: {
    //                     income: 0,
    //                     positions: [
    //                         {ticker, amount, unitaryCost}
    //                     ]
    //                 }
    //             }
    //         }
    //         cb(updatedSeries)
    //         return
    //         //we leave the function here
    //     }
    //     //realmente ya tenemos la date de hoy en newOperation
    //     today = Object.keys(currentGeneratedSerie.dates)[Object.keys(currentGeneratedSerie.dates).length - 1]

    //     console.log(state.generatedSeries, "repuuuuta")
    //     console.log(JSON.parse(JSON.stringify(today)), "quepaso2")
    //     let todayRegister = currentGeneratedSerie.dates[today]
    //     console.log(todayRegister, "registro de hoy")

    //     let alreadyInPortfolio = todayRegister.positions.find(asset => asset.ticker === ticker)
    //     if (alreadyInPortfolio) {
    //         if (newOperation.operationType === "buy") {
    //             const newAmount = alreadyInPortfolio.amount + amount
    //             const unitaryCostMean =
    //                 (alreadyInPortfolio.unitaryCost * alreadyInPortfolio.amount) /
    //                 (alreadyInPortfolio.amount + amount)
    //                 +
    //                 (unitaryCost * amount) /
    //                 (alreadyInPortfolio.amount + amount)
    //             alreadyInPortfolio = {
    //                 ...alreadyInPortfolio
    //             }
    //             const readyUnitaryCost = Math.round(unitaryCostMean * 100) / 100
    //             const otherPositions = todayRegister.positions.filter(asset => asset.ticker !== ticker)
    //             alreadyInPortfolio = {
    //                 ...alreadyInPortfolio,
    //                 amount: newAmount,
    //                 unitaryCost: readyUnitaryCost
    //             }
    //             todayRegister = {
    //                 ...todayRegister,
    //                 positions: [
    //                     ...otherPositions,

    //                 ]
    //             }
    //         } else {
    //             //sell
    //             const newAmount = alreadyInPortfolio.amount - amount
    //             const { income } = handleSell(alreadyInPortfolio.unitaryCost, amount, newOperation.details.priceSold)
    //             //we need to check if there was income for this ticker (if was sold anytime before)
    //             const newIncome = alreadyInPortfolio.income ? alreadyInPortfolio.income + income : income
    //             alreadyInPortfolio = {
    //                 ...alreadyInPortfolio,
    //                 income: newIncome,
    //                 amount: newAmount
    //             }
    //             const otherPositions = todayRegister.positions.filter(asset => asset.ticker !== ticker)
    //             if (newAmount > 0) {
    //                 todayRegister = {
    //                     ...todayRegister,
    //                     positions: [
    //                         ...otherPositions,
    //                         alreadyInPortfolio
    //                     ],
    //                     income: todayRegister.income + income
    //                 }
    //             } else {
    //                 const updatedPositions = todayRegister.positions.filter(asset => asset.ticker === ticker)
    //                 todayRegister = {
    //                     ...todayRegister,
    //                     positions: updatedPositions,
    //                     income: todayRegister.income + income
    //                 }
    //             }
    //         }

    //     } else {
    //         if (newOperation.operationType === "buy") {
    //             todayRegister = {
    //                 ...todayRegister,
    //                 positions: [...todayRegister.positions,
    //                 { ticker, amount, unitaryCost }]
    //             }
    //         } else {
    //             throw new Error(ticker, amount, "can't sell stock that don't have")
    //         }
    //     }
    //     const updatedSeries = {
    //         ...state.generatedSeries,
    //         dates: {
    //             ...state.generatedSeries.dates,
    //             [today]: todayRegister
    //         }
    //     }
    //     console.log(updatedSeries, "repuuuuta2")
    //     cb(updatedSeries)
    // }

    const generateSerieFromBegining = (userActivity, cb) => {
        const worker = new Worker("/worker2.js")
        worker.postMessage(userActivity)
        worker.onmessage = (e) => {
            console.log(e.data, "posesions generated")
            const possesionGenerated = e.data
            cb(possesionGenerated)
        }
    }
    const generateSerieFromBeginin = (userActivity, cb) => {

        // console.log(userActivity, "actividad usuario")
        const initialTime = findFirstDate(userActivity)
        // console.log(initialTime, "tiempooo")
        //console.log(convertUnixToHuman(initialTime), "crazyy")
        const timelapse = createTimelaspse(initialTime)

        let masterHistory;
        let koko = 0
        masterHistory = {
            income: 0
        }
        //console.log(timelapse, "timelapse")
        if (!timelapse.length) {
            masterHistory = {
                ...masterHistory,
                dates: {
                }
            }
        }
        //**deberiamos tener en cuenta si es fin de semana o no, ya que el finde no cambia nada, por lo que es redundante
        timelapse.forEach(date => {
            masterHistory = {
                ...masterHistory,
                dates: {
                    ...masterHistory.dates,
                    [date]: []
                }
            }
        })

        //here we initialize an empty array for each date
        console.log(masterHistory, "maastar")
        console.log(timelapse, "timelapse")
        timelapse.forEach((date, index) => {
            let hasMadeOperationThatDate = false
            userActivity.forEach(operation => {
                //console.log(typeof operation.date,typeof date,date, "kostia")
                //console.log(operation.date, date, "kostia")
                if (date === operation.date) {
                    //console.log(index, "iiii")
                    //console.log("hola")
                    //console.log(date, "first date")
                    hasMadeOperationThatDate = true
                    let ticker = operation.details.ticker
                    let amount = operation.details.amount
                    let unitaryCost = operation.details.unitaryCost
                    let priceSold = operation.details.priceSold

                    //tenemos que comprobar si teniamos alguna cantidad previamente de ese ticker
                    let lastAmount = 0
                    //console.log(JSON.parse(JSON.stringify(masterHistory)), JSON.parse(JSON.stringify(masterHistory.dates)), masterHistory.dates[date], date, "wata")
                    const hasAlreadyOperatedThatDay = masterHistory["dates"][date].positions
                    if (hasAlreadyOperatedThatDay) {
                        //console.log(ticker, "operated twice that day")
                        const alreadyInPortfolio = masterHistory.dates[date].positions.find(item => item.ticker === ticker)
                        if (alreadyInPortfolio) {
                            lastAmount = alreadyInPortfolio.amount
                            const newAmount =
                                operation.operationType === "buy" ?
                                    lastAmount + amount : lastAmount - amount
                            if (operation.operationType === "buy") {
                                const updatedInfo = masterHistory.dates[date].positions.map(({ ...posesions }) => {
                                    if (posesions.ticker === ticker) {
                                        posesions.amount = newAmount
                                        const unitaryCostMean =
                                            (posesions.unitaryCost * posesions.amount) /
                                            (posesions.amount + amount)
                                            +
                                            (unitaryCost * amount) /
                                            (posesions.amount + amount)

                                        posesions.unitaryCost = Math.round(unitaryCostMean * 100) / 100
                                    }
                                    return posesions
                                })
                                masterHistory = {
                                    ...masterHistory,
                                    dates: {
                                        ...masterHistory.dates,
                                        [date]: {
                                            ...masterHistory.dates[date],
                                            positions: updatedInfo
                                        }
                                    }

                                }
                            }
                            else if (operation.operationType === "sell") {
                                let dateIncome, operationIncome;
                                masterHistory.dates[date].positions.forEach(posesions => {
                                    if (posesions.ticker === ticker) {
                                        if (index === 0) {
                                            // console.log(posesions.unitaryCost,
                                            //   amount, priceSold, "incomeee")
                                        }
                                        const { income } = handleSell(posesions.unitaryCost, amount, priceSold)
                                        if (index === 0) {
                                            //console.log(JSON.parse(JSON.stringify(income, "incomeee")))
                                        }
                                        operationIncome = income

                                        dateIncome = masterHistory.dates[date].income + income
                                    }
                                })
                                let updatedInfo = newAmount !== 0 ?
                                    //if we don't use spreed operatior we will be mutating the original object
                                    masterHistory.dates[date].positions.map(({ ...posesions }) => {
                                        if (posesions.ticker === ticker) {
                                            posesions.amount = newAmount
                                            posesions["income"] = operationIncome
                                        }
                                        return posesions
                                    })
                                    :
                                    masterHistory.dates[date].positions.filter(item => item.ticker !== ticker)

                                masterHistory = {
                                    ...masterHistory,
                                    dates: {
                                        ...masterHistory.dates,
                                        [date]: {
                                            income: dateIncome,
                                            positions: updatedInfo
                                        }

                                    }
                                }
                            }
                        }
                        else {
                            masterHistory = {
                                ...masterHistory,
                                dates: {
                                    ...masterHistory.dates,
                                    [date]: {
                                        ...masterHistory.dates[date],
                                        positions: [
                                            ...masterHistory.dates[date].positions,
                                            {
                                                ticker,
                                                amount,
                                                unitaryCost
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                    //if is the first iteration we now this is the initial operation so there're weren stocks before.
                    else {
                        const alreadyInPortfolio = index === 0 ? false : masterHistory.dates[timelapse[index - 1]].positions.find(item => item.ticker === ticker)
                        // console.log(alreadyInPortfolio, "que concho")
                        if (alreadyInPortfolio) {
                            lastAmount = alreadyInPortfolio.amount
                            const newAmount =
                                operation.operationType === "buy" ?
                                    lastAmount + amount : lastAmount - amount
                            if (operation.operationType === "buy") {
                                const updatedInfo = masterHistory.dates[timelapse[index - 1]].positions.map(({ ...posesions }) => {
                                    //           console.log(posesions, "cojones")
                                    if (posesions.ticker === ticker) {
                                        posesions.amount = newAmount
                                        const unitaryCostMean =
                                            (posesions.unitaryCost * posesions.amount) /
                                            (posesions.amount + amount)
                                            +
                                            (unitaryCost * amount) /
                                            (posesions.amount + amount)

                                        posesions.unitaryCost = Math.round(unitaryCostMean * 100) / 100
                                    }
                                    return posesions
                                })

                                masterHistory = {
                                    ...masterHistory,
                                    dates: {
                                        ...masterHistory.dates,
                                        [date]: {
                                            ...masterHistory.dates[timelapse[index - 1]],
                                            positions: updatedInfo
                                        }
                                    }
                                }
                            }

                            else if (operation.operationType === "sell") {
                                // console.log(JSON.parse(JSON.stringify(masterHistory)), "antes", ticker, date, timelapse[index - 1])
                                //let newIncome;
                                let operationIncome;
                                let dateIncome;
                                masterHistory.dates[timelapse[index - 1]].positions.forEach(posesions => {
                                    if (posesions.ticker === ticker) {
                                        const { income } = handleSell(posesions.unitaryCost, amount, priceSold)
                                        operationIncome = income
                                        dateIncome = masterHistory.dates[timelapse[index - 1]].income + income
                                    }
                                })
                                let updatedInfo = newAmount !== 0 ?
                                    masterHistory.dates[timelapse[index - 1]].positions.map(({ ...posesions }) => {
                                        if (posesions.ticker === ticker) {
                                            posesions.amount = newAmount
                                            posesions["income"] = operationIncome
                                        }
                                        return posesions
                                    })
                                    :
                                    masterHistory.dates[timelapse[index - 1]].positions.filter(item => item.ticker !== ticker)
                                // console.log(JSON.parse(JSON.stringify(masterHistory)), "despues", ticker, date, timelapse[index - 1])
                                masterHistory = {
                                    ...masterHistory,
                                    dates: {
                                        ...masterHistory.dates,
                                        [date]: {
                                            income: dateIncome,
                                            positions: updatedInfo
                                        }
                                    }
                                }
                            }

                        } else {
                            //si opera varias en un dia, el codigo no debe pasar x aqui
                            const info = {
                                ticker,
                                amount,
                                unitaryCost
                            }

                            if (index === 0) {
                                //console.log(info, "info")
                                //aunque sea el primer dia
                                masterHistory = {
                                    ...masterHistory,
                                    dates: {
                                        ...masterHistory.dates,
                                        [date]: {
                                            income: 0,
                                            positions: [
                                                info
                                            ]
                                        }
                                    }

                                }

                            } else {
                                masterHistory = {
                                    ...masterHistory,
                                    dates: {
                                        ...masterHistory.dates,
                                        [date]: {
                                            ...masterHistory.dates[timelapse[index - 1]],
                                            positions: [
                                                ...masterHistory.dates[timelapse[index - 1]].positions,
                                                info
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // console.log("noooooooooo")
                }
            })
            if (!hasMadeOperationThatDate) {
                //si no hemos operado copiaremos el contenido del dia anterior
                //console.log("no operation that day")
                koko++
                //console.log(koko, "recuento")
                const lastInfo = masterHistory.dates[timelapse[index - 1]]
                //console.log(lastInfo)
                masterHistory = {
                    ...masterHistory,
                    dates: {
                        ...masterHistory.dates,
                        [date]: lastInfo
                    }
                }
            }
        })
        console.log(masterHistory, "aveeer nena")
        cb(masterHistory)
    }
    //solo se recalcularan las series cuando el ususario haya echo una nueva operacion y o cuando haya entrado en portolio dashboard
    //usePortfolioGenerator()
    useEffect(() => {
        //this needs to fire either when initialState is ready and everytime we add new operation (user activity changes), as we need this to calculate the changes in AssetStructure chart
        console.log(state.userActivity, state.setPruebaReady, state.generatedSeries.ready, "actu")
        //setPruebaReady creo que es redundante aqui ya que cuando generatedSeries.status es falso significa que hemos realizado una nueva operacion (deberiamos impedir realizar nueva operacion hasta que no generatedSeries.status sea true again)
        if (state.userActivity.length > 0 && state.setPruebaReady && !state.generatedSeries.ready) {
            console.log("exxecutao")
            console.log(state.userActivity, "useactivity")
            //if no userActivity we wont run any code
            generateSerieFromBegining(state.userActivity, (generatedSerie) => {
                console.log("exxecutao2")
                dispatch({ type: "STORE_GENERATED_SERIES", payload: generatedSerie })
            })
            //  else {
            //     const newOperation = state.userActivity[state.userActivity.length - 1]
            //     dispatch({ type: "SET_ARE_GENERATED_SERIES_READY", payload: false })
            //     addToGeneratedSeries(newOperation, (generatedSerie) => {
            //         dispatch({ type: "STORE_GENERATED_SERIES", payload: generatedSerie })
            //         dispatch({ type: "SET_ARE_GENERATED_SERIES_READY", payload: true })
            //         //userRefreshed.current will be alredy false
            //     })
            // }

        }


        // if (state.userActivity.length > 0 && Object.keys(state.portfolioHistory).length > 0) {
        //     generateSerieFromBegining(state.userActivity, (generatedSerie) => { dispatch({ type: "STORE_GENERATED_SERIES", payload: generatedSerie }) })
        // }
    }, [state.setPruebaReady, state.generatedSeries])


}



//console.log(createTimelaspse(), "yea")




//makeIt()
//console.log(findFirstDate(), "aqui")


export const userActivity = [
    {
        date: "2020-06-15",
        operationType: "buy",
        details: {
            ticker: "amzn",
            amount: 40,
            unitaryCost: 300

        },
        isFirstOperation: true,

    },
    {
        date: "2020-06-15",
        operationType: "buy",
        details: {
            ticker: "aapl",
            amount: 60,
            unitaryCost: 300

        },
        isFirstOperation: false,

    },
    {
        date: "2020-06-15",
        operationType: "sell",
        details: {
            ticker: "aapl",
            amount: 40,
            priceSold: 300

        },
        isFirstOperation: false,
    },
    {
        date: "2020-06-16",
        operationType: "buy",
        details: {
            ticker: "aa",
            amount: 40,
            unitaryCost: 14

        },
        isFirstOperation: false,

    },
    {
        date: "2020-06-22",
        operationType: "buy",
        details: {
            ticker: "aa",
            amount: 30,
            unitaryCost: 14

        },
        isFirstOperation: false,
    },
    {
        date: "2020-06-25",
        operationType: "buy",
        details: {
            ticker: "aa",
            amount: 30,
            unitaryCost: 14

        },
        isFirstOperation: false,

    },
    {
        date: "2020-07-18",
        operationType: "sell",
        details: {
            ticker: "aapl",
            amount: 10,
            priceSold: 315

        },
        isFirstOperation: false,

    },
    {
        date: "2020-08-21",
        operationType: "buy",
        details: {
            ticker: "fb",
            amount: 100,
            unitaryCost: 10

        },
        isFirstOperation: false,

    },
    {
        date: "2020-08-21",
        operationType: "buy",
        details: {
            ticker: "fb",
            amount: 20,
            unitaryCost: 10

        },
        isFirstOperation: false,

    },
    {
        date: "2020-08-21",
        operationType: "buy",
        details: {
            ticker: "tef",
            amount: 80,
            unitaryCost: 7

        },
        isFirstOperation: false,

    },
    {
        date: "2020-09-24",
        operationType: "sell",
        details: {
            ticker: "fb",
            amount: 120,
            priceSold: 20

        },
        isFirstOperation: false,


    },
    {
        date: "2020-09-21",
        operationType: "sell",
        details: {
            ticker: "tef",
            amount: 45,
            priceSold: 3

        },
        isFirstOperation: false,

    },
    {
        date: "2020-10-26",
        operationType: "sell",
        details: {
            ticker: "amzn",
            amount: 10,
            priceSold: 3000

        },
        isFirstOperation: false,

    }
]