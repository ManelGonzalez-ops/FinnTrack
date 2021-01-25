import { Paper } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDataLayer } from '../Context'
// import { useEngine } from '../portfolio/Engine'
import { PortfolioPriceChart } from '../portfolio/PortfolioPriceChart'
import { AssetStructure } from './AssetStructure'
import { LateralSection } from './LateralSection'
import { Marcador2 } from './Marcador2'
import { PerformanceStructure } from './PerformanceStructure'
import { PerformanceStructureB } from './PerformanceStructureB'
import { Positions } from './Positions'

export const Middleware = (props) => {
    const Component = props.component
    const { state } = useDataLayer()
    const [posessionsReady, setPossesionsReady] = useState(false)
    const [portfolioChartReady, setPortfolioChartReady] = useState(false)
    //we need to check that potfolio history is not empty before render userMain
    //and we need to check we have all posesion's historical prices
    useEffect(() => {
        if (state.areHistoricPricesReady) {
            setPossesionsReady(true)
        }
    }, [state.areHistoricPricesReady])
    useEffect(() => {
        if (state.portfolioSeries && Object.keys(state.portfolioSeries).length > 0) {
            setPortfolioChartReady(true)
        }
    }, [state.portfolioSeries])
    return (
        //tenemos que crear un useEngine para generar el portfolioHistory
        <div>
            <div class="dasboard-grid--desktop">
                <div className="principal">

                    {/* <div>
                {posessionsReady ?
                    <Component /> : <div>loading...</div>}
            </div> */}
                    
                        {portfolioChartReady && <PortfolioPriceChart datos={state.portfolioSeries} title="profitability over investment" />}
                   
                    <PerformanceStructure/>
                    <PerformanceStructureB/>
                </div>
                <div className="secondary">
                    <Positions />
                    <AssetStructure />
                </div>
            </div>
        </div>
    )
}
