import React, { useEffect, useState } from 'react'
import { CustomAreaChart } from '../charts/CustomAreaChart'
import { useDataLayer } from '../Context'
import { convertHumanToUnix } from '../utils/datesUtils'

export const StockDispatcher = ({ ticker }) => {

    const { state, dispatch } = useDataLayer()
    const [datos, setDatos] = useState("")

    const prepareDataRange = (data) => {
        const readyData = data.map(register => {
            //    console.log(register, "que conxuu")
            return [register[0], register[1]]
        })
        //ojo con esto, 
        // dispatch({
        //     type: "STORE_GENERAL_DATA", payload: {
        //         field: "prices",
        //         ticker,
        //         value: readyData
        //     }
        // })
        setDatos(readyData)
    }

    useEffect(() => {
        const companyHistorical = state.portfolioHistoryByCompany[ticker]
        if (companyHistorical) {
            prepareDataRange(companyHistorical)
        }
    }, [])

    console.log(datos, "los putos datos")
    return (
        <>
            {datos &&
                <CustomAreaChart
                    ticker={ticker}
                    {...{ datos }}
                />
            }
        </>
    )
}


// const prepareDataRange = (data) => {
//     console.log("maricoona")
//     let start = false
//     let finish = false
//     let readyData = []
//     Object.keys(data).forEach((date, index) => {
//         if (ticker === "TEF") {
//             console.log(date, "puto indice")
//         }
//         if (date === startDate) {
//             start = true
//             if (ticker === "TEF") {
//                 console.log(ticker, "start", start, finish, readyData, date)
//             }
//         }
//         if (date === endDate && start === true) {
//             finish = true
//             if (ticker === "TEF") {
//                 console.log(ticker, "start", start, finish, readyData, date)
//             }
//         }
//         if (start && !finish) {
//             const dateInfoStock = data[date][ticker]
//             readyData = [...readyData,
//             [convertHumanToUnix(date),
//             dateInfoStock.close]
//             ]
//         }
//     })
//     dispatch({
//         type: "STORE_GENERAL_DATA", payload: {
//             field: "prices",
//             ticker,
//             value: readyData
//         }
//     })
//     setDatos(readyData)
// }