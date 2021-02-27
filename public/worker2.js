this.onmessage = e =>{
    console.log("worker2 currando")
    const userActivity = e.data
    console.log(userActivity, "worker2 currando")
    const possesionSeries = generateSerieFromBegining(userActivity) 
    this.postMessage(possesionSeries)
}

const milisencondsInADay = 24 * 60 * 60 * 1000

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

const convertHumanToUnixInit = (date) => {
    const actualDate = date.split("-")
    const mongol = parseInt(actualDate[1]) - 1
    const formatedDate = new Date(
        actualDate[0],
        mongol.toString(),
        actualDate[2]
    );
    return formatedDate.getTime();
}
 const convertUnixToHuman = (unix) => {
    const d = new Date(unix)
    const handleDoubleDigit = (num, isMonth = false) => {
        //solve retard javascript month index starting at 0
        if (isMonth) {
            if (num === 11) {
                return (num+1).toString()
            }  
            num++
        }
        return num.toString().length === 1 ?
            `0${num.toString()}`
            :
            num.toString()
    }
    const monthNum = handleDoubleDigit(d.getMonth(), true)
    const dayNum = handleDoubleDigit(d.getDate())
    
    return d.getFullYear() + '-' + (monthNum) + '-' + dayNum
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

const createTimelaspse = (initialTime) => {
    const firstDate = convertUnixToHuman(initialTime)
    let timelapse = [firstDate]
    let lastDate= initialTime
    //let initialTime = findFirstDate(state.userActivity)
    const range = getTotalDaysElapsed(initialTime)
    //let unixDate = initialTimeUnix.current
    //console.log(range, "raaango")
    //console.log(initialTime, "ostiatime")
    Array.from(Array(range).keys()).forEach(_ => {
        lastDate += milisencondsInADay
        
        timelapse = [...timelapse, convertUnixToHuman(lastDate)]
    })
    return timelapse
}

const handleSell = (costMeanXud, amountSold, priceSold) => {
    const income = (priceSold * amountSold) - (costMeanXud * amountSold)
    return { income }
}

const generateSerieFromBegining = (userActivity) => {
 
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
             }else{
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
     
     return masterHistory

 }