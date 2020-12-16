import { CircularProgress, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles({
    root: {
        animationDuration: "550ms"
    },
    circle: {
        strokeLinecap: "round",
       
    }
})

export const CustomCircularProgress = () => {
    const styles = useStyles()
    return (
        <div className="wrapper-reference">
        <span className="loader-wrapper">
            <CircularProgress
            disableShrink
            thickness={4}
                classes={{root: styles.root,
                     circular: styles.circular }}
            />

        </span>
        </div>
    )
}
