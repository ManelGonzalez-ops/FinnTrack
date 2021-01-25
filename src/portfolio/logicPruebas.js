import { useEffect } from "react";
import { useDataLayer } from "../Context";
import { convertHumanToUnixInit, convertUnixToHuman } from "../utils/datesUtils";
import { usePortfolioGenerator } from "./portfolioGenerator";
//we lost lot of time by not realising .map() mutate object, so each time we were changing th eamount of one date we were change all the amount of the past dates as well kind of magically. That is because each date is an array of objects, and this objects are references from the previous object as we generate the the series from the objects of the date before. So everytime we were fining the updatedInfo, we were using the same object (as they werre pointing to he same memory dir), instead of a copy..


//we are injecting this from App.js


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
//let initialTimeUnix = 0
//gastamos 12.000 en acciones de amzn
//vendemos 10 acciones a 3000, ingresando 30.000, ganamos 12.000

const findFirstDate = (userActivity) => {
    let valu
    userActivity.forEach(operation => {
        if (operation.isFirstOperation) {
            console.log(operation.date)
            valu = convertHumanToUnixInit(operation.date)
        }
    })
    return valu
}


const milisencondsInADay = 24 * 60 * 60 * 1000



const getTotalDaysElapsed = (initialTime) => {
    //const initialTime = findFirstDate()
    const date = convertUnixToHuman(Date.now())
    const todayUnix00 = convertHumanToUnixInit(date)
    const totalMilisecons = todayUnix00 - initialTime
    return totalMilisecons / milisencondsInADay
}



export const useLogicPruebas = () => {

    const { state, dispatch } = useDataLayer()

    const createTimelaspse = (initialTime) => {
        let timelapse = []
        //let initialTime = findFirstDate(state.userActivity)
        const range = getTotalDaysElapsed(initialTime)
        //let unixDate = initialTimeUnix.current
        //console.log(range)
        Array.from(Array(range).keys()).forEach(_ => {
            const humanDate = convertUnixToHuman(initialTime)
            timelapse = [...timelapse, humanDate]
            initialTime += milisencondsInADay
        })
        return timelapse
    }

    const handleSell = (costMeanXud, amountSold, priceSold) => {
        const income = (priceSold * amountSold) - (costMeanXud * amountSold)
        return { income }
    }

  

    const generateSerieFromBegining = (userActivity, cb) => {
        const initialTime = findFirstDate(userActivity)
        console.log(initialTime, findFirstDate(userActivity), "inicial")
        const timelapse = createTimelaspse(initialTime)
        console.log(timelapse)
        let masterHistory = {
            income: 0
        }
        //here we initialize an empty array for each date
        let koko = 0
        timelapse.forEach(date => {
            masterHistory = {
                ...masterHistory,
                dates: {
                    ...masterHistory.dates,
                    [date]: []
                }
            }
        })
        console.log(masterHistory, "queu")
        timelapse.forEach((date, index) => {
            console.log(date, "fecha")
            let hasMadeOperationThatDate = false
            userActivity.forEach(operation => {
                if (date === operation.date) {
                    console.log(index, "iiii")
                    console.log("hola")
                    console.log(date, "first date")
                    hasMadeOperationThatDate = true
                    let ticker = operation.details.ticker
                    let amount = operation.details.amount
                    let unitaryCost = operation.details.unitaryCost
                    let priceSold = operation.details.priceSold

                    //tenemos que comprobar si teniamos alguna cantidad previamente de ese ticker
                    let lastAmount = 0
                    console.log(JSON.parse(JSON.stringify(masterHistory)), JSON.parse(JSON.stringify(masterHistory.dates)), masterHistory.dates[date], date, "wata")
                    const hasAlreadyOperatedThatDay = masterHistory["dates"][date].positions
                    if (hasAlreadyOperatedThatDay) {
                        console.log(ticker, "operated twice that day")
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
                                            console.log(posesions.unitaryCost, 
                                            amount, priceSold, "incomeee")
                                        }
                                        const { income } = handleSell(posesions.unitaryCost, amount, priceSold)
                                        if (index === 0) {
                                            console.log(JSON.parse(JSON.stringify(income, "incomeee")))
                                        }
                                        operationIncome = income

                                        dateIncome = masterHistory.dates[date].income + income
                                    }
                                })
                                let updatedInfo = newAmount !== 0 ?
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
                        console.log(alreadyInPortfolio, "que concho")
                        if (alreadyInPortfolio) {
                            lastAmount = alreadyInPortfolio.amount
                            const newAmount =
                                operation.operationType === "buy" ?
                                    lastAmount + amount : lastAmount - amount
                            if (operation.operationType === "buy") {
                                const updatedInfo = masterHistory.dates[timelapse[index - 1]].positions.map(({ ...posesions }) => {
                                    console.log(posesions, "cojones")
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
                                            ...masterHistory.dates[timelapse[index-1]],
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
                                console.log(info, "info")
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
                }
            })
            if (!hasMadeOperationThatDate) {
                //si no hemos operado copiaremos el contenido del dia anterior
                //console.log("no operation that day")
                koko++
                console.log(koko, "recuento")
                const lastInfo = masterHistory.dates[timelapse[index - 1]]
                console.log(lastInfo)
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
    usePortfolioGenerator()
    useEffect(() => {
        if (state.userActivity.length > 0 && Object.keys(state.portfolioHistory).length > 0) {
            generateSerieFromBegining(state.userActivity, (generatedSerie) => { dispatch({ type: "STORE_GENERATED_SERIES", payload: generatedSerie }) })
        }
    }, [state.userActivity, state.portfolioHistory])

   
}



//console.log(createTimelaspse(), "yea")




//makeIt()
//console.log(findFirstDate(), "aqui")