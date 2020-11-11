import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import logo from "./logo.svg";
//import {HashRouter, Route, Switch} from "react-dom"

import { Route, Switch, useHistory } from "react-router-dom";

import { StockChartt } from "./views/company/StockChart";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { ContactsOutlined } from "@material-ui/icons";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { StockNews } from "./components/StockNews";
import { Principal } from "./views/principal/principal";
import { Searcher } from "./components/Searcher";



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
    ...theme.mixins.toolbar,
  },
}));

function App() {

  const history = useHistory()

  const [open, setOpen] = React.useState(false);
  const [selection, setSelection] = useState("");
  const classes = useStyles();
  const contentCont= useRef(null);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const [width, setWidth] = useState(0);
  
  useLayoutEffect(() => {
    if (contentCont.current) {
      setWidth(contentCont.current.offsetWidth);
    }
    
  }, [contentCont]);

  const initial = useRef(true) 
  useEffect(()=>{
   if(contentCont.current && !initial.current){
    if(open && contentCont.current){
      console.log("come")
      console.log(contentCont.current.offsetWidth)
      setWidth(contentCont.current.offsetWidth - (240 + 73)/2);
    }
    else {
      setWidth(contentCont.current.offsetWidth + (240 - 73)/2)
    }
   }  
   initial.current = false
  },[open])

  
  useEffect(()=>{
    if(selection){
      history.push(`/prices/${selection.ticker}`)
    }
  },[selection])

  const handleDrawerClose = () => {
    setOpen(false);
  };
 
  return (
    
      <div className={classes.root}>
        <CssBaseline />
        <Navbar open={open} handleDrawerOpen={handleDrawerOpen} />
        <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
            <Switch>
              {/* <Route path="/" exact >
              <Principal/>
                </Route> */}
              <Route path="/" exact >
              <Searcher setSelection={setSelection} selection={selection}/>
                </Route>
              <Route path="/prices/:company" exact>
                <StockChartt width={width} ref={contentCont}/>
              </Route>
              <Route path="/news/:company" exact component={StockNews} />
            </Switch>
          
        </main>
      </div>
  
  );
}

export default App;
