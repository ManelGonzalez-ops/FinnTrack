import React, { useEffect, useRef, useState } from "react"
import { useDataLayer } from "../Context"
import { useUserLayer } from "../UserContext"
import { convertHumanToUnixInit } from "../utils/datesUtils"
import { useLogicPruebas } from "./logicPruebasConAdd"


//1. Deducimos del historial de operaciones los Tickers que necesitamos
//2. Enviamos esos tickers a nuestro servidor, obtnemos sus precios historicos y los devolvemos de vuelta
//3. combinamos y tranformamos esos precios en el cliente y guardamos el resultado en el estado
//4. el resultado nos sirve para conocer el precio de todas las acciones para cualquier fecha y consultarlo de manera muy eficiente


export const useEngine = () => {

    useLogicPruebas()

    const { state, dispatch } = useDataLayer()
    const { userState } = useUserLayer()
    const { missingTicker } = state
    const { stocks } = state.currentPossesions

    //WHAT if we don't have any ticker yet?

    const getPricesHistory = async () => {
        console.log(userState.info, "fetch price ejecutao")
        try {
            const request = await fetch(`${process.env.REACT_APP_API}/api/v1/prices/portfolio_prices`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(stocks)
            })
            const data = await request.json()
            return data
        }
        catch (err) {
            throw new Error(err, " aquiii puta")
        }
    }
    //missing ticker is a tuple for now
    //deberiamos retornar una promesa aquí
    // const getPricesHistoryMissingTicker = async (missingTicker) => {
    //     // console.log(missingTicker, "totsstocks missing tikcer")
    //     // console.log(stocks, "totsstocks")
    //     // console.log(JSON.stringify(stocks, "totsstocks"))
    //     //we need arry format in the server so we use filter intead of find
    //     const misingTickerOperationInfo =
    //         stocks.
    //             filter(asset => asset.ticker.toUpperCase() === missingTicker.toUpperCase())
    //     console.log(misingTickerOperationInfo, "woot")
    //     try {
    //         const request = await fetch("http://localhost:8001/portfolio2?missingTicker=true", {
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             method: "POST",
    //             body: JSON.stringify(misingTickerOperationInfo)
    //         })
    //         const data = await request.json()
    //         return data
    //     }
    //     catch (err) {
    //         throw new Error(err, " aquiii puta")
    //     }
    // }


    // //only one at a time right now
    // //this is pointless because we won't know the close proce untill tomorrow
    // //that may be only be usefull when dealing when with real time data
    // const updateData = (data, cb) => {
    //     console.log(data, "la jodida data")
    //     const newCompanyData = data[0][missingTicker]
    //     let portfolioHistoryCopy = { ...state.portfolioHistory }
    //     let portfolioHistoryByCompanyCopy = { ...state.portfolioHistoryByCompany }
    //     console.log(portfolioHistoryCopy, "que wobo")
    //     console.log(newCompanyData, "ku pasau")
    //     newCompanyData.forEach(register => {
    //         const date = register.date.split("T")[0]
    //         if (state.portfolioHistory[date]) {
    //             portfolioHistoryCopy[date] = {
    //                 ...portfolioHistoryCopy[date],
    //                 [missingTicker]: { close: register.close }
    //             }
    //         }
    //         else {
    //             portfolioHistoryCopy[date] = {
    //                 [missingTicker]: { close: register.close }
    //             }
    //         }
    //     })
    //     let newCompanyChartData = newCompanyData.map(register => {
    //         const date = register.date.split("T")[0]
    //         return [
    //             convertHumanToUnixInit(date),
    //             register["adjClose"],
    //             register["adjHigh"],
    //             register["adjLow"],
    //             register["adjOpen"]
    //         ]
    //     })
    //     console.log(portfolioHistoryCopy, "que wobo2")
    //     console.log(newCompanyChartData, "perula", JSON.parse(JSON.stringify(missingTicker)))
    //     portfolioHistoryByCompanyCopy = {
    //         ...portfolioHistoryByCompanyCopy,
    //         [missingTicker]: newCompanyChartData
    //     }
    //     console.log(portfolioHistoryByCompanyCopy, "perula1", JSON.parse(JSON.stringify(missingTicker)))
    //     dispatch({ type: "STORE_PORTFOLIO_HISTORY_BY_COMPANY_CHART_READY", payload: portfolioHistoryByCompanyCopy })


    //     dispatch({ type: "STORE_PORTFOLIO_HISTORY_BY_DATE", payload: portfolioHistoryCopy })

    //     cb()
    // }

    const prepareData = (arr, cb) => {

        console.log(arr, "la arrey")
        const worker = new Worker("/worker.js")
        worker.postMessage(arr)
        worker.onmessage = e => {
            const { portfolioHistoryByDate, portfolioHistoryByCompanies } = e.data
            console.log(portfolioHistoryByDate, portfolioHistoryByCompanies, "errr work")
            dispatch({ type: "STORE_PORTFOLIO_HISTORY_BY_COMPANY_CHART_READY", payload: portfolioHistoryByCompanies })
            dispatch({ type: "STORE_PORTFOLIO_HISTORY_BY_DATE", payload: portfolioHistoryByDate })
            cb()
            console.log(portfolioHistoryByCompanies, "ku pusu")

            console.log(arr, "averaaaa")
            console.log(portfolioHistoryByDate, "master")
        }
    }

    const __init = async () => {
        //get price data of the user possesions
        console.log(stocks.length, "tokkee")
        if (!stocks.length) return
        const initialData = await getPricesHistory()
        console.log(initialData, "initialprices")
        //ojo aquí el type que obtemenos de la initialData, 
        prepareData(initialData, () => {
            dispatch({ type: "SET_ARE_HISTORIC_PRICES_READY", payload: true })
        })
    }

    //initialize the app
    useEffect(() => {

        if (state.setPruebaReady) {
            __init()
        }
    }, [state.setPruebaReady])


    // useEffect(() => {
    //     if(state.setPruebaReady){
    //         console.log(missingTicker, "missingTicker otstia")
    //         dispatch({
    //                 type: "SET_ARE_HISTORIC_PRICES_READY",
    //                 payload: false
    //             })
    //         const asyncWrapper = async () => {
    //             const missingData = await getPricesHistoryMissingTicker(missingTicker)
    //             updateData(missingData, () => {
    //                 dispatch({dispatch: "RESTART_MISSING_TICKER"})
    //                 dispatch({ type: "SET_ARE_HISTORIC_PRICES_READY", payload: true })
    //             })
    //         }
    //         asyncWrapper()
    //     }

    // }, [missingTicker])


}

