import React, { useEffect, useRef } from 'react'
import { useDataLayer } from './Context'
import { userActivity } from './portfolio/logicPruebasConAdd'

export const useTemporaryPossesions = () => {
    const { state, dispatch } = useDataLayer()
    const length = useRef(0)
    const iteration = useRef(0)
    useEffect(() => {
        if (state.userActivity.length > 0) {
            length.current = state.userActivity.length
            userActivity.forEach((op, index, arr) => {
                console.log(index, "opixxo")
                dispatch({
                    type: "ADD_PORTFOLIO_CURRENT_POSSESIONS",
                    payload: {
                        ticker: op.details.ticker,
                        amount: op.details.amount,
                        operationType: op.operationType,
                        cashNetOperation: 0
                    }
                })
                dispatch({
                    type: "ADD_UNIQUE_STOCKS",
                    payload: {
                        ticker: op.details.ticker,
                    }
                })
                index + 1 === arr.length && dispatch({ type: "ENABLE" })

            })
        }
    }, [state.userActivity])

    // useEffect(() => {
    //     iteration.current += 1
    //     console.log("botonto")
    //     console.log(iteration.current, length.current, "zorrona")
    //     if (iteration.current === 2) {
    //         dispatch({ type: "ENABLE" })
    //     }
    // }, [state.currentPossesions])
}
