import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { formatter } from '../utils/numFormatter';
import { Grow } from '@material-ui/core';

const GrowTransition = React.forwardRef((props, ref) => (
    <Grow ref={ref} {...props} />
))

export const PurchaseDialog = ({
    modalOpen,
    setModalOpen,
    ticker,
    qty,
    orderTotal,
    submitOrder,
    operationType
}) => {

    const handleClose = () => {
        setModalOpen(false);
        
    };

    return (
        <div>
            <Dialog
                open={modalOpen}
                onClose={handleClose}
                TransitionComponent={GrowTransition}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You are going to {operationType} {qty} stocks of {ticker} for {formatter.format(orderTotal)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} style={{background: "red"}}
                    variant="contained"
                    >
                        Cancel
          </Button>
                    <Button onClick={submitOrder} color="primary"
                    variant="contained"
                    autoFocus>
                        Confirm
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}