import React from "react"
import {useEffect, useState} from "react";

export const Company =({dispatch, minDate,ticker, maxDate, price, amount, operationType})=>{
    const [date, setDate] = useState(minDate)
    const [loading, setLoading] = useState(false)
    const fetchPrice =async()=>{
        try{
            const req = await fetch(`${process.env.REACT_APP_API}/api/v1/prices`, {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify({ticker, date})
            })
            return await req.json()
        }
        catch(err){
            alert(err)
        }
    }
    const handleDateChange =(e)=>{
        console.log("date change")
        setDate(e.target.value)
    }
    const handleOperationType =(e)=>{
        dispatch({type: "UPDATE_OPERATION_TYPE", payload: {ticker, operationType: e.target.value}})
    }
    const updatePrice =async()=>{
        setLoading(true)
        const price = await fetchPrice()
        setLoading(false)
        dispatch({type: "UPDATE_COMPANY_PRICE", payload: {price: price.close, ticker, date}})
    }
    const updateAmount =(e)=>{
        dispatch({type: "UPDATE_AMOUNT", payload: {ticker, amount: e.target.value}})
    }
    const validDate =(testDate)=>{
        var date_regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        if (!(date_regex.test(testDate))) {
            return false;
        }
        return true
    }
    useEffect(()=>{
        if(loading){
            return
        }

        if(validDate(date)){
            updatePrice()
        }
    }, [date])
    return (<li>
        <p>{ticker}</p>
        <p>{price}</p>
        <input
            type="date"
            onChange={handleDateChange}
            value={date}
            min={minDate}
            max={maxDate}
        />
        <input
            value={amount}
            type="number"
            onChange={updateAmount}
        />
        <select
            value={operationType}
            onChange={handleOperationType}
        >
            <option value="buy">buy</option>
            <option value="sell">sell</option>
        </select>
    </li>)
}