import React, { useEffect, useRef, useState } from 'react'
import { useDataLayer } from '../Context'
import { convertHumanToUnix, convertUnixToHuman } from '../utils/datesUtils'

export const usePortfolioGenerator = () => {

    const { state, dispatch } = useDataLayer()
    const userRefreshed = useRef(true)
    const [rendi, setRendi] = useState()
    const validDates = useRef([])
    //option 1 : save masterSerie as a object
    //option 2 : save masterSerie as a array

    //generated series has dates that portfolioHistory dont have (weekends stock market is close)

    //we need to update today's income, so we could remove last value and added it again with the correct info
    //this is step2z
    const milisencondsInADay = 24 * 60 * 60 * 1000
    //check first of the date key exists
    const getLastGeneralDate = (date) => {
        let duta = convertHumanToUnix(date);
        while (true) {
            duta -= milisencondsInADay
            const dota = convertUnixToHuman(duta)
            if (state.portfolioHistory[dota]) {
                return dota
            }
        }
    }
    const getLastValidPrice = (ticker, options = false) => {
        let fecha
        let register
        if (options) {
            const lastDate = options.date
            let duta = convertHumanToUnix(lastDate);
            while (true) {
                duta -= milisencondsInADay
                const dota = convertUnixToHuman(duta)
                if (state.portfolioHistory[dota][ticker]) {
                    fecha = dota
                    register = state.portfolioHistory[dota][ticker]
                    break
                }
            }
        } else {
            for (let date of Object.keys(state.portfolioHistory).reverse()) {
                if (state.portfolioHistory[date][ticker]) {
                    fecha = date
                    register = state.portfolioHistory[date][ticker]
                    break
                }
            }
        }

        return { fecha, register }
    }

    const updateSerie = (cb) => {
        var lastDaySerieStep2;
        let change, incomeDiff, liquidativeValue, dayBefore;
        let lastIncome = 0
        const seriesStep2 = state.portfolioSeries
        // const today = Object.keys(seriesStep2)[Object.keys(seriesStep2).length - 1]
        const today = convertUnixToHuman(Date.now())
        console.log(today)
        const currentSerieStep1 = state.generatedSeries.dates[today]
        //const generatedSerieOfToday = state.generatedSeries
        console.log(today, "todaaaay")
        console.log(state.portfolioHistory, "portfoliohistory")
        console.log(state.portfolioHistoryByCompany, "portfoliohistoryByCompany")
        let portfolioCost = 0;
        let portfolioValue = 0;
        currentSerieStep1.positions.forEach(asset => {
            portfolioCost += asset.amount * asset.unitaryCost
            console.log(asset.ticker, "ticko")
            const { register } = getLastValidPrice(asset.ticker)
            const positionVal = register.close * asset.amount
            portfolioValue += positionVal
        })
        if (validDates.current.length > 1) {
            dayBefore = validDates.current[validDates.current.length - 2]
            lastDaySerieStep2 = state.portfolioSeries[dayBefore]
            console.log(lastDaySerieStep2, dayBefore, "tuntu")
            lastIncome = lastDaySerieStep2.accruedYield
            incomeDiff = state.generatedSeries.dates[today].income - state.generatedSeries.dates[dayBefore].income
        } else {
            incomeDiff = state.generatedSeries.dates[today].income
        }
        console.log(lastDaySerieStep2, "lolu")
        console.log(validDates.length)
        const accruedIncome = validDates.current.length <= 1 ?
            incomeDiff : incomeDiff + lastDaySerieStep2["accruedIncome"]
        const accruedYield = (portfolioValue + accruedIncome) / portfolioCost
        if (validDates.current.length <= 1) { //handle first day
            liquidativeValue = 1000
            change = 0
        }
        else {
            // no podemos hacer esto ya uqe estamos repercutiendo el coste a la rentsabilidad real.
            //deberiamos calcular la rentabilidad a partir del change diario de las acciones del portfolioHistory, y multiplicar ese porcentaje por su peso relativo en cartera
            change = (accruedYield - lastIncome) / lastIncome
            liquidativeValue = lastDaySerieStep2.liquidativeValue * (1 + change)
        }
        // state.generatedSeries.dates[validDates[validDates.length - 1]].income


        const seriesStep2Copy = { ...seriesStep2 }
        seriesStep2Copy[today] = {
            portfolioCost,
            portfolioValue,
            change,
            accruedYield,
            liquidativeValue,
            accruedIncome,
            incomeDiff
        }
        console.log("execuuuted")
        cb(seriesStep2Copy)
    }


    const generateSerie = (cb) => {
        let masterSerie = {}
        let liquidativeInitial = 1000
        let accruedIncome = 0
        let change, lastDate, lastIncome, stockClosePrice, validDate;
        let lastPricePolifill = {};
        let wtf = []
        console.log(state.generatedSeries, "que puta pasaaa")
        const dateKeys = Object.keys(state.generatedSeries.dates)
        console.log(dateKeys, "datekeyss")
        dateKeys.forEach((date, index) => {
            console.log(date, state.portfolioHistory, state.portfolioHistory[date], "wotafuck")

            let portfolioCost = 0
            let portfolioValue = 0
            state.generatedSeries.dates[date].positions.forEach(asset => {
                portfolioCost += asset.amount * asset.unitaryCost
                if (state.portfolioHistory[date]) {
                    validDate = date
                } else {
                    validDate = getLastGeneralDate(date)
                }
                if (state.portfolioHistory[validDate][asset.ticker]) {


                    //console.log(asset.ticker, "tika")
                    // console.log(date, asset.ticker, "akuuu")
                    stockClosePrice = state.portfolioHistory[validDate][asset.ticker.toUpperCase()].close
                    lastPricePolifill[asset.ticker] = stockClosePrice
                } else {
                    const { register } = getLastValidPrice(asset.ticker, { date: validDate })
                    stockClosePrice = register.close
                }

                const positionVal = stockClosePrice * asset.amount
                portfolioValue += positionVal
            })
            //poner lastPorfolioVal  
            let incomeDiff

            if (index === 0) {
                incomeDiff = state.generatedSeries.dates[date].income
            } else {
                incomeDiff = state.generatedSeries.dates[date].income -
                    state.generatedSeries.dates[validDates.current[validDates.current.length - 1]].income
            }
            accruedIncome += incomeDiff

            const accruedYield = (portfolioValue + accruedIncome) / portfolioCost
            if (index === 0) {
                change = 0
            } else {
                lastDate = validDates.current[validDates.current.length - 1]
                lastIncome = masterSerie[lastDate].accruedYield
                change = (accruedYield - lastIncome) / lastIncome
                wtf = [...wtf, change]
            }
            console.log(lastIncome)
            const liquidativeValue = liquidativeInitial * (1 + change)
            liquidativeInitial = liquidativeValue
            masterSerie = {
                ...masterSerie,
                [date]: {
                    portfolioCost,
                    portfolioValue,
                    change,
                    accruedYield,
                    liquidativeValue,
                    incomeDiff,
                    accruedIncome
                }
            }
            //we should store this array in the context to acces easily in the updateSeries
            validDates.current = [...validDates.current, date]

        })
        console.log(wtf)
        setRendi(masterSerie)

        cb(masterSerie)
    }

    console.log(rendi, "rendiiiiii")
    console.log(state.generatedSeries, "muuu")

    useEffect(() => {
        console.log(state.areHistoricPricesReady, state.areGeneratedSeriesReady, "que cohone")
        if (userRefreshed.current && state.areHistoricPricesReady && state.areGeneratedSeriesReady) {
            generateSerie((result) => {
                dispatch({ type: "STORE_GENERATED_READY_SERIES", payload: result })
            })
            userRefreshed.current = false
        } else if (!userRefreshed.current && state.areHistoricPricesReady && state.areGeneratedSeriesReady) {
            updateSerie((result) => {
                dispatch({ type: "STORE_GENERATED_READY_SERIES", payload: result })
            })
        }

        // if (state.areHistoricPricesReady && Object.keys(state.generatedSeries).length > 0) {
        //     generateSerie()
        // }
    }, [state.generatedSeries, state.areHistoricPricesReady, state.areGeneratedSeriesReady])

}