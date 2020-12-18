import React, { useEffect, useRef, useState } from "react"
import { useDataLayer } from "../Context"
import { convertHumanToUnix } from "../utils/datesUtils"
import { useLogicPruebas } from "./logicPruebasConAdd"
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
    const [missingTicker, setMissingTicker] = useState([])
    const { state, dispatch } = useDataLayer()
    const userRefreshed = useRef(true)
    const getAllTickers = () => {
        console.log(state.currentPossesions.stocks, "que mirda")
        console.log(state.stockLibrary, "aver3")
        let tickars = []
        state.stockLibrary.forEach(item => {
            tickars = [...tickars, item.toUpperCase()]
        })
        // const tickars = state.currentPossesions.stocks.map((item) => item.ticker.toUpperCase())
        // let tickars = []
        // state.userActivity.forEach(operation => {
        //     const { ticker } = operation.details;
        //     if (!tickars.includes(ticker.toUpperCase())) tickars = [...tickars, ticker.toUpperCase()]
        // })
        return tickars
    }
    //WHAT if we don't have any ticker yet??
    const getMissingTicker = () => {
        let _missingTickers = []
        // console.log(JSON.parse(JSON.stringify(state.portfolioHistoryByCompany)), "que wubu")
        console.log(JSON.parse(JSON.stringify(state.stockLibrary)), "que wubu")
        console.log(state.stockLibrary, "que wubu2")
        console.log(JSON.parse(JSON.stringify(tickers)), "que wubu1")
        // Object.keys(state.portfolioHistoryByCompany).forEach(ticker => {
        //     if (!tickers.includes(ticker)) {
        //         _missingTickers = [...missingTicker, ticker]
        //     }
        // })
        state.stockLibrary.forEach(ticker => {
            if (!tickers.includes(ticker.toUpperCase())) {
                _missingTickers = [...missingTicker, ticker]
            }
        })
        console.log(_missingTickers, "jodaaaaaaaaaar")
        return _missingTickers
    }
    const getNewCompanyPrices = () => {

    }
    const getPricesHistory = async (tickers) => {
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
            return data
        }
        catch (err) {
            throw new Error(err, " aquiii puta")
        }
    }

    //only one at a time right now
    const updateData = (data, cb) => {
        const newCompanyData = data[0][missingTicker]
        let portfolioHistoryCopy = { ...state.portfolioHistory }
        let portfolioHistoryByCompanyCopy = { ...state.portfolioHistoryByCompany }
        console.log(portfolioHistoryCopy, "que wobo")
        console.log(newCompanyData, "ku pasau")
        newCompanyData.forEach(register => {
            const date = register.date.split("T")[0]
            if (state.portfolioHistory[date]) {
                portfolioHistoryCopy[date] = {
                    ...portfolioHistoryCopy[date],
                    [missingTicker]: { close: register.close }
                }
            }
            else {
                portfolioHistoryCopy[date] = {
                    [missingTicker]: { close: register.close }
                }
            }
        })
        let newCompanyChartData = newCompanyData.map(register => {
            const date = register.date.split("T")[0]
            return [
                convertHumanToUnix(date),
                register["adjClose"],
                register["adjHigh"],
                register["adjLow"],
                register["adjOpen"]
            ]
        })
        console.log(portfolioHistoryCopy, "que wobo2")
        console.log(newCompanyChartData, "perula", JSON.parse(JSON.stringify(missingTicker)))
        portfolioHistoryByCompanyCopy = {
            ...portfolioHistoryByCompanyCopy,
            [missingTicker]: newCompanyChartData
        }
        console.log(portfolioHistoryByCompanyCopy, "perula1", JSON.parse(JSON.stringify(missingTicker)))
        dispatch({ type: "STORE_PORTFOLIO_HISTORY_BY_COMPANY_CHART_READY", payload: portfolioHistoryByCompanyCopy })


        dispatch({ type: "STORE_PORTFOLIO_HISTORY_BY_DATE", payload: portfolioHistoryCopy })

        cb()
    }

    const prepareData = (arr, cb) => {
        let portfolioHistoryByDate = {}
        let cleanPriceHistoryByCompanies = {};
        console.log(arr, "tumuela")
        arr.forEach(company => {
            //we take the unique key which is the ticker
            console.log(company, "webos")
            const ticker = Object.keys(company)[0]
            if (company[ticker].length > 0) {
                console.log(company[ticker, "pooouto"])
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
            }
        })
        arr.forEach(({ ...company }) => {
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
        console.log(cleanPriceHistoryByCompanies, "pooota")
        dispatch({ type: "STORE_PORTFOLIO_HISTORY_BY_COMPANY_CHART_READY", payload: cleanPriceHistoryByCompanies })
        console.log(cleanPriceHistoryByCompanies, "ku pusu")

        console.log(arr, "averaaaa")
        console.log(portfolioHistoryByDate, "master")
        dispatch({ type: "STORE_PORTFOLIO_HISTORY_BY_DATE", payload: portfolioHistoryByDate })
        cb()
    }


    //this component only rerenders on state update, you only can dismount it by refrshing the page
    // useEffect(() => {
    //     console.log("no mola", state.currentPossesions.stocks)
    //     if (state.currentPossesions.stocks.length > 0) {
    //         if (userRefreshed.current) {
    //             const initialTickers = getAllTickers()
    //             setTickers(initialTickers)
    //         } else {
    //             const result = getMissingTicker()
    //             setMissingTicker(result)
    //         }
    //     }
    // }, [state.currentPossesions.stocks])
    useEffect(() => {
        console.log("no mola", state.currentPossesions.stocks)
        if (state.userActivity.length > 0 && state.setPruebaReady && state.stockLibrary.size > 0) {

            if (userRefreshed.current) {
                const initialTickers = getAllTickers()
                setTickers(initialTickers)
            } else {
                // const result = getMissingTicker()
                // setMissingTicker(result)
            }
        }
    }, [state.userActivity, state.setPruebaReady, state.stockLibrary])

    useEffect(() => {
        console.log("muulda", userRefreshed.current, state.stockLibrary.size)
        if (!userRefreshed.current && state.stockLibrary.size > 0) {
            const result = getMissingTicker()
            setMissingTicker(result)
        }
    }, [state.stockLibrary.size, state.setPruebaReady])

    console.log(tickers, "tickarss")

    useEffect(() => {
        if (tickers.length > 0 && userRefreshed.current) {

            const asyncWrapper = async () => {
                const initialData = await getPricesHistory(tickers)
                console.log(initialData, "datatota")
                prepareData(initialData, () => {
                    //ojo que no teganmos que declarar esto al principio
                    userRefreshed.current = false
                    // historicprices always starts as false
                    dispatch({ type: "SET_ARE_HISTORIC_PRICES_READY", payload: true })
                })
            }
            asyncWrapper()
        }
    }, [tickers])

    useEffect(() => {
        console.log(missingTicker, "missing")
        if (missingTicker.length > 0) {
            dispatch({ type: "SET_ARE_HISTORIC_PRICES_READY", payload: false })
            const asyncWrapper = async () => {
                const missingData = await getPricesHistory(missingTicker)
                updateData(missingData, () => {
                    setMissingTicker([])
                    dispatch({ type: "SET_ARE_HISTORIC_PRICES_READY", payload: true })
                })
            }
            asyncWrapper()
        }
    }, [missingTicker])



    console.log(allData, "aquidata")

}

