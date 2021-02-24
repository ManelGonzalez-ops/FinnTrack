import { Paper } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useDataLayer } from '../Context'
// import { useEngine } from '../portfolio/Engine'
import { PortfolioPriceChart } from '../portfolio/PortfolioPriceChart'
import { useCompaniesChange } from '../portfolio/useCompaniesChange'
import { useUserLayer } from '../UserContext'
import { AssetStructure } from './AssetStructure'
import { LateralSection } from './LateralSection'
import { Marcador2 } from './Marcador2'
import { PerformanceStructure } from './PerformanceStructure'
import { PerformanceStructureB } from './PerformanceStructureB'
import { Positions } from './Positions'

export const Middleware = (props) => {
    const Component = props.component
    const { state } = useDataLayer()
    const { portfolioSeriesReady } = state
    const { userState } = useUserLayer()
    const [dataReady, setDataReady] = useState(false)
    //we need to check that potfolio history is not empty before render userMain
    //and we need to check we have all posesion's historical prices

    const { available, loading } = useCompaniesChange()
    if (!userState.isAuthenticated) {
        return <Redirect to={{ pathname: "/pruebaLogin" }} />
    }
    return (
        //tenemos que crear un useEngine para generar el portfolioHistory
        <div>
            <div class="dasboard-grid--desktop">
                <div className="principal">

                    {/* <div>
                {posessionsReady ?
                    <Component /> : <div>loading...</div>}
            </div> */}

                    {portfolioSeriesReady ? <PortfolioPriceChart datos={state.portfolioSeries} title="profitability over investment" /> : <p>Loading...</p>}
                    <PerformanceStructure {...{available, loading}} />
                    <PerformanceStructureB />
                </div>
                <div className="secondary">
                    <Positions />
                    <AssetStructure />
                </div>
            </div>
        </div>
    )
}
