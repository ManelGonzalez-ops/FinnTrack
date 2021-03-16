import { Button, IconButton, makeStyles, Paper, Tooltip } from '@material-ui/core'
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
import { usePortfolioGenerator } from "../portfolio/portfolioGenerator2"
import HelpIcon from '@material-ui/icons/Help';
import styled from "styled-components"

const netReturnHelper = "this is the net return calculated from daily close prices"
const byCompany = "this shows the daily return for each individual asset over the time"
const weigthed = "this shows the real impact of every indivual asset on the daily net return of the investment portfolio as a whole"

const useStyles = makeStyles({

})
export const Middleware = (props) => {
    usePortfolioGenerator()
    const Component = props.component
    const { state } = useDataLayer()
    const { portfolioSeriesReady, stockLibrary } = state
    const { userState } = useUserLayer()

    //we need to check that potfolio history is not empty before render userMain
    //and we need to check we have all posesion's historical prices

    const { available, loading } = useCompaniesChange()

    if (!userState.isAuthenticated) {
        return <Redirect to={{ pathname: "/pruebaLogin" }} />
    }
    return (
        //tenemos que crear un useEngine para generar el portfolioHistory

        <main class="dasboard-grid--desktop">
            <div className="principal">

                {/* <div>
                {posessionsReady ?
                    <Component /> : <div>loading...</div>}
                </div> */}
                <div className="">

                    <HeaderChart title="Net Return" helperText={netReturnHelper} />
                    {portfolioSeriesReady ?
                        <PortfolioPriceChart datos={state.portfolioSeries}
                        //quotes={quotes}
                        />
                        : <p>Loading...</p>

                    }
                </div>
                <div>
                    <HeaderChart title="Net Return by asset" helperText={byCompany} />
                    <PerformanceStructure {...{ available, loading }} />
                </div>
                <div>
                    <HeaderChart title="Weighted net return by asset" helperText={weigthed} />
                    <PerformanceStructureB />
                </div>
            </div>
            <div className="secondary">
                <StyledContainer>
                    
                    <Positions />
                </StyledContainer>
                <div>
                    <HeaderChart title="Portfolio Structure" helperText={weigthed} />
                    <AssetStructure />
                </div>
            </div>
        </main>

    )
}

const StyledContainer = styled.div({
    height: "400px",
    display: "flex",
    flexDirection: "column"
})


const StyledHeader = styled.div({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
})
const HeaderChart = ({ title, helperText }) => {

    return (
        <StyledHeader className="chart-header">
            <h3>{title}</h3>
            <Tooltip title={helperText} enterDelay={500} leaveDelay={200}>
                <IconButton size="small">
                    <HelpIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </StyledHeader>
    )
}