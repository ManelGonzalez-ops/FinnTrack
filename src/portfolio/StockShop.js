import { Button, TextField } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { CustomCircularProgress } from '../components/components/CustomCircularProgress'
import { useDataLayer } from '../Context'
import useAuth from '../useAuth'
import { useUserLayer } from '../UserContext'
import { convertUnixToHuman } from '../utils/datesUtils'
import { formatter } from '../utils/numFormatter'
import { PurchaseDialog } from "./PurchaseDialog"
import styled from "styled-components"
import LockIcon from '@material-ui/icons/Lock';
import { Link } from 'react-router-dom'

const date = convertUnixToHuman(Date.now())
export const StockShop = ({ ticker, currentPrice, loading, error, assetType }) => {

    const { state, dispatch } = useDataLayer()
    const { setPruebaReady } = state

    //const userInfo = useAuth()

    const { userState } = useUserLayer()


    console.log(currentPrice, "preciooo")
    const [qty, setQty] = useState(1)
    const [orderTotal, setOrderTotal] = useState("")
    const [modalOpen, setModalOpen] = React.useState(false);
    const [operationType, setOperationType] = React.useState("")
    const restartPortfolio = useRef(false)
    useEffect(() => {
        if (currentPrice) {
            setOrderTotal(currentPrice * qty)
        }
    }, [qty, currentPrice])

    const enableRealtime = () => {
        restartPortfolio.current = true
        //because first day we make real time updates, in normal conditions this is false and portfolioSeries don't get recalculated 
        dispatch({ type: "SET_ARE_HISTORIC_PRICES_READY", payload: true })
        dispatch({ type: "SET_FIRST_SERIE", payload: true })
    }
    const submitOrder = () => {
        if (userState.info.email) {
            let isFirstOperation = state.userActivity.length > 0 ? false : true
            if (isFirstOperation) {
                enableRealtime()
                localStorage.setItem("firstDate", JSON.stringify(Date.now()))
            } else {
                //check if it's still in the first day
                const firstOp = state.userActivity.find(item => item.isFirstOperation)
                if (firstOp.date === date) {
                    enableRealtime()
                }
            }

            fetch("http://localhost:8001/api/v1/operations/addoperation", {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    user: userState.info.email,
                    order: {
                        operationType,
                        ticker,
                        amount: qty,
                        price: currentPrice,
                        date,
                        isFirstOperation,
                        assetType
                    }
                })
            })
                .then(success => {
                    //means we have stored it in database
                    dispatch({
                        type: "ADD_PORTFOLIO_CURRENT_POSSESIONS",
                        payload: {
                            ticker,
                            amount: qty,
                            operationType,
                            cashNetOperation: orderTotal,
                            date,
                            unitaryPrice: currentPrice
                        }
                    })
                    dispatch({
                        type: "ADD_UNIQUE_STOCKS",
                        payload: {
                            ticker,
                        }
                    })
                    dispatch({
                        type: "STOCK_OPERATION",
                        payload: {
                            date,
                            operationType,
                            amount: qty,
                            ticker,
                            unitPrice: currentPrice
                        }
                    })
                    dispatch({ type: "RESTART_GENERATED_SERIES" })
                    if (restartPortfolio.current) {
                        dispatch({ type: "RESTART_PORTFOLIO_SERIES" })
                    }

                })
                .catch(err => { console.log(err, "pputa falló") })
        } else {
            alert("please log in")
        }
    }

    useEffect(() => {
        //when users buys and its balance change we close firstModal
        console.log("moneychange")
        modalOpen && setModalOpen(false)
        //after that we could add a success modal or animation
    }, [state.currentPossesions.userCash])

    const LoginMessage = styled.div({
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    })
    if (!userState.isAuthenticated) {
        return (
            <LoginMessage>
                <p style={{ marginBottom: "10px" }}>
                    <Link to="/pruebaLogin">
                        Login</Link> to invest</p>
                <LockIcon />
            </LoginMessage>
        )
    }
    return (
        <div className="stock-shop">
            {loading && <CustomCircularProgress />}
            {error && <p>{error}</p>}
            {/* prueba momentanea */}
            { !setPruebaReady ? <div>Loading initial data...</div>
                : currentPrice &&
                <div>
                    <p>{formatter.format((currentPrice))}</p>
                    <TextField
                        type="number"
                        value={qty}
                        onChange={(e) => { setQty(parseInt(e.target.value)) }}
                    />
                    <div
                        className="total-price">
                        {formatter.format(orderTotal)}
                    </div>
                    {["buy", "sell"].map(type => (
                        <Button
                            onClick={() => {
                                setOperationType(type)
                                setModalOpen(true)
                            }}
                            variant="contained"
                            color="primary"
                        >
                            {type}
                        </Button>
                    ))}


                    <PurchaseDialog
                        {...{ modalOpen, setModalOpen, qty, orderTotal, ticker, submitOrder, operationType }}
                    />
                </div>
            }
        </div>
    )
}
