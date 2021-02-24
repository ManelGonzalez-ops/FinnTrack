import React, { useEffect, useState } from 'react'
import { useDataLayer } from '../Context'
import { convertHumanToUnixInit } from '../utils/datesUtils'
import { rounder } from '../utils/numFormatter'

export const useCompaniesChange = () => {

    const { state: { generatedSeries, portfolioHistory, areHistoricPricesReady, currentPossesions }, dispatch } = useDataLayer()
    const [{ available, loading }, setAvailability] = useState({ available: false, loading: true })
    const generateSeries = () => {
        let result = {}
        //inicialize our object with ticker keys as empty arr
        currentPossesions.stocks.forEach(({ ticker }) => {
            result = {
                ...result,
                [ticker]: []
            }
        })
        let change = 0
        //aqui deberiamos cojer solo las que tienen mayor % peso
        //ojo al generatedSeries que puede que no se haya creao aun

        
        Object.keys(generatedSeries.data.dates).forEach(date => {

            //**si es indefinido, y es el primer día, close será la quote y prevDayPrice será el coste (en generatedSeries)
            if (portfolioHistory[date] !== undefined) {
                //si es indefinido usamos la quote
                let unixDate = convertHumanToUnixInit(date)
                Object.keys(portfolioHistory[date]).forEach(ticker => {
                    const wasInPort = generatedSeries.data.dates[date].positions.find(item => ticker === item.ticker)
                    if (wasInPort) {

                        const { close } = portfolioHistory[date][ticker]
                        const prevDayPrice = result[ticker] && result[ticker].length > 0 && result[ticker][result[ticker].length - 1][2]
                        if (prevDayPrice) {
                            //mira aqui
                            change = (close - prevDayPrice) * 100 / prevDayPrice
                        }
                        result = {
                            ...result,
                            [ticker]:
                                [
                                    ...result[ticker],
                                    [unixDate, rounder(change), close]
                                ]
                        }
                    }
                })
            }
        })
        console.log(result, "compachnage")
        return result
    }

    useEffect(() => {
        if (!Object.keys(portfolioHistory).length) {
            setAvailability({ loading: false, available: false })
            return
        }
        else if (areHistoricPricesReady && generatedSeries.ready) {
            const dataset = generateSeries()
            dispatch({ type: "STORE_COMPANIES_CHANGE", payload: dataset })
            setAvailability({ loading: false, available: true })
        }
    }, [areHistoricPricesReady, generatedSeries])
    return { available, loading }
}
