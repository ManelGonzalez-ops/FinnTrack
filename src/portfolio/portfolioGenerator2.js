import React, { useEffect, useRef, useState } from 'react'
import { useDataLayer } from '../Context'
import { useUserLayer } from '../UserContext'
import { convertUnixToHuman } from '../utils/datesUtils'

export const usePortfolioGenerator = () => {

    const { state, dispatch } = useDataLayer()
    const [processing, setProcessing] = useState(true)
    const { portfolioHistory, generatedSeries, areHistoricPricesReady, stockLibrary, portfolioSeriesReady, simulation, addFirstSerie } = state
    const userRefreshed = useRef(true)
    const { userState: { info } } = useUserLayer()
    const validDates = useRef([])
    const polyfillPrices = useRef({})

    const initialDate = useRef(null)
    //option 1 : save masterSerie as a object
    //option 2 : save masterSerie as a array

    //generated series has dates that portfolioHistory dont have (weekends stock market is close)

    //we need to update today's income, so we could remove last value and added it again with the correct info
    //this is step2

    const getLastValidPrice = (ticker) => {
        let fecha
        let register
        for (let date of Object.keys(portfolioHistory).reverse()) {
            if (portfolioHistory[date][ticker]) {
                fecha = date
                register = portfolioHistory[date][ticker]
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
    //     const seriesStep2 = portfolioSeries
    //     const seriesStep2Copy = { ...seriesStep2 }
    //     // const today = Object.keys(seriesStep2)[Object.keys(seriesStep2).length - 1]
    //     const today = convertUnixToHuman(Date.now())

    //     const currentSerieStep1 = generatedSeries.dates[today]
    //     //const generatedSerieOfToday = generatedSeries
    //     console.log(today, "todaaaay")
    //     let portfolioCost = 0;
    //     let portfolioValue = 0;
    //     console.log(portfolioHistory)
    //     console.log(portfolioSeries, "wuta")
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
    //         const stockClosePrice = portfolioHistory[today][asset.ticker.toUpperCase()].close
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

    const getLastPrice = (lastDate, asset) => {
        const theresLastPrice = portfolioHistory[lastDate][asset.ticker.toUpperCase()]
        if (theresLastPrice) {
            return portfolioHistory[lastDate][asset.ticker.toUpperCase()].close
        }
        return polyfillPrices.current[asset.ticker]
    }

    const calculadorMedia = (asset, stockPrice, date, lastDate, portfolioValue) => {

        //console.log(asset.amount, asset.price, portfolioValue, date, lastDate, asset.ticker, "rururu")
        //console.log(portfolioHistory, "historria")
        const relativeSize = (asset.amount * stockPrice) / portfolioValue
        const lastPrice = getLastPrice(lastDate, asset)
        const change = (stockPrice - lastPrice) / lastPrice
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
    const fetchQuotes = (cb) => {
        return fetch("http://localhost:8001/api/portfolio/quotes", {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tickers: stockLibrary }),
            method: "POST"
        })
            .then(res => res.json())
            .then(res => cb(res))
            .catch(err => { throw new Error(err) })
    }
    const generateSerie = (cb, quotes = null, initialDate = null) => {
        console.log(quotes, initialDate, "worker running")
        const worker = new Worker("/worker3.js")
        worker.postMessage({ _portfolioHistory: portfolioHistory, _generatedSeries: generatedSeries, quotes, initialDate })
        worker.onmessage = e => {
            const { portfolioSeries, companiesPerformanceImpact } = e.data
            console.log(portfolioSeries, companiesPerformanceImpact, "portfolioSeries")

            setProcessing(false)

            //we won't store it in case it returns a empty object (means data missing due to is too earlie to get prices)
            if (Object.keys(companiesPerformanceImpact).length) {
                dispatch({ type: "STORE_IMPACT_BY_COMPANY", payload: companiesPerformanceImpact })
            } else {
                dispatch({ type: "COMPANIES_IMPACT_AWAITING" })
            }
            //the same for portfolio price series
            console.log("cuuuuuu")
            if (Object.keys(portfolioSeries).length) {
                console.log("cuuuuuuco")
                cb(portfolioSeries)
            } else {

                //we set the portfolioSeriesReady to true, because it has already been procesed but there's no data yet because firs purchases where made in the weekend. So when user visit dashboard intead of showing loading (as we were procesing) we'll show when data will be available.
                dispatch({ type: "SET_PORTFOLIO_SERIES_AWAITING" })
                
            }
        }
    }
    const generateSeri = (cb) => {
        let masterSerie = {}
        let liquidativeInitial = 1000
        let accruedIncome = 0
        let companiesPerformanceImpact = {}
        let change, lastDate, lastIncome, liquidativeValue;
        let wtf = []
        polyfillPrices.current = {}
        //polifill, if some price is unexpectly missing we will use the last valid price.
        let stocksProcesed = []
        const dateKeys = Object.keys(generatedSeries.data.dates)
        dateKeys.forEach((date, index) => {
            if (portfolioHistory[date] !== undefined) {
                let portfolioCost = 0
                let portfolioValue = 0
                generatedSeries.data.dates[date].positions.forEach(asset => {
                    portfolioCost += asset.amount * asset.unitaryCost
                    const stockRegister = portfolioHistory[date][asset.ticker.toUpperCase()]
                    let stockClosePrice;
                    if (stockRegister === undefined) {
                        let lastValidPrice = polyfillPrices.current[asset.ticker]
                        stockClosePrice = lastValidPrice ? lastValidPrice : asset.unitaryCost
                        polyfillPrices.current[asset.ticker] = stockClosePrice
                    } else {
                        stockClosePrice = stockRegister.close
                        polyfillPrices.current[asset.ticker] = stockClosePrice
                    }
                    console.log(asset.ticker, stockClosePrice, "paro ka")
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
                    //console.log(lastDate, "luuust")
                    let lastLiquidativeValue = masterSerie[lastDate].liquidativeValue
                    //calculate portfolioValue and costs
                    //calculate liquidative Value

                    generatedSeries.data.dates[date].positions.forEach(asset => {
                        let isFirstRecord = false
                        if (!stocksProcesed.includes(asset.ticker.toUpperCase())) {
                            stocksProcesed = [...stocksProcesed, asset.ticker.toUpperCase()]
                            isFirstRecord = true
                        }

                        const stockRegister = portfolioHistory[date][asset.ticker.toUpperCase()]
                        let stockClosePrice;
                        if (stockRegister === undefined) {
                            stockClosePrice = polyfillPrices.current[asset.ticker]
                        } else {
                            stockClosePrice = stockRegister.close
                            //polyfillPrices[asset.ticker] = stockClosePrice
                        }
                        // if (stockClosePrice === undefined) {
                        //     stockClosePrice = getLastValidPrice(asset.ticker.toUpperCase())
                        // }
                        const aportacion = isFirstRecord ? 0 : calculadorMedia(asset, stockClosePrice, date, lastDate, portfolioValue)
                        //console.log(aportacion, "jojo")
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
        cb(masterSerie)
    }

    console.log(generatedSeries, "muuu")

    const storePortfolioDB = (portfolio) => {
        fetch("http://localhost:8001/api/v1/operations/update", {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: info.email, portfolio })
            ,
            method: "POST"
        })
            .then(res => res.json())
            .catch(err => { throw err.message })
    }
    const getInitialDate = async () => {
        const res = await fetch("http://localhost:8001/api/v1/operations/initial", {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: info.email }),
            method: "POST"
        })
        const data = await res.json()
        return data.split("T")[0]
    }


    //triggered after action after fetchquotes is dispatch and state i updated 
    useEffect(() => {
        if (addFirstSerie) {
            if (simulation.quotes) {
                generateSerie((result) => {
                    dispatch({ type: "STORE_PORTFOLIO_SERIES", payload: result })
                    storePortfolioDB(result)
                }, simulation.quotes, initialDate.current)
            }
        }
    }, [simulation])

    const handleSimulatedSeries = async () => {
        initialDate.current = await getInitialDate()
        //that will trigger the useeffect with [siulation] deps of above
        //we do it like this becuase reactContext Consumer is not in sync with Provider inmediately.
        try {
            fetchQuotes((result) => {
                dispatch({ type: "SET_SIMULATION_QUOTES", payload: result[0] })
            })
        }
        catch (err) {
            alert(err.message)
        }
    }

    useEffect(() => {
        console.log(areHistoricPricesReady, "que cohone")
        if (areHistoricPricesReady && generatedSeries.ready && !portfolioSeriesReady) {
            //firstDay
            if (addFirstSerie) {
                handleSimulatedSeries()
            } else {
                //default mode
                generateSerie((result) => {
                    console.log("what de hell")
                    dispatch({ type: "STORE_PORTFOLIO_SERIES", payload: result })
                    storePortfolioDB(result)
                })
            }
        }

    }, [generatedSeries, areHistoricPricesReady, portfolioSeriesReady])

}