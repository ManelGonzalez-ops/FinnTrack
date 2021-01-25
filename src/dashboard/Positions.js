import React, { useState, useEffect, useReducer, useRef } from 'react'
import { useDataLayer } from '../Context'
import SearchIcon from '@material-ui/icons/Search'
import { Divider, IconButton, Paper, TextField } from '@material-ui/core'
import { formatter } from '../utils/numFormatter'
import { Search } from '@material-ui/icons'
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import { Sorter } from './Sorter'
import { Searcher } from '../components/Searcher'
import { SearcherPositions } from './SearcherPositions'

const logoReducer = (state, action) => {
    switch (action.type) {
        case "SET_LOADING":
            return {
                ...state,
                loading: true
            }
        case "SET_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case "SET_SUCCESS":
            return {
                ...state,
                loading: false,
                logos: action.payload,
                success: true
            }
        default:
            return state
    }
}
export const Positions = () => {
    const { state } = useDataLayer()
    const { companiesChange } = state
    const [readyState, setReadyState] = useState("")
    const [{ quotes, loadingQuotes, errorQuotes }, setQuotes] = useState({ quotes: "" })
    const defaultData = useRef(null)
    const [{ logos, error, loading, success }, dispatch] = useReducer(logoReducer, { logos: [], loading: false, error: null, success: false })
    const [openSearcher, setOpenSearcher] = useState(false)
    const [openSorter, setOpenSorter] = useState(null)
    useEffect(() => {
        const requestAdditionalInfo = (stocks) => {
            dispatch({ type: "SET_LOADING" })
            fetch("http://localhost:8001/api/companies_url", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ positions: stocks })
            })
                .then(res => res.json())
                .then(res => { dispatch({ type: "SET_SUCCESS", payload: res }) })
                .catch(err => { dispatch({ type: "SET_ERROR", payload: err.message }) })
        }
        if (state.currentPossesions.stocks.length > 0) {
            console.log("axactua")
            requestAdditionalInfo(state.currentPossesions.stocks)
            const tickars = state.currentPossesions.stocks.map(item => item.ticker)
            fetchQuotes(tickars)
        }
    }, [state.currentPossesions])

    useEffect(() => {
        console.log(success, quotes, "quee coja")
        if (success && quotes && companiesChange) {
            const stocks = [...state.currentPossesions.stocks]
            console.log(stocks, "stokkkeee")
            const stocksWithLogos = stocks.map(asset => {
                const compChangeArr = companiesChange[asset.ticker]
                asset["change"] = compChangeArr[compChangeArr.length - 1][1]
                const theStockLogo = logos.find(stock => asset.ticker.toUpperCase() === stock.ticker.toUpperCase())
                const { logourl, weburl } = theStockLogo
                //if logo is missing will come as empty string
                asset["logo"] = logourl ?
                    logourl : `https://logo.clearbit.com/${weburl}?size=50`

                asset["name"] = theStockLogo["company_name"]
                const theStockQuote = quotes.find(stock => asset.ticker.toUpperCase() === stock.ticker.toUpperCase())
                asset["value"] = theStockQuote.priceInfo.close * asset.amount
                return asset
            })
            defaultData.current = stocksWithLogos
            setReadyState(stocksWithLogos)
        }
    }, [logos, success, quotes, companiesChange])

    const [selected, setSelected] = useState("")

    const sortState = (field) => {
        switch (field) {
            case "alphabetical":
                setReadyState(prev => prev.sort((a, b) => a - b))
                return
            case "Relevance":
                setReadyState(prev => prev.sort((a, b) => a.value - b.value))
                return
            case "change":
                setReadyState(prev => prev.sort((a, b) => a.change - b.change))
                return
            default:
                return
        };
    }
    const handleSelected = (what) => {
        if (selected === what) {
            setSelected("")
            setOpenSorter(null);
            return
        }
        setSelected(what)
    }
    const handleSorting = (what) => {
        sortState(what)
        setOpenSorter(null);
    }

    const backToInitial = () => {
        setReadyState(defaultData.current)
    }

    const fetchQuotes = (tickers) => {
        fetch("http://localhost:8001/api/portfolio/quotes", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ tickers })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res, "ruuus")
                setQuotes(prev => ({ ...prev, quotes: res[0] }))
            })
    }
    const [query, setQuery] = useState("")
    useEffect(() => {
        if (readyState) {
            const updatedList = defaultData.current.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) || item.ticker.toLowerCase().includes(query.toLowerCase()))
            setReadyState(updatedList)
        }
    }, [query])
    const handleOpenSearcher =()=>{
        setOpenSorter(null)
        setOpenSearcher(true)
    }
    const handleOpenSorter =(e)=>{
        setOpenSearcher(false)
        setOpenSorter(e.currentTarget)
    }
    return (
        <Paper className="positions">
            <header>
                <h3>My Assets</h3>
                <div>
                    {openSearcher &&
                        <SearcherPositions {...{ query, setQuery }} />
                    }
                    {openSorter &&
                        <Sorter {...{ openSorter, setOpenSorter, setReadyState, handleSorting, handleSelected, selected}} />
                    }
                    <IconButton
                        onClick={handleOpenSearcher}
                    >
                        <SearchIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleOpenSorter}
                    >
                        <SortByAlphaIcon />
                    </IconButton>
                </div>
            </header>
            {/* <ul>
                {logos.map(item => <li>
                    {item.logo}
                </li>)}
            </ul> */}
            <div className="positions-body">
                <ul>
                    {readyState && readyState.map(item =>
                        <>
                            <Divider />
                            <li>
                                <img className="logo" src={item.logo} alt={`${item.ticker}-logo`} />
                                <div className="additional-wrap">
                                    <p className="field-2">
                                        <h5>{item.ticker} ({item.name})</h5>
                                        <p>Qty: {item.amount}</p>
                                    </p>
                                    <p className="field-3">
                                        <p>{formatter.format(item.value)}</p>
                                        <p>{item.change}%</p>
                                    </p>
                                </div>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </Paper>
    )
}
