import React, { useEffect, useState } from "react"
import { useDataLayer } from "../Context"
import { convertHumanToUnix } from "../utils/datesUtils"
import { useLogicPruebas } from "./logicPruebas"
import { PortfolioGenerator } from "./portfolioGenerator"
import { PortfolioPriceChart } from "./PortfolioPriceChart"


//1. Deducimos del historial de operaciones los Tickers que necesitamos
//2. Enviamos esos tickers a nuestro servidor, obtnemos sus precios historicos y los devolvemos de vuelta
//3. combinamos y tranformamos esos precios en el cliente y guardamos el resultado en el estado
//4. el resultado nos sirve para conocer el precio de todas las acciones para cualquier fecha y consultarlo de manera muy eficiente


export const useEngine = () => {

    useLogicPruebas()

    const [tickers, setTickers] = useState([])
    const [allData, setAllData] = useState([])

    const { state, dispatch } = useDataLayer()

    const getAllTickers = () => {
        let tickars = []
        state.userActivity.forEach(operation => {
            const { ticker } = operation.details;
            if (!tickars.includes(ticker.toUpperCase())) tickars = [...tickars, ticker.toUpperCase()]
        })
        setTickers(tickars)
    }
    const fechSerever = async (tickers) => {
        console.log(tickers, "tiiiiiiiiiiii")
        try {
            const request = await fetch("http://localhost:8001/portfolio", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(tickers)
            })
            const data = await request.json()
            setAllData(data)
        }
        catch (err) {
            console.log(err)
        }
    }

    const prepareData = (arr) => {
        let portfolioHistoryByDate = {}
        let cleanPriceHistoryByCompanies = {};
        console.log(arr, "tumuela")
        arr.forEach(company => {
            //we take the unique key which is the ticker
            console.log(company, "webos")
            const ticker = Object.keys(company)[0]
            company[ticker].forEach(register => {
                const date = register.date.split("T")[0]
                portfolioHistoryByDate[date] = {
                    ...portfolioHistoryByDate[date],
                    //aqui podriamos poner close high y todos
                    [ticker]: {
                        close: register.close
                    }
                }
            })
        })
        arr.forEach(({...company}) => {
            const ticker = Object.keys(company)[0]
            console.log(ticker, "weba")
            const companyHistory = company[ticker].map(register => {
                const date = register.date.split("T")[0]
                return (
                    [convertHumanToUnix(date),
                    register["adjClose"],
                    register["adjHigh"],
                    register["adjLow"],
                    register["adjOpen"]])
            })
            cleanPriceHistoryByCompanies[ticker] = companyHistory
        })
        dispatch({ type: "STORE_PORTFOLIO_HISTORY_BY_COMPANY_READY", payload: cleanPriceHistoryByCompanies })
        console.log(cleanPriceHistoryByCompanies, "ku pusu")
        
        console.log(arr, "averaaaa")
        console.log(portfolioHistoryByDate, "master")
        dispatch({ type: "STORE_PORTFOLIO_HISTORY_BY_DATE", payload: portfolioHistoryByDate })
    }

    //ojo con los sideEffects

    useEffect(() => {
        getAllTickers()
    }, [state.userActivity])

    useEffect(() => {
        if (tickers.length > 0) {
            fechSerever(tickers)
        }
    }, [tickers])

    useEffect(() => {
        if (allData.length > 0) {
            prepareData(allData)
        }
    }, [allData])


    console.log(allData, "aquidata")

}

