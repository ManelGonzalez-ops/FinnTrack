import React, { useState, useEffect, useRef } from "react";
//import {HashRouter, Route, Switch} from "react-dom"

import { Route, Switch, useHistory } from "react-router-dom";


import { makeStyles } from "@material-ui/core/styles";
import { Button, CssBaseline } from "@material-ui/core";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Principal } from "./views/principal/principal";
import { Searcher } from "./components/Searcher";
import { KeymetricsChart } from "./charts/KeymetricsChart"
import { CovidSection2 } from "./views/covid/CovidSection2";
import { News } from "./views/principal/elements/News";
import { Financials } from "./views/company/Financials";
import { useUILayer } from "./ContextUI";
import { CompanySection } from "./views/company/CompanySection";
import { IndexesController } from "./views/indexes/IndexesController";
import { useDataLayer } from "./Context";
import { useEngine } from "./portfolio/Engine";
import { userActivity } from "./portfolio/logicPruebas";
import { UserMain } from "./dashboard/UserMain";
import { Middleware } from "./dashboard/Middleware";
import { useOktaAuth } from '@okta/okta-react';
import { useTemporaryPossesions } from "./useTemporaryPossesions";



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  menuButton: {
    marginRight: 36,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    //display: "flex",
    //alignItems: "center",
    //justifyContent: "flex-end",
    //padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    width: "100%",
    height: "112px",
  },
}));



//we need to check when we buy or sell a new stock, the dashboard charts includes it
const App = () => {

  useEngine()
  const { authState, authService } = useOktaAuth();


  const history = useHistory()
  const [open, setOpen] = React.useState(false);
  const [selection, setSelection] = useState("");
  const classes = useStyles();
  const chart = useRef(null);
  const [expanded, setExpanded] = React.useState([]);
  const { setSidebarOpen } = useUILayer()

  const [width, setWidth] = useState(0);

  const { state, dispatch } = useDataLayer()

  const initial = useRef(true)

  const inicializadorStadoPrueba = () => {
    dispatch({ type: "ADD_DIRECT_HISTORY", payload: userActivity })
  }
  useTemporaryPossesions()
  useEffect(() => {
    inicializadorStadoPrueba()
  }, [])
  useEffect(() => {
    console.log(chart, "puta")
    console.log(chart.current, "puta2")
    if (chart.current && Object.keys(chart.current).length > 0 && !initial.current) {
      setTimeout(() => {
        chart.current.reflow()
      }, 200)

      // if(open && contentCont.current){
      //   console.log("come")
      //   console.log(contentCont.current.offsetWidth)
      //   setWidth(contentCont.current.offsetWidth - (240 + 73)/2);
      // }
      // else {
      //   setWidth(contentCont.current.offsetWidth + (240 - 73)/2)
      // }
    }
    initial.current = false
  }, [open, history])

  console.log(state.areHistoricPricesReady, "ostiau")

  useEffect(() => {
    if (selection) {
      console.log(selection, "que webox")
      const { name, ticker } = selection
      dispatch({ type: "SET_COMPANY", payload: { name, ticker } })
      history.push(`/companies/overview/${selection.ticker}`)
    }
  }, [selection])

  useEffect(() => {
    const { name, ticker } = state.currentCompany
    if (name && ticker) {
      dispatch({
        type: "ADD_VISITED_COMPANY",
        payload: { ticker: ticker.toUpperCase(), name }
      })

    }
  }, [state.currentCompany])

  const handleDrawerClose = () => {
    setExpanded([])
    setSidebarOpen(false)
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setSidebarOpen(true)
    setOpen(true);
  };
  const handleSidebarToggle = (e, nodeId) => {
    setExpanded(nodeId)
  }
  console.log(authState, "tu muelo")
  if (authState.isPending) {
    return <div>puto maricon ...</div>
  }

  const button = authState.isAuthenticated ?
    <button onClick={() => { authService.logout() }}>Logout</button> :
    <button onClick={() => { history.push('/login') }}>Login</button>;

  return (


    <div className={classes.root}>
      <CssBaseline />
      <Navbar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Sidebar {...{ handleDrawerClose, handleDrawerOpen, open, handleSidebarToggle, expanded }} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Button onClick={() => { history.push("/pruebaPorfolio") }}></Button>
        <Switch>
          <Route path="/" exact >
            <Principal setSelection={setSelection} />
          </Route>
          <Route path="/" exact >
              <Searcher setSelection={setSelection} selection={selection}/>
                </Route>
                all company routes will have to be nested
              <Route path="/companies/overview/:company" exact>
            <CompanySection width={width} ref={chart} />
          </Route>
          <Route path="/companies/keymetrics/:company" exact>
            <KeymetricsChart />
          </Route>
          <Route path="/news/:category" exact>
            <News principal={true}/>
            </Route>
          <Route path="/covid19" exact>
            <CovidSection2 />
          </Route>
          <Route path="/companies/financials/:company" exact>
            <Financials />
          </Route>
          <Route path="/indexes/:field" exact>
            <IndexesController />
          </Route>
          <Route path="/search" exact>
            <Searcher {...{ setSelection }} />
          </Route>
          {/* <Route path="/portfolio" exact>
            <Engine />
          </Route> */}
          <Route path="/portfoliof" exact>
            <Middleware component={UserMain} />
          </Route>
        </Switch>
          {button}
          <Button variant="contained" color="primary"
          onClick={()=>{history.push("/register")}}
          >register</Button>
      </main>
    </div>
  );
}

export default App;
