import { Button } from '@material-ui/core';
import React, { useEffect, useReducer, useState } from 'react'
import { Searcher4 } from "../components/Searcher4";
import { Selections } from './Selections.js';
import {Register} from "../Auth/Register";
import {useUserLayer} from "../UserContext";
import {useHistory, useLocation} from "react-router-dom";
import {UpdateInfoView} from "../Auth/UpdateInfoView";
import {ProfileSidebar} from "../Auth/ProfileSidebar";

const reducer = (state, action) => {
    let stateCopy
    let target
    switch (action.type) {
        case "ADD_COMPANY":
            return [...state, action.payload]
        case "UPDATE_COMPANY_PRICE":
            stateCopy = [...state]
            target = state.find(item=>item.ticker === action.payload.ticker)
            target.date = action.payload.date
            target.price = action.payload.price
            return stateCopy
        case "UPDATE_AMOUNT":
            stateCopy = [...state]
            target = state.find(item=>item.ticker === action.payload.ticker)
            target.amount = action.payload.amount;
            return stateCopy
        case "UPDATE_OPERATION_TYPE":
            stateCopy = [...state]
            target = state.find(item=>item.ticker === action.payload.ticker)
            target.operationType = action.payload.operationType
            return stateCopy
        default:
            return state
    }
}
const companyOps = [
    {
        ticker: "",
        date: "",
        price: 0,
    }
]
const defaultStats = { date: "", amount: 0, operationType: "buy" }

export const Admin = () => {
    const [selection, setSelection] = useState()
    const {userState: {isAuthenticated, info}} = useUserLayer()
    const [openRegister, setOpenRegister] = useState(false)
    const [userCreated, setUserCreated] = useState()
    const history = useHistory()
    const location = useLocation()
    const [companies, dispatch] = useReducer(reducer, [])

    const fetchDates = async () => {
        const req = await fetch(`${process.env.REACT_APP_API}/api/v1/prices/dates`, {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticker: selection.ticker }),
            method: "POST"
        })
        return await req.json()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        if (selection) {
            try {
                const { startDate: minDate, endDate: maxDate } = await fetchDates()
                console.log(minDate, maxDate, "dates")
                dispatch({ type: "ADD_COMPANY", payload: { ticker: selection.ticker, minDate, maxDate,
                        isFirstOpertion: companies.length?false:true,
                        assetType: "stock",
                        ...defaultStats } })
            }
            catch (err) {
                alert(err)
            }

        }
    }, [selection])

    console.log(companies, "commppi")

    const submitOperations =async()=>{
        const req = await fetch("http://localhost:8001/api/v1/operations/addoperationsBulk", {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({orders: companies, user: info.email}),
            method: "POST"
        })
        return await req.json()
    }
    return (
        <div className="admin">
            <Button onClick={()=>{setOpenRegister(true)}}>Add user</Button>
            <Button variant="contained" color="primary"
                    onClick={() => { history.push("/register?redirect=admin", { background: location }) }}
            >login</Button>
            {openRegister && <Register/>}
            {isAuthenticated && <>
                <Searcher4
                setSelection={setSelection}
            />

                <Selections
            {...{ companies, dispatch }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={submitOperations}
                >Submit operations</Button>
            </>}


        </div>
    )
}
