import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, InputBase, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TextField, useTheme } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { CustomCircularProgress } from '../components/components/CustomCircularProgress'
import { useDataLayer } from '../Context'
import { useUserLayer } from '../UserContext'
import { convertUnixToHuman } from '../utils/datesUtils'
import { formatter } from '../utils/numFormatter'
import { PurchaseDialog } from "./PurchaseDialog"
import styled from "styled-components"
import LockIcon from '@material-ui/icons/Lock';
import { Link } from 'react-router-dom'
import { Transition } from 'react-transition-group'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { useLocation } from 'react-use'

const date = convertUnixToHuman(Date.now())

const useStyles = makeStyles({
    root: {
        color: "white !Important"
    }
})

const LoginMessage = styled.div({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
})

const getStockPossesion = (ticker, possesions) => {
    const alreadyOwned = possesions.stocks.find(stock => stock.ticker === ticker)
    return alreadyOwned ? alreadyOwned.amount : 0
}

export const StockShop = ({ ticker, currentPrice, loading, error, assetType, fundId = null }) => {

    const { state, dispatch } = useDataLayer()
    const { setPruebaReady } = state
    const theme = useTheme()

    //const userInfo = useAuth()

    const { userState } = useUserLayer()


    console.log(currentPrice, "preciooo")
    const [qty, setQty] = useState(1)
    const [orderTotal, setOrderTotal] = useState("")
    const [modalOpen, setModalOpen] = React.useState(false);
    const [operationType, setOperationType] = React.useState("buy")
    const restartPortfolio = useRef(false)
    const [open, setOpen] = useState(false)
    const [errorModal, setErrorModal] = useState({ open: false, msg: "" })
    const location = useLocation()
    const [tipo, setTipo] = useState("")
    const classes = useStyles()
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
        //this is to close the first modal
        setOpen(false)
        setModalOpen(false)
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
                        ticker: ticker,
                        amount: qty,
                        price: currentPrice,
                        date,
                        isFirstOperation,
                        assetType,
                        fundId
                    }
                })
            })
                .then(success => {
                    //means we have stored it in database
                    dispatch({
                        type: "ADD_PORTFOLIO_CURRENT_POSSESIONS",
                        payload: {
                            ticker: ticker,
                            amount: qty,
                            operationType,
                            cashNetOperation: orderTotal,
                            date,
                            unitaryPrice: currentPrice,
                            fundId
                        }
                    })
                    dispatch({
                        type: "ADD_UNIQUE_STOCKS",
                        payload: {
                            ticker: ticker,
                        }
                    })
                    dispatch({
                        type: "STOCK_OPERATION",
                        payload: {
                            date,
                            operationType,
                            amount: qty,
                            ticker: ticker,
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


    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }



    const handleType = (e, value) => {
        console.log(value, "tiipu")
        setOperationType(value)
    }

    const showErrorModal = (text) => {
        console.log("showww wrro modal")
        setErrorModal({ open: true, text })
    }

    const checkIsValidOperation = () => {
        console.log("ejecuuuuuuua")
        if (operationType === "buy" &&
            orderTotal > state.currentPossesions.userCash) {

            return showErrorModal("Not enough cash to perform operation");
        }

        console.log(getStockPossesion(ticker, state.currentPossesions), "que cantidad teniamos")
        if (operationType === "sell" &&
            getStockPossesion(ticker, state.currentPossesions) < qty) {

            showErrorModal("You are selling more units than what you actually own")
            return
        }

        setModalOpen(true)
    }

    if (!userState.isAuthenticated) {
        return (
            <LoginMessage>
                <p style={{ marginBottom: "10px" }}>
                    <Link to={{
                        pathname: "/login",
                        state: { background: location }
                    }}>
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
                    <ErrorDialog {...{ errorModal, setErrorModal }} />
                    <Dialogo1 {...{ open, handleClose, currentPrice, orderTotal, setQty, qty, operationType, handleType, checkIsValidOperation }} />

                    <Button
                        onClick={handleOpen}
                        aria-label="buy or sell asset"
                        variant="contained"
                        style={{ background: theme.palette.success.main, color: "white" }}
                        size="large"
                        startIcon={<AttachMoneyIcon />}
                    >
                        Operate
                    </Button>
                    <PurchaseDialog
                        {...{ modalOpen, qty, orderTotal, ticker, submitOrder, operationType, setOpen, setModalOpen }}
                    />

                </div>
            }
        </div>
    )
}

const StyledOp = styled.span(props => ({
    color: props.operationType === "buy" ? "#3f51b5"
        :
        "#f50057"
}))

const Dialogo1 = ({ open, handleClose, currentPrice, orderTotal, setQty, qty, operationType, handleType, checkIsValidOperation }) => {
    const theme = useTheme()
    return (

        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullWidth={true}
            maxWidth="xs"
            disableEnforceFocus={true}
            disableAutoFocus
        //2hours lost. this was making chrome browser to magically disable the up arrow of the [input="number"] 
        //onMouseMove={e => e.preventDefault()}

        >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <DialogTitle id="alert-dialog-slide-title">

                    How much do you want to
                 <StyledOp {...{ operationType }}> {operationType}</StyledOp>
                 ?
                </DialogTitle>
                <DialogActions>
                    <ToggleButtonGroup aria-label="buy or sell"
                        exclusive
                        onChange={handleType}
                        value={operationType}
                        orientation="vertical"
                    >
                        {
                            [["buy", theme.palette.primary.main, theme.palette.primary.light],
                            ["sell", theme.palette.secondary.main, theme.palette.secondary.light]]
                                .map((op) => (
                                    <ToggleButton
                                        key={op[0]}
                                        value={op[0]}
                                        //classes={{ root: classes.root }}
                                        style={op[0] === operationType ? { background: op[1], color: "white" } : null}
                                        variant="contained"

                                    >
                                        {op[0]}
                                    </ToggleButton>
                                ))}
                    </ToggleButtonGroup>
                </DialogActions>
            </div>

            <DialogContent>

                <List
                    id="alert-dialog-slide-description">
                    <ListItem>
                        <ListItemText primary="price/ud" />
                        <ListItemSecondaryAction>
                            <p>{formatter.format((currentPrice))}</p>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemText>
                            Choose Quantity
                        </ListItemText>
                        <ListItemSecondaryAction>
                            <TextField
                                value={qty}
                                onChange={(e) => { setQty(e.target.value) }}
                                inputProps={{ type: 'number', min: 0 }}
                                style={{ width: "50px" }}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText>
                            Total Value
                        </ListItemText>
                        <ListItemSecondaryAction>
                            {formatter.format(orderTotal)}
                        </ListItemSecondaryAction>
                    </ListItem>
                    {/* <div
                        className="total-price">
                        
                    </div> */}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary"
                    variant="outlined"
                    color="secondary"
                >
                    Cancel
          </Button>
                <Button onClick={checkIsValidOperation} color="primary"
                    disabled={!operationType}
                    variant="outlined"

                >
                    Submit
          </Button>
                {!operationType && <span>Please select operation type</span>}
            </DialogActions>
        </Dialog >
    )
}

const ErrorDialog = ({ errorModal, setErrorModal }) => {
    return (
        <Dialog
            open={errorModal.open}
            //TransitionComponent={Transition}
            //keepMounted
            onClose={() => { setErrorModal({ open: false }) }}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullWidth={true}
            maxWidth="xs"
        >
            <DialogTitle>Operation is not valid</DialogTitle>
            <DialogContent>
                {errorModal.text}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => { setErrorModal({ open: false }) }}
                    color="secondary">Close</Button>
            </DialogActions>
        </Dialog>
    )
}