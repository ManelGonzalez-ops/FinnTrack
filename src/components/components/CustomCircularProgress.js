import { CircularProgress, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles({
    root: {
        animationDuration: "550ms",

    },
    circle: {
        strokeLinecap: "round",

    }
})

const defaultStyles = {
    opacity: 0,
    transition: "all 0.1s ease"
}
const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
}

export const CustomCircularProgress = ({ adaptable = false, animState }) => {
    const styles = useStyles()

    console.log("loooader")
    if (adaptable) {
        return (
            <div className="wrapper-referencef"
                style={{...defaultStyles, ...transitionStyles[animState]}}
            >
            <div className="loader-wrapper">
                <CircularProgress
                    disableShrink
                    thickness={4}
                    classes={{
                        root: styles.root,
                        circular: styles.circular
                    }}
                />
            </div>
            </div>
        )
    }


    return (
        <div className="wrapper-reference">
            <span className="loader-wrapper">
                <CircularProgress
                    disableShrink
                    thickness={4}
                    classes={{
                        root: styles.root,
                        circular: styles.circular
                    }}
                />

            </span>
        </div>
    )
}
