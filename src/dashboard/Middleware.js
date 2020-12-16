import React, { useEffect, useState } from 'react'
import { useDataLayer } from '../Context'
// import { useEngine } from '../portfolio/Engine'
import { PortfolioPriceChart } from '../portfolio/PortfolioPriceChart'

export const Middleware = (props) => {
    const Component = props.component
    const { state } = useDataLayer()
    const [posessionsReady, setPossesionsReady] = useState(false)
    const [portfolioChartReady, setPortfolioChartReady] = useState(false)
    //we need to check that potfolio history is not empty before render userMain
    //and we need to check we have all posesion's historical prices
    useEffect(() => {
        if (Object.keys(state.generatedSeries).length > 0) {
            setPossesionsReady(true)
        }
    }, [state.generatedSeries])
    useEffect(() => {
        if (state.portfolioSeries && Object.keys(state.portfolioSeries).length > 0) {
            setPortfolioChartReady(true)
        }
    }, [state.portfolioSeries])
    return (
        //tenemos que crear un useEngine para generar el portfolioHistory
        <>
            <div>
                {posessionsReady ?
                    <Component /> : <div>loading...</div>}
            </div>
            <div>
           {portfolioChartReady && <PortfolioPriceChart datos={state.portfolioSeries} />}
            </div>
        </>
    )
}
