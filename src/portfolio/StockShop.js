import { Button, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { CustomCircularProgress } from '../components/components/CustomCircularProgress'
import { useDataLayer } from '../Context'
import useAuth from '../useAuth'
import { useUserLayer } from '../UserContext'
import { convertUnixToHuman } from '../utils/datesUtils'
import { formatter } from '../utils/numFormatter'
import { PurchaseDialog } from "./PurchaseDialog"


const date = convertUnixToHuman(Date.now())
export const StockShop = ({ ticker, currentPrice, loading, error, assetType }) => {

    const { state, dispatch } = useDataLayer()
    const {setPruebaReady} = state
    
    //const userInfo = useAuth()

   const {userState} = useUserLayer()
   

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
        if (userState.info.email) {
            let isFirstOperation = state.userActivity.length > 0 ? false: true
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
                    dispatch({type: "RESTART_GENERATED_SERIES"})
                    
                })
                .catch(err=>{console.log(err, "pputa falló")})
        }else{
            alert("please log in")
        }
    }
  
    useEffect(() => {
        //when users buys and its balance change we close firstModal
        console.log("moneychange")
        modalOpen && setModalOpen(false)
        //after that we could add a success modal or animation
    }, [state.currentPossesions.userCash])
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
