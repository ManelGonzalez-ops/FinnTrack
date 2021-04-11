const { convertHumanToUnixInit, convertUnixToHuman } = require("../dataUtils")

const milisencondsInADay = 24 * 60 * 60 * 1000

class PossesionsSeries {

    userActivity
    constructor(userActivity) {
        this.userActivity = userActivity
    }

    async init() {
        return await this.generateSerieFromBegining(this.userActivity)
    }

    findFirstDate = (userActivity) => {
        let valu
        userActivity.forEach(operation => {
            if (operation.isFirstOperation) {
                //console.log(operation.date)
                valu = convertHumanToUnixInit(operation.date)
            }
        })
        return valu
    }

    getTotalDaysElapsed = (initialTime) => {
        //const initialTime = findFirstDate()
        const today = convertUnixToHuman(Date.now())
        //console.log(today, "duuuu")
        const todayUnix00 = convertHumanToUnixInit(today)

        //console.log(todayUnix00, "duuu2", initialTime)
        const totalMilisecons = todayUnix00 - initialTime
        if (totalMilisecons > 0) {
            return totalMilisecons / milisencondsInADay
        } else {
            //this will only run in the day 0 
            return 1
        }
    }

    createTimelaspse = (initialTime) => {
        const firstDate = convertUnixToHuman(initialTime)
        let timelapse = [firstDate]
        let lastDate = initialTime
        const range = this.getTotalDaysElapsed(initialTime)
        console.log(range, "rangou")
        Array.from(Array(Math.round(range)).keys()).forEach(_ => {
            lastDate += milisencondsInADay
            timelapse = [...timelapse, convertUnixToHuman(lastDate)]
        })
        return timelapse
    }

    handleSell = (costMeanXud, amountSold, priceSold) => {
        const income = (priceSold * amountSold) - (costMeanXud * amountSold)
        return { income }
    }

    generateSerieFromBegining = (userActivity) => {
        return new Promise(resolve => {

            const initialTime = this.findFirstDate(userActivity)

            const timelapse = this.createTimelaspse(initialTime)

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
            // console.log(timelapse, "timelapse")
            timelapse.forEach((date, index) => {
                let hasMadeOperationThatDate = false
                userActivity.forEach(operation => {
                    if (date === operation.date) {
                        hasMadeOperationThatDate = true
                        let ticker = operation.details.ticker
                        let amount = operation.details.amount
                        let unitaryCost = operation.details.unitaryCost
                        let priceSold = operation.details.priceSold

                        //tenemos que comprobar si teniamos alguna cantidad previamente de ese ticker
                        let lastAmount = 0
                        const hasAlreadyOperatedThatDay = masterHistory["dates"][date].positions
                        if (hasAlreadyOperatedThatDay) {
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
                                            const { income } = this.handleSell(posesions.unitaryCost, amount, priceSold)
                                            if (index === 0) {
                                                //console.log(JSON.parse(JSON.stringify(income)), "incomeee")
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
                            if (alreadyInPortfolio) {
                                lastAmount = alreadyInPortfolio.amount
                                const newAmount =
                                    operation.operationType === "buy" ?
                                        lastAmount + amount : lastAmount - amount
                                if (operation.operationType === "buy") {
                                    const updatedInfo = masterHistory.dates[timelapse[index - 1]].positions.map(({ ...posesions }) => {
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
                                            const { income } = this.handleSell(posesions.unitaryCost, amount, priceSold)
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
                    const lastInfo = masterHistory.dates[timelapse[index - 1]]
                    masterHistory = {
                        ...masterHistory,
                        dates: {
                            ...masterHistory.dates,
                            [date]: lastInfo
                        }
                    }
                }
            })
            //console.log(masterHistory, "aveeer nena")
            resolve(masterHistory)
        })
    }
}
module.exports = PossesionsSeries