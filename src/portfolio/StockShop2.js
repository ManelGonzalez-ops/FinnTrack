import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TextField, useTheme } from '@material-ui/core'
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
import { Transition } from 'react-transition-group'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'

const date = convertUnixToHuman(Date.now())

const useStyles = makeStyles({
    root: {
        color: "white !Important"
    }
})

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
    const [open, setOpen] = useState(false)
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

    // useEffect(() => {
    //     //when users buys and its balance change we close firstModal
    //     console.log("moneychange")
    //     modalOpen && setModalOpen(false)
    //     //after that we could add a success modal or animation
    // }, [state.currentPossesions.userCash])

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const LoginMessage = styled.div({
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    })

    const handleType = (e, value) => {
        console.log(value, "tiipu")
        setOperationType(value)
    }

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
                    <Dialogo1 {...{ open, handleClose, currentPrice, orderTotal, setQty, qty, operationType, handleType, setModalOpen }} />

                    <ButtonGroup variant="contained" aria-label="buy or sell asset">
                        {["buy", "sell"].map((type, index) => (
                            <Button
                                onClick={() => {
                                    setOperationType(type)
                                    //setModalOpen(true)
                                    handleOpen()
                                }}
                                variant="contained"
                                color={index / 1 === 1 ? "secondary" : "primary"}
                            >
                                {type}
                            </Button>
                        ))}
                    </ButtonGroup>

                    <PurchaseDialog
                        {...{ modalOpen, setModalOpen, qty, orderTotal, ticker, submitOrder, operationType, setOpen }}
                    />
                </div>
            }
        </div>
    )
}


const Dialogo1 = ({ open, handleClose, currentPrice, orderTotal, setQty, qty, operationType, handleType, setModalOpen }) => {
    const theme = useTheme()
    const StyledOp = styled.span(props => ({
        color: props.operationType === "buy" ? theme.palette.primary.main
            :
            theme.palette.secondary.main
    }))
    return (
        
        <Dialog
            open={open}
            //TransitionComponent={Transition}
            //keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullWidth={true}
            maxWidth="xs"

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
                                .map((op, index) => (
                                    <ToggleButton
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
                                type="number"
                                value={qty}
                                onChange={(e) => { setQty(parseInt(e.target.value)) }}
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
                <Button onClick={() => setModalOpen(true)} color="primary"
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