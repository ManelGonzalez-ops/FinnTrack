const convertHumanToUnix = (date) => {
    const actualDate = date.split("-")
    const formatedDate = new Date(
        actualDate[0],
        actualDate[1],
        actualDate[2]
    );
    console.log(formatedDate.getTime())
    return formatedDate.getTime();
}
const convertUnixToHuman = (unix) => {
    const d = new Date(unix)
    const handleDoubleDigit = (num) => {
        return num.toString().length === 1 ?
            `0${num.toString()}`
            :
            num
    }
    const monthNum = handleDoubleDigit(d.getMonth())
    const dayNum = handleDoubleDigit(d.getDate())
    return d.getFullYear() + '-' + monthNum + '-' + dayNum
}



const userActivity = [
    {
        date: "2020-06-15",
        operationType: "buy",
        details: {
            ticker: "amzn",
            amount: 40,
            unitaryCost: 300
        },
        isFirstOperation: true
    },
    {
        date: "2020-06-15",
        operationType: "buy",
        details: {
            ticker: "appl",
            amount: 60,
            unitaryCost: 300
        },
        isFirstOperation: false
    },
    {
        date: "2020-07-18",
        operationType: "sell",
        details: {
            ticker: "appl",
            amount: 10,
            unitaryCost: 300
        },
        isFirstOperation: false
    },
    {
        date: "2020-08-21",
        operationType: "buy",
        details: {
            ticker: "fb",
            amount: 100,
            unitaryCost: 10
        },
        isFirstOperation: false
    },
    {
        date: "2020-08-21",
        operationType: "buy",
        details: {
            ticker: "fb",
            amount: 20,
            unitaryCost: 40
        },
        isFirstOperation: false
    },
    {
        date: "2020-08-21",
        operationType: "buy",
        details: {
            ticker: "tef",
            amount: 80,
            unitaryCost: 7
        },
        isFirstOperation: false
    },
    {
        date: "2020-09-24",
        operationType: "sell",
        details: {
            ticker: "fb",
            amount: 120,
            unitaryCost: 10
        },
        isFirstOperation: false
    },
    {
        date: "2020-08-21",
        operationType: "sell",
        details: {
            ticker: "tef",
            amount: 45,
            unitaryCost: 7
        },
        isFirstOperation: false
    },
    {
        date: "2020-10-26",
        operationType: "sell",
        details: {
            ticker: "amzn",
            amount: 10,
            unitaryCost: 250
        },
        isFirstOperation: false
    }
]
//let initialTimeUnix = 0

const findFirstDate = () => {
    let valu
    userActivity.forEach(operation => {
        if (operation.isFirstOperation) {
            console.log(operation.date)
            valu = convertHumanToUnix(operation.date)
        }
    })
    return valu
}


const milisencondsInADay = 24 * 60 * 60 * 1000


const getTotalDaysElapsed = () => {
    const initialTime = findFirstDate()
    const date = convertUnixToHuman(Date.now())
    const todayUnix00 = convertHumanToUnix(date)
    const totalMilisecons = todayUnix00 - initialTime
    return totalMilisecons / milisencondsInADay
}


// const createTimelaspse = (initialTime) => {
//     let timelapse = []
//     const range = getTotalDaysElapsed(initialTime)
//     //let unixDate = initialTimeUnix.current
//     console.log(range)
//     Array(range).forEach(_ => {
//         initialTime += milisencondsInADay
//         const humanDate = convertUnixToHuman(initialTime)
//         timelapse = [...timelapse, humanDate]
//     })
//     return timelapse
// }
const createTimelaspse = () => {
    let timelapse = []
    let initialTime = findFirstDate()
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

//console.log(createTimelaspse(), "yea")



const makeIt = () => {
    const initialTime = findFirstDate()
    console.log(initialTime, findFirstDate(), "inicial")
    const timelapse = createTimelaspse(initialTime)
    console.log(timelapse)
    let masterHistory = {}
    //here we initialize an empty array for each date
    timelapse.forEach(date => {
        masterHistory = {
            ...masterHistory,
            [date]: []
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
                //tenemos que comprobar si teniamos alguna cantidad previamente de ese ticker
                let lastAmount = 0
                //console.log(masterHistory, "que tenemos")
                //console.log(timelapse[index - 1], "fecha key")
                //console.log(masterHistory[timelapse[index - 1]], "que coño")

                // const hasAlreadyOperatedThatDay = masterHistory[date].find(item => item.ticker === ticker)
                //console.log(date, masterHistory[date], "puuuuuuuuuuuuuu")
                //console.log(masterHistory, "weebos")
                const hasAlreadyOperatedThatDay = masterHistory[date].length > 0
                if (hasAlreadyOperatedThatDay) {
                    console.log(ticker, "operated twice that day")
                    const alreadyInPortfolio = masterHistory[date].find(item => item.ticker === ticker)
                    if (alreadyInPortfolio) {
                        lastAmount = alreadyInPortfolio.amount
                        const newAmount =
                            operation.operationType === "buy" ?
                                lastAmount + amount : lastAmount - amount
                        if (newAmount > 0) {
                            const updatedInfo = masterHistory[date].map(posesions => {
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
                                [date]: updatedInfo
                            }
                        } else {
                            const updatedInfo = masterHistory[date].filter(item => item.ticker !== ticker)
                            masterHistory = {
                                ...masterHistory,
                                [date]: updatedInfo
                            }
                        }
                    }
                    else {
                        masterHistory = {
                            ...masterHistory,
                            [date]: [
                                ...masterHistory[date],
                                {
                                    ticker,
                                    amount,
                                    unitaryCost
                                }
                            ]
                        }
                    }
                }

                //if is the first iteration we now this is the initial operation so there're weren stocks before.
                else {
                    console.log(index, "indax")
                    const alreadyInPortfolio = index === 0 ? false : masterHistory[timelapse[index - 1]].find(item => item.ticker === ticker)
                    console.log(alreadyInPortfolio, "ka pasa")
                    if (alreadyInPortfolio) {
                        lastAmount = alreadyInPortfolio.amount
                        console.log(operation.operationType, "operacion", ticker, amount, date)
                        const newAmount =
                            operation.operationType === "buy" ?
                                lastAmount + amount : lastAmount - amount

                        if (newAmount > 0) {
                            console.log(index, "indiceee")
                            console.log(timelapse[index], "fecha", date, "deben coincidir")
                            //console.log(masterHistory, "antes1")
                            console.log(masterHistory[timelapse[index - 1]], "wtf")
                            const updatedInfo = masterHistory[timelapse[index - 1]].map(posesions => {
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
                            //console.log(masterHistory, "antes2")

                            masterHistory = {
                                ...masterHistory,
                                [date]: updatedInfo
                            }
                            // console.log(masterHistory, "despues2")
                            console.log(masterHistory[date], "indiceee")
                        } else {
                            console.log(ticker, "teeesla")
                            const updatedInfo = masterHistory[timelapse[index - 1]].filter(item => item.ticker !== ticker)
                            masterHistory = {
                                ...masterHistory,
                                [date]: updatedInfo
                            }
                        }
                    } else {
                        //si opera varias en un dia, el codigo no debe pasar x aqui

                        if (index === 0) {
                            //aunque sea el primer dia
                            console.log("AQUIIII", ticker, amount)
                            masterHistory = {
                                ...masterHistory,
                                [date]: [{
                                    ticker,
                                    amount,
                                    unitaryCost
                                }]
                            }


                        } else {
                            masterHistory = {
                                ...masterHistory,
                                [date]: [
                                    ...masterHistory[timelapse[index - 1]],
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
        })
        if (!hasMadeOperationThatDate) {
            //si no hemos operado copiaremos el contenido del dia anterior
            //console.log("no operation that day")
            const lastInfo = masterHistory[timelapse[index - 1]]
            console.log(lastInfo)
            masterHistory = {
                ...masterHistory,
                [date]: lastInfo
            }
        }

    })

    //console.log(masterHistory)
}


makeIt()
//console.log(findFirstDate(), "aqui")