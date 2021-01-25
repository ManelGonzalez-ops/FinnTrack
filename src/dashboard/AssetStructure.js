import { Paper } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { DonutChart } from '../charts/DonutChart'
import { useDataLayer } from '../Context'

export const AssetStructure = () => {
    const { state } = useDataLayer()
    const { stocks } = state.currentPossesions
    const [readyData, setReadyData] = useState("")
    const getMarketValueByStock = () => {
        let arrByCompany = []
        let totalMarketVal = 0
        console.log(stocks, "staaacks")
        stocks.forEach(poss => {
            console.log(state.portfolioHistoryByCompany)
            const stockHistory = state.portfolioHistoryByCompany[poss.ticker]
            console.log(stockHistory, "hastory")
            const lastRegister = stockHistory[stockHistory.length - 1]
            const lastRegisterClosePrice = lastRegister[2]
            const marketVal = lastRegisterClosePrice * poss.amount
            totalMarketVal += marketVal
            arrByCompany = [...arrByCompany,
            {
                ticker: poss.ticker,
                marketVal
            }]
        })
        return arrByCompany.map(item => {
            item["proportion"] = (item.marketVal / totalMarketVal) * 100
            return item
        })
    }
    const prepareData =(data, cb)=>{
        cb(data.map(item=>[item.ticker, item.proportion]))
    }
    useEffect(() => {
        if (stocks.length > 0 && state.areHistoricPricesReady) {
            const data = getMarketValueByStock()
            prepareData(data, (result)=>{
                setReadyData(result)
            })
        }
    }, [stocks, state.areHistoricPricesReady])
    return (
        <Paper>
       { readyData.length && <DonutChart data={readyData}/>}
    </Paper>
    )
}
