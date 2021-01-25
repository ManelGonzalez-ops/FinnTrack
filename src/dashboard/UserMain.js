import React, { useEffect, useState } from 'react'
import { useDataLayer } from '../Context'
import { Marcador } from './Marcador'
import { StockDispatcher } from './StockDispatcher'

export const UserMain = () => {

    const { state } = useDataLayer()
    const [stocks, setStocks] = useState([])
    //const [metadata, setMetadata] = useState("")
    //tenemos que comprobar que cuando entramos al dashboard (por segunda vez), si hay algun stock nuevo que antes no tuviesemos
    useEffect(() => {
        if (state.areHistoricPricesReady > 0) {
            console.log(state.currentPossesions, "los tenemos")
            setStocks(state.currentPossesions.stocks)
            //getHistoricals(state.currentPossesions.stocks)
        }
    }, [state.areHistoricPricesReady])

    

    return (
        <div
            className="user-dashboard"
        >
            { stocks.length > 0
                &&
                stocks.map(asset => {
                    return (
                        <div
                            className="user-dashboard--item"
                            key={asset.ticker}
                        >

                            <StockDispatcher
                                ticker={asset.ticker.toUpperCase()}
                            />
                        </div>
                    )

                }
                )}

        </div>
    )
}


// const getHistoricals = async (posesions) => {
//     console.log(posesions, "posesiones")
//     const tickersArr = posesions.map(item => item.ticker.toUpperCase())
//     try {
//         const request = await fetch("http://localhost:8001/portfolio?dates=true", {
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             method: "POST",
//             body: JSON.stringify(tickersArr)
//         })
//         const datos = await request.json()
//         const readyData = {}
//         datos.forEach(item => {
//             readyData[item.ticker] = { startDate: item.startDate, endDate: item.endDate }
//         })
//         setMetadata(readyData)
//     }
//     catch (err) {
//         console.log(err)
//     }
// }