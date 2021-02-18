import React, { createContext, useContext, useReducer } from 'react'
import { getUnitaryCostMean } from './utils/financeCalculations'
const Context = createContext()

const checkLocalStorage = (field) => {
    return (
        localStorage.getItem(field) ?
            JSON.parse(localStorage.getItem(field))
            :
            //mirar poque lo he cambia de imprevisto
            ""
    )
}


const initialState = {
    keymetrics: checkLocalStorage("keymetrics"),
    prices: checkLocalStorage("prices"),
    metricsHistorical: checkLocalStorage("metricsHistorical"),
    generalData: {
        indexList: checkLocalStorage("indexList"),

    },
    currentCompany: {
        name: "",
        ticker: "",
    },
    financials: {
        balance: {},
        income: {},
        cashflow: {}
    },
    peers: {

    },
    indexes: {},
    visitedCompanies: [],
    portfolioHistory: {},
    portfolioHistoryByCompany: {},
    userActivity: checkLocalStorage("userActivity") || [],
    currentPossesions: {
        userCash: checkLocalStorage("userCash") || 200000,
        stocks: [
            // {
            //     ticker: "amzn",
            //     amount: 20
            // },
            // {
            //     ticker: "aapl",
            //     amount: 50
            // },
            // {
            //     ticker: "tef",
            //     amount: 80
            // },
        ]
    },
    // currentPossesions: checkLocalStorage("stockCurrentPossesions") || { tef: "", aapl: "", amzn: "" },
    generatedSeries: {
        data: {
            dates: {}
        },
        ready: false
    }
    //acumulatedRendiments : ,
    ,
    areHistoricPricesReady: false,
    areGeneratedSeriesReady: false,
    setPruebaReady: false,
    stockLibrary: [],
    missingTicker: "",
    following: []
}

const companyReducer = (state, action) => {
    console.log(action.payload, "tiiiiipo")
    console.log("heeey")
    switch (action.type) {
        case "STORE_DATA":
            return {
                ...state,
                [action.payload.field]: {
                    ...state[action.payload.field],
                    [action.payload.ticker]: action.payload.value
                }
            }
        case "STORE_GENERAL_DATA":
            console.log(action.payload, "tu putisima madre")
            return {
                ...state,
                generalData: {
                    ...state.generalData,
                    [action.payload.field]: action.payload.value
                }
            }
        case "SET_COMPANY":
            console.log(action, "que puta")
            return {
                ...state,
                currentCompany: {
                    ...state.currentCompany,
                    name: action.payload.name,
                    ticker: action.payload.ticker
                }
            }
        //...state.financials.field de la penultima linea es erroneo muy posiblemente
        case "SET_FINANCIALS":
            return {
                ...state,
                financials: {
                    ...state.financials,
                    [action.payload.field]: {
                        ...state.financials.field,
                        [action.payload.ticker]: action.payload.value
                    }
                }
            }
        case "SET_INDEXES":
            return {
                ...state,
                indexes: {
                    ...state.indexes,
                    [action.payload.field]: {
                        ...state.indexes[action.payload.field],
                        [action.payload.ticker]: action.payload.value
                    }
                }
            }
        case "ADD_VISITED_COMPANY":
            return {
                ...state,
                visitedCompanies: [...state.visitedCompanies, action.payload]
            }
        //good as a helper to generate ready-portfolio-generatedseries
        case "STORE_PORTFOLIO_HISTORY_BY_DATE":
            return {
                ...state,
                portfolioHistory: action.payload
            }
        case "STORE_PORTFOLIO_HISTORY_BY_COMPANY_CHART_READY":
            //by ready we mean this the data format array accepted by Highcharts
            return {
                ...state,
                portfolioHistoryByCompany: action.payload
            }
        //para que necesitamos esto si no lo
        case "STOCK_OPERATION":
            const { operationType, unitPrice } = action.payload
            let isFirstOperation = false
            if (state.userActivity.length === 0) {
                isFirstOperation = true
            }
            const details = operationType === "buy" ?
                { unitaryCost: unitPrice } :
                { priceSold: unitPrice }
            return {
                ...state,
                userActivity: [
                    ...state.userActivity,
                    {
                        date: action.payload.date,
                        operationType,
                        details: {
                            ticker: action.payload.ticker,
                            amount: action.payload.amount,
                            ...details,
                        },
                        isFirstOperation
                    }
                ]
            }
        // case "HANDLE_USER_CASH":
        //     return {
        //         ...state,
        //         userActivity: state.userActivity + action.payload
        //     }
        case "ADD_DIRECT_HISTORY":
            return {
                ...state,
                userActivity: [...state.userActivity, ...action.payload],
                isUserActivityReady: true
            }
        case "SELL_STOCK":
            let balance1 = state.userCash + action.payload
            return {
                ...state,
                userCash: balance1
            }

        case "ADD_PORTFOLIO_CURRENT_POSSESIONS":
            //OJO ESTE LO TENEMOS QUE QITAR
            //action.payload.cashNetOperation = 0
            const { ticker, date, unitaryPrice, amount, assetType } = action.payload
            let newAmount;
            let updatedPosesions;
            const newCash = action.payload.operationType === "buy" ?
                state.currentPossesions.userCash - action.payload.cashNetOperation
                :
                state.currentPossesions.userCash + action.payload.cashNetOperation

            const alreadyOwned = state.currentPossesions.stocks.find(item => item.ticker === ticker)
            //ojo aqui que no nos de un empty object y sea evaluado como true
            if (alreadyOwned) {
                newAmount = action.payload.operationType === "buy" ?
                    alreadyOwned.amount + action.payload.amount
                    :
                    alreadyOwned.amount - action.payload.amount
                if (newAmount === 0) {
                    updatedPosesions = state.currentPossesions.stocks.filter(asset => asset.ticker !== ticker)
                } else {
                    updatedPosesions = state.currentPossesions.stocks.map(asset => {
                        if (asset.ticker === ticker) {
                            asset.amount = newAmount
                            if (action.payload.operationType === "buy") {
                                asset.unitaryCost = getUnitaryCostMean(asset, amount, unitaryPrice)
                            }
                        }
                        return asset
                    })
                }
            }
            else {
                updatedPosesions = [
                    ...state.currentPossesions.stocks,
                    {
                        ticker,
                        amount: action.payload.amount,
                        date,
                        unitaryCost: unitaryPrice,
                        assetType
                    }
                ]

                return {
                    ...state,
                    currentPossesions: {

                        userCash: newCash,
                        stocks: updatedPosesions
                    },
                    missingTicker: ticker
                }

            }
            // const posesionToAdd = newAmount === 0 ?
            //     [...state.currentPossesions.stocks] :
            //     [
            //         ...state.currentPossesions.stocks,
            //         { ticker, amount: newAmount }
            //     ]

            //tenemos que eliminarlo si hemos vendido todas las acciones de un ticker
            return {
                ...state,
                currentPossesions: {
                    userCash: newCash,
                    stocks: updatedPosesions
                }
            }
        // this one could be just temporal as is needed for creating chart (is the trans)
        case "SET_INITIAL_POSSESIONS":
            return {
                ...state,
                currentPossesions: {
                    stocks: action.payload.stocks,
                    userCash: action.payload.cash
                }
            }
        case "ADD_UNIQUE_STOCKS":
            let stateCopy = state.stockLibrary
            if (!stateCopy.includes(action.payload.ticker)) {
                stateCopy = [...stateCopy, action.payload.ticker]
            }
            return {
                ...state,
                stockLibrary: stateCopy,
            }
        case "SET_INITIAL_UNIQUE_STOCKS":
            return {
                ...state,
                stockLibrary: action.payload
            }
        case "STORE_GENERATED_SERIES":
            return {
                ...state,
                generatedSeries: {
                    data: action.payload,
                    ready: true
                }
            }
        case "RESTART_GENERATED_SERIES":
            //we could just add new to existing, but lets simplify logic
            return {
                ...state,
                generatedSeries: {
                    data: "",
                    ready: false
                }
            }
        case "STORE_PORTFOLIO_SERIES":
            return {
                ...state,
                portfolioSeries: action.payload
            }
        case "SET_ARE_HISTORIC_PRICES_READY":
            return {
                ...state,
                areHistoricPricesReady: action.payload
            }
        case "ENABLE":
            console.log("eeenaaaabled")
            return { ...state, setPruebaReady: true }
        case "SET_MISSING_TICKER":
            return {
                ...state,
                missingTicker: [action.payload]
            }
        case "RESTART_MISSING_TICKER":
            return {
                ...state,
                missingTicker: ""
            }
        case "STORE_IMPACT_BY_COMPANY":
            return {
                ...state,
                companiesImpact: action.payload
            }
        //ojo esto es formato gráfica
        case "STORE_COMPANIES_CHANGE":
            return {
                ...state,
                companiesChange: action.payload
            }

        case "STORE_USER_INTEREST":
            return {
                ...state,
                following: action.payload
            }
        default:
            return state
    }
}

export const ContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(companyReducer, initialState)
    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    )
}

export const useDataLayer = () => useContext(Context)