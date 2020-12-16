import React, { useEffect, useState } from 'react'
import { useDataLayer } from '../Context'

export const usePortfolioGenerator = () => {

    const { state, dispatch } = useDataLayer()

    const [rendi, setRendi] = useState()
    //option 1 : save masterSerie as a object
    //option 2 : save masterSerie as a array

    //generated series has dates that portfolioHistory dont have (weekends stock market is close)
    const generateSerie = () => {
        let masterSerie = {}
        let liquidativeInitial = 1000
        let accruedIncome = 0
        let change, lastDate, lastIncome;
        let wtf = []
        const dateKeys = Object.keys(state.generatedSeries.dates)
        let validDates = []
        dateKeys.forEach((date, index) => {
            if (state.portfolioHistory[date] !== undefined) {
                let portfolioCost = 0
                state.generatedSeries.dates[date].positions.forEach(asset => {
                    portfolioCost += asset.amount * asset.unitaryCost
                })

                let portfolioValue = 0
                state.generatedSeries.dates[date].positions.forEach(asset => {
                    //console.log(asset.ticker, "tika")
                    console.log(date, asset.ticker, "akuuu")
                    const stockClosePrice = state.portfolioHistory[date][asset.ticker.toUpperCase()].close
                    const positionVal = stockClosePrice * asset.amount
                    portfolioValue += positionVal
                })                                            //poner lastPorfolioVal  
                let incomeDiff
                
                if (index === 0) {
                    incomeDiff = state.generatedSeries.dates[date].income 
                }else{
                    incomeDiff = state.generatedSeries.dates[date].income - 
                    state.generatedSeries.dates[validDates[validDates.length - 1]].income 
                }
                    accruedIncome += incomeDiff
                
                const accruedYield = (portfolioValue + accruedIncome) / portfolioCost
                if (index === 0) {
                    change = 0
                } else {
                    lastDate = validDates[validDates.length - 1]
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
                validDates = [...validDates, date]
            }
        })
        console.log(wtf)
        setRendi(masterSerie)
        dispatch({type: "STORE_GENERATED_READY_SERIES", payload: masterSerie})
    }

    console.log(rendi, "rendiiiiii")
    console.log(state.generatedSeries, "muuu")

    useEffect(() => {
        if (Object.keys(state.generatedSeries).length > 0) {
            generateSerie()
        }
    }, [state.generatedSeries])
    
}
