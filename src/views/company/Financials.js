import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom"
import { useDataLayer } from '../../Context'
import { FinancialOptions } from './FinancialOptions'
import { TableUI } from './TableUI'


export const Financials = () => {
    const { company } = useParams()
    const { state, dispatch } = useDataLayer()
    const campo = useRef("")
    const [{ data, loading, error }, setRequest] = useState({ data: "", loading: false, error: "" })

    const assignStatement = (field) => {
        switch (field) {
            case "BALANCE_SHEET":
                return "balance"
            case "INCOME_STATEMENT":
                return "income"
            case "CASH_FLOW":
                return "cashflow"
            default:
                return ""
        }
    }

    const handleGetIncome = (statement) => {
        const field = assignStatement(statement)
        campo.current = field
        if (state.financials[field][company]) {
            setRequest(prev => ({ ...prev, data: state.financials[field][company] }))
        } else {
            setRequest(prev => ({ ...prev, loading: true }))
            fetch(`https://www.alphavantage.co/query?function=${statement}&symbol=${company}&apikey=btm6dp748v6ud360stcg`)
                .then(res => res.json())
                .then(res => {
                    if (Object.keys(res).length > 0) {
                        return setRequest(prev => ({ ...prev, loading: false, data: res }))
                    }
                    throw new Error("no data")
                })
                .catch(err => { setRequest(prev => ({ ...prev, loading: false, error: err.message })) })
        }
    }

    useEffect(() => {
        console.log(campo.current, company, "elements")
        if (data && !state.financials[campo.current][company]) {
            dispatch({ type: "SET_FINANCIALS", payload: { field: campo.current, ticker: company, value: data } })
        }
    }, [data])

    return (
        <div>
            {/* {error && <p>{error}</p>}
            <button onClick={() => { handleGetIncome("BALANCE_SHEET") }}>balance</button>
            <button onClick={() => { handleGetIncome("INCOME_STATEMENT") }}>income</button>
            <button onClick={() => { handleGetIncome("CASH_FLOW") }}>cash flow</button>
             */}
             {error && <p>{error}</p>}
              <FinancialOptions {...{ handleGetIncome }} />
             {data && <TableUI
                income={data}
            />}
           
        </div>
    )
}
