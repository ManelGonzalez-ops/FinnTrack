import { Button, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { CustomCircularProgress } from '../components/components/CustomCircularProgress'
import { useDataLayer } from '../Context'
import useAuth from '../useAuth'
import { convertUnixToHuman } from '../utils/datesUtils'
import { formatter } from '../utils/numFormatter'
import { PurchaseDialog } from "./PurchaseDialog"

export const StockShop = ({ ticker }) => {

    const { state, dispatch } = useDataLayer()
    const [{ currentPrice, loading, error }, setCurrentPrice] = useState({
        currentPrice: "",
        loading: false,
        error: ""
    })
    const userInfo = useAuth()
    console.log(userInfo, "info usuario")
    useEffect(() => {

        const getCurrentPrice = async (ticker) => {
            setCurrentPrice(prev => ({ ...prev, loading: true }))
            try {
                const request = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=btm6dp748v6ud360stcg`)
                const data = await request.json()
                setCurrentPrice(prev => ({ ...prev, loading: false, currentPrice: data.c }))
            }
            catch (err) {
                setCurrentPrice(prev => ({ ...prev, loading: false, error: err.message }))
            }
        }
        if (ticker) {

            getCurrentPrice(ticker)
        }
    }, [ticker])

    console.log(currentPrice, "preciooo")
    const [qty, setQty] = useState(1)
    const [orderTotal, setOrderTotal] = useState("")
    const [modalOpen, setModalOpen] = React.useState(false);
    const [operationType, setOperationType] = React.useState("")
    useEffect(() => {
        if (currentPrice) {
            setOrderTotal(currentPrice * qty)
        }
    }, [qty, currentPrice])

    const submitOrder = () => {
        if (userInfo.email) {

            fetch("http://localhost:8001/api/addoperation", {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    user: userInfo.email,
                    order: {
                        operationType,
                        ticker,
                        amount: qty,
                        price: currentPrice
                    }
                })
            })
                .then(success => {
                    //means we have stored it in database
                    dispatch({
                        type: "ADD_UNIQUE_STOCKS",
                        payload: {
                            ticker,
                        }
                    })
                    dispatch({
                        type: "STOCK_OPERATION",
                        payload: {
                            date: convertUnixToHuman(Date.now()),
                            operationType,
                            amount: qty,
                            ticker,
                            unitPrice: currentPrice
                        }
                    })
                    dispatch({
                        type: "ADD_PORTFOLIO_CURRENT_POSSESIONS",
                        payload: {
                            ticker,
                            amount: qty,
                            operationType,
                            cashNetOperation: orderTotal
                        }
                    })
                })
                .catch(err=>{console.log(err, "pputa falló")})
        }
    }
    const getHumanDate = () => {
        const d = new Date(Date.now())
        const date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear()
    }
    useEffect(() => {
        //when users buys and its balance change we close firstModal
        console.log("moneychange")
        modalOpen && setModalOpen(false)
        //after that we could add a success modal or animation
    }, [state.currentPossesions.userCash])
    return (
        <div>
            {loading && <CustomCircularProgress />}
            {error && <p>{error}</p>}
            { currentPrice &&
                <>
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
                </>
            }
        </div>
    )
}
