import React, { useEffect, useRef, useState } from 'react'
import { useDataLayer } from '../Context'

export const usePortfolioGenerator = () => {

    const { state, dispatch } = useDataLayer()
    const userRefreshed = useRef(true)
    const [rendi, setRendi] = useState()
    const validDates = useRef([])
    //option 1 : save masterSerie as a object
    //option 2 : save masterSerie as a array

    //generated series has dates that portfolioHistory dont have (weekends stock market is close)

    //we need to update today's income, so we could remove last value and added it again with the correct info
    //this is step2


    const updateSerie = (cb) => {
        var lastDaySerieStep2;
        let change, incomeDiff, dayBefore;
        let lastIncome = 0
        let liquidativeValue = 1000
        const seriesStep2 = state.portfolioSeries
        const seriesStep2Copy = { ...seriesStep2 }
        // const today = Object.keys(seriesStep2)[Object.keys(seriesStep2).length - 1]
        const today = validDates.current[validDates.current.length - 1]

        const currentSerieStep1 = state.generatedSeries.dates[today]
        //const generatedSerieOfToday = state.generatedSeries
        console.log(today, "todaaaay")
        let portfolioCost = 0;
        let portfolioValue = 0;
        console.log(state.portfolioHistory)
        console.log(state.portfolioSeries, "wuta")
        currentSerieStep1.positions.forEach(asset => {
            portfolioCost += asset.amount * asset.unitaryCost
            console.log(asset.ticker, "ticko")
            const stockClosePrice = state.portfolioHistory[today][asset.ticker.toUpperCase()].close
            const positionVal = stockClosePrice * asset.amount
            portfolioValue += positionVal
        })
        if (validDates.current.length > 1) {
            currentSerieStep1.positions.forEach(asset => {

                let valueIncrement = 0
                let lastDate = validDates.current[validDates.current.length - 1]
                console.log(lastDate, "luuust")
                let lastLiquidativeValue = seriesStep2[lastDate].liquidativeValue
                //calculate portfolioValue and costs

                //calculate liquidative Value
                state.generatedSeries.dates[today].positions.forEach(asset => {
                    const stockClosePrice = state.portfolioHistory[today][asset.ticker.toUpperCase()].close
                    const aportacion = calculadorMedia(asset, stockClosePrice, today, lastDate, portfolioValue)
                    console.log(aportacion, "jojo")
                    valueIncrement += aportacion
                })

                liquidativeValue = lastLiquidativeValue * (1 + valueIncrement)
            })
        } 


        seriesStep2Copy[today] = {
            portfolioCost,
            portfolioValue,
            liquidativeValue,
        }
        console.log("execuuuted")
        cb(seriesStep2Copy)
    }

    const calculadorMedia = (asset, stockPrice, date, lastDate, portfolioValue) => {
        console.log(asset.amount, asset.price, portfolioValue, "rururu")
        const relativeSize = (asset.amount * stockPrice) / portfolioValue
        const currentPrice = state.portfolioHistory[date][asset.ticker.toUpperCase()].close
        const lastPrice = state.portfolioHistory[lastDate][asset.ticker.toUpperCase()].close
        const change = (currentPrice - lastPrice) / lastPrice
        //console.log(relativeSize, "rururu")
        //console.log((currentPrice - lastPrice) / lastPrice, "rururu")
        //console.log(change, relativeSize, "rururu")
        const koko = relativeSize * change
        return koko
    }
    const generateSerie = (cb) => {
        let masterSerie = {}
        let liquidativeInitial = 1000
        let accruedIncome = 0
        let change, lastDate, lastIncome, liquidativeValue;
        let wtf = []
        const dateKeys = Object.keys(state.generatedSeries.dates)
        dateKeys.forEach((date, index) => {
            if (state.portfolioHistory[date] !== undefined) {
                let portfolioCost = 0
                let portfolioValue = 0
                state.generatedSeries.dates[date].positions.forEach(asset => {
                    portfolioCost += asset.amount * asset.unitaryCost
                    const stockClosePrice = state.portfolioHistory[date][asset.ticker.toUpperCase()].close
                    const positionVal = stockClosePrice * asset.amount
                    portfolioValue += positionVal
                })
                if (index === 0) {
                    liquidativeValue = liquidativeInitial
                    validDates.current = [...validDates.current, date]
                    masterSerie = {
                        ...masterSerie,
                        [date]: {
                            portfolioCost,
                            portfolioValue,
                            accruedIncome,
                            liquidativeValue
                        }
                    }
                }
                else {
                    let valueIncrement = 0
                    let lastDate = validDates.current[validDates.current.length - 1]
                    console.log(lastDate, "luuust")
                    let lastLiquidativeValue = masterSerie[lastDate].liquidativeValue
                    //calculate portfolioValue and costs

                    //calculate liquidative Value
                    state.generatedSeries.dates[date].positions.forEach(asset => {
                        const stockClosePrice = state.portfolioHistory[date][asset.ticker.toUpperCase()].close
                        const aportacion = calculadorMedia(asset, stockClosePrice, date, lastDate, portfolioValue)
                        console.log(aportacion, "jojo")
                        valueIncrement += aportacion
                    })

                    liquidativeValue = lastLiquidativeValue * (1 + valueIncrement)
                    // let portfolioValue = 0
                    // //poner lastPorfolioVal  
                    // let incomeDiff

                    // if (index === 0) {
                    //     incomeDiff = state.generatedSeries.dates[date].income
                    // } else {
                    //     incomeDiff = state.generatedSeries.dates[date].income -
                    //         state.generatedSeries.dates[validDates.current[validDates.current.length - 1]].income
                    // }
                    // accruedIncome += incomeDiff

                    // const accruedYield = (portfolioValue + accruedIncome) / portfolioCost
                    // if (index === 0) {
                    //     change = 0
                    // } else {
                    //     lastDate = validDates.current[validDates.current.length - 1]
                    //     lastIncome = masterSerie[lastDate].accruedYield
                    //     change = (accruedYield - lastIncome) / lastIncome
                    //     wtf = [...wtf, change]
                    // }
                    // console.log(lastIncome)
                    // const liquidativeValue = liquidativeInitial * (1 + change)
                    // liquidativeInitial = liquidativeValue
                    // masterSerie = {
                    //     ...masterSerie,
                    //     [date]: {
                    //         portfolioCost,
                    //         portfolioValue,
                    //         change,
                    //         accruedYield,
                    //         liquidativeValue,
                    //         incomeDiff,
                    //         accruedIncome
                    //     }
                    // }
                    masterSerie = {
                        ...masterSerie,
                        [date]: {
                            portfolioCost,
                            portfolioValue,
                            accruedIncome,
                            liquidativeValue
                        }
                    }
                    //we should store this array in the context to acces easily in the updateSeries
                    validDates.current = [...validDates.current, date]
                }

            }
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
                userRefreshed.current = false
            })
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