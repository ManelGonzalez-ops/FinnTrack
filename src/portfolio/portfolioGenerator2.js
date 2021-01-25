import React, { useEffect, useRef, useState } from 'react'
import { useDataLayer } from '../Context'
import { convertUnixToHuman } from '../utils/datesUtils'

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

    const getLastValidPrice = (ticker) => {
        let fecha
        let register
        for (let date of Object.keys(state.portfolioHistory).reverse()) {
            if (state.portfolioHistory[date][ticker]) {
                fecha = date
                register = state.portfolioHistory[date][ticker]
                break
            }
        }
        return { fecha, register }
    }


    // const updateSerie = (cb) => {
    //     var lastDaySerieStep2;
    //     let change, incomeDiff, dayBefore;
    //     let lastIncome = 0
    //     let liquidativeValue = 1000
    //     const seriesStep2 = state.portfolioSeries
    //     const seriesStep2Copy = { ...seriesStep2 }
    //     // const today = Object.keys(seriesStep2)[Object.keys(seriesStep2).length - 1]
    //     const today = convertUnixToHuman(Date.now())

    //     const currentSerieStep1 = state.generatedSeries.dates[today]
    //     //const generatedSerieOfToday = state.generatedSeries
    //     console.log(today, "todaaaay")
    //     let portfolioCost = 0;
    //     let portfolioValue = 0;
    //     console.log(state.portfolioHistory)
    //     console.log(state.portfolioSeries, "wuta")
    //     currentSerieStep1.positions.forEach(asset => {
    //         portfolioCost += asset.amount * asset.unitaryCost
    //         console.log(asset.ticker, "ticko")
    //         const { register } = getLastValidPrice(asset.ticker)
    //         const positionVal = register.close * asset.amount
    //         portfolioValue += positionVal

    //         let valueIncrement = 0
    //         let lastDate = validDates.current[validDates.current.length - 1]
    //         console.log(lastDate, today, "luuust")
    //         let lastLiquidativeValue = seriesStep2[today].liquidativeValue
    //         //calculate portfolioValue and costs

    //         //calculate liquidative Value
    //         const stockClosePrice = state.portfolioHistory[today][asset.ticker.toUpperCase()].close
    //         const aportacion = calculadorMedia(asset, register.close, today, lastDate, portfolioValue)
    //         console.log(aportacion, "jojo")
    //         valueIncrement += aportacion

    //         liquidativeValue = lastLiquidativeValue * (1 + valueIncrement)

    //     })


    //     seriesStep2Copy[today] = {
    //         portfolioCost,
    //         portfolioValue,
    //         liquidativeValue,
    //     }
    //     console.log("execuuuted")
    //     cb(seriesStep2Copy)
    // }

    const calculadorMedia = (asset, stockPrice, date, lastDate, portfolioValue) => {

        console.log(asset.amount, asset.price, portfolioValue, date, lastDate, asset.ticker, "rururu")
        console.log(state.portfolioHistory, "historria")
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
    const addRelativePerformance = (companiesPerformance, date, aportacion, asset) => {
        const aportacionR = aportacion * 100
        if (Math.abs(aportacionR) < 0.1) {
            const otherCategory = companiesPerformance[date].find(item => item.ticker === "other")
            if (!otherCategory) {
                companiesPerformance[date] = [
                    ...companiesPerformance[date],
                    {
                        ticker: "other",
                        performance: aportacionR
                    }
                ]
            } else {
                otherCategory.performance = otherCategory.performance + aportacionR
            }

        } else {
            companiesPerformance[date] = [...companiesPerformance[date],
            {
                ticker: asset.ticker.toUpperCase(),
                performance: aportacionR
            }
            ]
        }
    }
    const generateSerie = (cb) => {
        let masterSerie = {}
        let liquidativeInitial = 1000
        let accruedIncome = 0
        let companiesPerformanceImpact = {}
        let change, lastDate, lastIncome, liquidativeValue;
        let wtf = []
        //polifill, if some price is unexpectly missing we will use the last valid price.
        let polyfillPrices = {}
        let stocksProcesed = []
        const dateKeys = Object.keys(state.generatedSeries.dates)
        dateKeys.forEach((date, index) => {
            if (state.portfolioHistory[date] !== undefined) {
                let portfolioCost = 0
                let portfolioValue = 0
                state.generatedSeries.dates[date].positions.forEach(asset => {
                    portfolioCost += asset.amount * asset.unitaryCost
                    console.log(date, state.portfolioHistory, state.generatedSeries, asset.ticker, "todddddo")
                    const stockRegister = state.portfolioHistory[date][asset.ticker.toUpperCase()]
                    let stockClosePrice;
                    if (stockRegister === undefined) {
                        stockClosePrice = polyfillPrices[asset.ticker]
                    } else {
                        stockClosePrice = stockRegister.close
                        polyfillPrices[asset.ticker] = stockClosePrice
                    }

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
                    companiesPerformanceImpact[date] = []
                    let valueIncrement = 0
                    let lastDate = validDates.current[validDates.current.length - 1]
                    console.log(lastDate, "luuust")
                    let lastLiquidativeValue = masterSerie[lastDate].liquidativeValue
                    //calculate portfolioValue and costs
                    //calculate liquidative Value

                    state.generatedSeries.dates[date].positions.forEach(asset => {
                        let isFirstRecord = false
                        if (!stocksProcesed.includes(asset.ticker.toUpperCase())) {
                            stocksProcesed = [...stocksProcesed, asset.ticker.toUpperCase()]
                            isFirstRecord = true
                        }

                        const stockRegister = state.portfolioHistory[date][asset.ticker.toUpperCase()]
                        let stockClosePrice;
                        if (stockRegister === undefined) {
                            stockClosePrice = polyfillPrices[asset.ticker]
                        } else {
                            stockClosePrice = stockRegister.close
                            //polyfillPrices[asset.ticker] = stockClosePrice
                        }
                        // if (stockClosePrice === undefined) {
                        //     stockClosePrice = getLastValidPrice(asset.ticker.toUpperCase())
                        // }
                        const aportacion = isFirstRecord ? 0 : calculadorMedia(asset, stockClosePrice, date, lastDate, portfolioValue)
                        console.log(aportacion, "jojo")
                        valueIncrement += aportacion
                        addRelativePerformance(companiesPerformanceImpact, date, aportacion, asset)

                    })

                    liquidativeValue = lastLiquidativeValue * (1 + valueIncrement)

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
        console.log(companiesPerformanceImpact, "perfi")
        console.log(wtf)
        dispatch({ type: "STORE_IMPACT_BY_COMPANY", payload: companiesPerformanceImpact })
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
        }
        // al final no hace falta actualizar la serie al momento
        // else if (!userRefreshed.current && state.areHistoricPricesReady && state.areGeneratedSeriesReady) {
        //     updateSerie((result) => {
        //         dispatch({ type: "STORE_GENERATED_READY_SERIES", payload: result })
        //     })
        // }

    }, [state.generatedSeries, state.areHistoricPricesReady, state.areGeneratedSeriesReady])

}