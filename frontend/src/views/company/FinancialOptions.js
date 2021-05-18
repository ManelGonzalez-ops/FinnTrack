import { Button, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { useDataLayer } from '../../Context'
import React, { useState, useEffect } from 'react'

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

export const FinancialOptions = ({ setField, field, setRequest, campo, ticker }) => {
    const [open, setOpen] = useState(false)

    const handleFieldChange = (e) => {
        setRequest(prev => ({ ...prev, loading: true, data: "" }))
        setField(e.target.value)
    }

    
    const { state} = useDataLayer()
   

    const handleGetFieldData = (statement) => {
        const lookUpField = assignStatement(statement)
        console.log(lookUpField, "lookUpField")
        campo.current = lookUpField
        if (state.financials[lookUpField][ticker]) {
            setRequest(prev => ({ ...prev, loading: false, data: state.financials[lookUpField][ticker] }))
        } else {
            setRequest(prev => ({ ...prev, loading: true, data: "" }))
            fetch(`https://www.alphavantage.co/query?function=${statement}&symbol=${ticker}&apikey=btm6dp748v6ud360stcg`)
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
        handleGetFieldData(field)
    }, [field])

    return (
        <nav
            className="navigation-right"
        >
            <FormControl >
                <InputLabel id="demo-controlled-open-select-label">Campo</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={() => { setOpen(false) }}
                    onOpen={() => { setOpen(true) }}
                    value={field}
                    onChange={handleFieldChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={"BALANCE_SHEET"}>Balance</MenuItem>
                    <MenuItem value={"INCOME_STATEMENT"}>Beneficios</MenuItem>
                    <MenuItem value={"CASH_FLOW"}>Cash Flow</MenuItem>
                </Select>
            </FormControl>
        </nav>
    )
}


{/* <div
    className="grid-financial-menu"
>
    <div style={{ background: "#403f4c" }}>

    </div>
    <div style={{ background: "#e84855" }}>

    </div>
    <div style={{ background: "#F9DC5C" }}>

    </div>
</div> */}