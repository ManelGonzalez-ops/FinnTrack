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
            let marketVal;
            if(stockHistory && stockHistory.length > 0){
                const lastRegister = stockHistory[stockHistory.length - 1]
                const lastRegisterClosePrice = lastRegister[1]
                marketVal = lastRegisterClosePrice * poss.amount
                
            }else{
                //here means that this is a new stock, and as we just update daily, the market value will be equal to its cost
                const asset = state.currentPossesions.stocks. find(asset=>asset.ticker === poss.ticker)
                marketVal = asset.amount * asset.unitaryCost
            }
            totalMarketVal += marketVal
                arrByCompany = [...arrByCompany,
                {
                    ticker: poss.ticker,
                    marketVal
                }]
        })
        console.log(arrByCompany, "elmarketall")
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
