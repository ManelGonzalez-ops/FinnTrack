import {
  Button, Dialog, DialogActions, DialogContentText, DialogTitle, Grow, IconButton, makeStyles, Paper, Tooltip,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import HelpIcon from '@material-ui/icons/Help';
import styled from "styled-components";
import PropTypes from 'prop-types';
import { useDataLayer } from '../Context';
// import { useEngine } from '../portfolio/Engine'
import { PortfolioPriceChart } from '../portfolio/PortfolioPriceChart';
import { useCompaniesChange } from '../portfolio/useCompaniesChange';
import { useUserLayer } from '../UserContext';
import { AssetStructure } from './AssetStructure';
import { LateralSection } from './LateralSection';
import { Marcador2 } from './Marcador2';
import { PerformanceStructure } from './PerformanceStructure';
import { PerformanceStructureB } from './PerformanceStructureB';
import Positions from './Positions';
import { usePortfolioGenerator } from "../portfolio/portfolioGenerator2";

const netReturnHelper = "this is the net return calculated from daily close prices";
const byCompany = "this shows the daily return for each individual asset over the time";
const weigthed = "this shows the real impact of every indivual asset on the daily net return of the investment portfolio as a whole";

export const Middleware = (props) => {
  usePortfolioGenerator();
  const { state } = useDataLayer();
  const { portfolioSeriesReady, stockLibrary } = state;
  const { userState } = useUserLayer();

  // we need to check that potfolio history is not empty before render userMain
  // and we need to check we have all posesion's historical prices

  const { available, loading } = useCompaniesChange();
  console.log(state.stockLibrary, "stokklibrai");
  if (!userState.isAuthenticated) {
    return <Redirect to={{
      pathname: "/login",
      search: "?redirect=portfolio",
    }} />;
  }
  if(!state.setPruebaReady){
    return <p>fetching stats...</p>
  }
  if (!state.stockLibrary.length) {
    return <NoUnitsDialog />;
  }
  if (!state.areHistoricPricesReady) {
    return <p>Initializing...</p>
  }
  return (
    // tenemos que crear un useEngine para generar el portfolioHistory

    <main className="dasboard-grid--desktop">
      <div className="principal">

        {/* <div>
                {posessionsReady ?
                    <Component /> : <div>loading...</div>}
                </div> */}
        <div className="">

          <HeaderChart title="Net Return" helperText={netReturnHelper} />

          <PortfolioPriceChart datos={state.portfolioSeries}
          // quotes={quotes}
          />
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

  );
};

const TansitionGrow = React.forwardRef((props, ref) => (
  <Grow ref={ref} {...props} />
));

const NoUnitsDialog = () => {
  const history = useHistory();
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    history.push("/");
  };
  return <Dialog
    TransitionComponent={TansitionGrow}
    open={open}
    onClose={handleClose}
  >
    <DialogTitle>Don't have any stock yet</DialogTitle>
    <DialogContentText>
      Start adding stocks to be able to see performance metrics
            </DialogContentText>
    <DialogActions>
      <Button
        onClick={handleClose}
      >
        Ok
                </Button>
    </DialogActions>
  </Dialog >;
};

const StyledContainer = styled.div({
  height: "400px",
  display: "flex",
  flexDirection: "column",
});

const StyledHeader = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
const HeaderChart = ({ title, helperText }) => (
  <StyledHeader className="chart-header">
    <h3>{title}</h3>
    <Tooltip title={helperText} enterDelay={500} leaveDelay={200}>
      <IconButton size="small">
        <HelpIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </StyledHeader>
);

HeaderChart.propsTypes = {
  title: PropTypes.string.isRequired,
  helperText: PropTypes.string,
};
