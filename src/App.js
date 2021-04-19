import React, { useState, useEffect, useRef } from "react";
//import {HashRouter, Route, Switch} from "react-dom"

import { Route, Switch, useHistory, useLocation } from "react-router-dom";


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
import { UserMain } from "./dashboard/UserMain";
import { Middleware } from "./dashboard/Middleware2";
import { useOktaAuth } from '@okta/okta-react';
import { useTemporaryPossesions } from "./useTemporaryPossesions";
import useAuth from "./useAuth";
import { UserContextt, useUserLayer } from "./UserContext";
import { StackedColumn } from "./charts/StackedColumn";
import { ControllerCompany } from "./views/company/ControllerCompany";
import { Overlay } from "./components/Overlay";
import Formm from "./SignIn2";
import { PersonasList } from "./Personas/PersonasList";
import { PeopleRouter } from "./Personas/PeopleRouter";
import { FeedViews } from "./views/seguidores/FeedViews";
import { Login } from "./Auth/Login";
import { ProtectedRoute } from "./Auth/ProtectedRoute";
import { Register } from "./Auth/Register";
import { FollowingDispatcher } from "./views/seguidores/FollowingDispatcher";
import { PopulateOnScroll } from "./views/seguidores/PopulateOnScroll";
import { useIAuthh } from "./Auth/useIAuth";
import { ContactDetails } from "./Auth/ContactDetails";
import { convertUnixToHuman } from "./utils/datesUtils";
import { AuthMiddleware, UpdateInfoView } from "./Auth/UpdateInfoView";
import { useRemoveCredits } from "./utils/useRemoveCredits";
import { ProfileSidebar } from "./Auth/ProfileSidebar";
import { useHandleProfileImage } from "./utils/useHandleProfileImage";
import { OperationList } from "./Personas/OperationList";
import Cookie from "js-cookie"
import { RssFeedTwoTone } from "@material-ui/icons";
import { useSocialAuth } from "./utils/useSocialAuth";



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  menuButton: {
    marginRight: 36,
  },
  content: {
    flexGrow: 1,
    overflowX: "hidden",
    position: "relative",
    [theme.breakpoints.up("lg")]: {
      padding: "24px 60px",
    }
  },
  toolbar: {
    //display: "flex",
    //alignItems: "center",
    //justifyContent: "flex-end",
    //padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    width: "100%",
    height: (props) => props.location.pathname.split("/")[1] === "companies" ? "112px" : "40px"
  },
  overlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    transition: "background 0.4s ease",
    backgroundColor: (props) => props.showOverlay ? "black" : "transparent"
  }
}));

const date = convertUnixToHuman(Date.now())

//we need to check when we buy or sell a new stock, the dashboard charts includes it
const App = () => {
  //useSocialAuth()
  useEngine()

  const { loading } = useIAuthh()
  //const loading = false

  const { userState, userDispatch } = useUserLayer()
  const { state, dispatch } = useDataLayer()
  console.log(userState.info, "infoo userstate")
  useHandleProfileImage()
  useEffect(() => {
    if (!userState.isAuthenticated) {
      return
    }
    const { email } = userState.info
    if (email) {
      fetch("http://localhost:8001/api/v1/operations", {
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email }),
        method: "POST"
      })
        .then(res => res.json())
        .then(res => {
          res.readyOperations && dispatch({ type: "ADD_DIRECT_HISTORY", payload: res.readyOperations })

          res.currentStocks && dispatch({
            type: "SET_INITIAL_POSSESIONS", payload: {
              stocks: res.currentStocks,
              cash: res.userCash
            }
          })

          if (res.userData) {
            //we extract all keys but the image as it will be handled separately
            const { image, ...rest } = res.userData
            res.userData.static_image ?
              userDispatch({ type: "ADD_USER_INFO", payload: rest })
              :
              userDispatch({ type: "ADD_USER_INFO", payload: { ...rest, imageUrl: image } })
          }



          console.log("hellow")
          res.interests && dispatch({ type: "STORE_USER_INTEREST", payload: res.interests });
          console.log("hellowa")
          res.uniqueStocks &&
            dispatch({ type: "SET_INITIAL_UNIQUE_STOCKS", payload: res.uniqueStocks })
          console.log("hellowaa")
          if (!res.initialDate) {
            //means portfolio has been created today
            dispatch({ type: "SET_FIRST_SERIE", payload: true })
          } else {
            if (res.initialDate.split("T")[0] === date) {
              //this is set as well in the stock shop everytime wew buy firstDay, but this will handle user refresh situation.
              dispatch({ type: "SET_FIRST_SERIE", payload: true })
            }
          }
          console.log("hellowaai")
          dispatch({ type: "ENABLE" })
        })
        .catch(err => { console.log(err) })
    }
    else {
      throw new Error("the user is authenticated but we don't have its credentials, wtf")
    }

  }, [userState.isAuthenticated, userState.email])


  const saveTokenInLocalstorage = () => {
    const token = Cookie.getJSON("token")
    if (token) {
      localStorage.setItem("token", token)
    }
  }

  useEffect(() => {
    saveTokenInLocalstorage()
    const worker = new Worker("worker.js")
    worker.postMessage("comeme el culo")
    worker.onmessage = e => {
      console.log(e.data, "web worker funciona")
    }
  }, [])

  const history = useHistory()
  const location = useLocation()
  console.log(history, location, "a ver diferencias")

  const [selection, setSelection] = useState("");
  const { setSidebarOpen, showOverlay } = useUILayer()
  const classes = useStyles({ location, showOverlay });

  const [width, setWidth] = useState(0);



  // const inicializadorStadoPrueba = () => {
  //   dispatch({ type: "ADD_DIRECT_HISTORY", payload: userActivity })
  // }
  // useTemporaryPossesions()
  // useEffect(() => {
  //   inicializadorStadoPrueba()
  // }, [])


  console.log(state.areHistoricPricesReady, "ostiau")

  useEffect(() => {
    console.log(selection, "seleccciooon")
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


  // console.log(authState, "tu muelo")
  // if (authState.isPending) {
  //   return <div>puto maricon ...</div>
  // }

  // console.log(selection, "seleeeection")
  // console.log(userState.info, "que colluns")

  if (loading) {
    return <h4>Checking credentials</h4>
  }
  return (

    <div className={classes.root}>
      <Overlay />
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Button onClick={() => { history.push("/pruebaPorfolio") }}></Button>
        <Switch>
          <Route path="/" exact >
            <Principal setSelection={setSelection} />
          </Route>
          <Route path="/companies">
            <ControllerCompany />
          </Route>

          <Route path="/news/:category" exact>
            <News principal={true} />
          </Route>
          <Route path="/covid19" exact>
            <CovidSection2 />
          </Route>

          <Route path="/indexes/:field" exact>
            <IndexesController />
          </Route>
          <Route path="/search" exact>
            <Searcher {...{ setSelection }} />
          </Route>

          <Route path="/portfolio" exact>
            <Middleware component={UserMain} />
          </Route>
          <Route path="/operations">
            <AuthMiddleware>
              <OperationList operations={state.userActivity} />
            </AuthMiddleware>
          </Route>
          <Route path="/people" >
            <PeopleRouter />
          </Route>
          <Route path="/proba" exact>
            <StackedColumn ticker="nflx" />
          </Route>
          <Route
            path="/lugin"
            exact
          >
            <Formm />
          </Route>
          {/* <Route path="/feed" exact>
            <FeedViews />
          </Route> */}
          <Route path="/feed" exact>
            <UserContextt.Consumer>
              {values => (
                <PopulateOnScroll>
                  {({ _setIsDataReadyScroll, currentChunk, setChunkCount }) => (
                    <FollowingDispatcher valores={values}
                      {...{ _setIsDataReadyScroll, currentChunk, setChunkCount }} />
                  )
                  }
                </PopulateOnScroll>
              )}
            </UserContextt.Consumer>
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/register" exact>
            <Register />
          </Route>
          <Route path="/protectedRuta" exact>
            <ProtectedRoute />
          </Route>
          <Route path="/uploads">
            <AuthMiddleware>
              <UpdateInfoView />
            </AuthMiddleware>
          </Route>
        </Switch>

      </main>
    </div>
  );
}



export default App;
