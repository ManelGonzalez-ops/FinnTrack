import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import { Chip, Tab, Tabs, useTheme } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom"
import { useDataLayer } from "../Context";
import { useUILayer } from "../ContextUI";
import { useParams } from "react-router-dom";
import { useMesure } from "../utils/useMesure";
import { Transition } from "react-transition-group";
import { formatter } from "../utils/numFormatter";
import { useOktaAuth } from '@okta/okta-react';
import { CompanyNav } from "./subNavigations/CompanyNav";
import { useUserLayer } from "../UserContext";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: ({ drawerWidth }) => `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
}));

export const Navbar = ({ handleDrawerOpen }) => {
  //const { authState, authService } = useOktaAuth();
  const history = useHistory()
  const { state } = useDataLayer()
  const { sidebarOpen, drawerWidth } = useUILayer()
  const location = useLocation()
  const topNavigation = useRef(null)
  const [menuCompaniesOpen, setMenuCompaniesOpen] = useState(false)

  useEffect(() => {
    const masterRoute = location.pathname.split("/").filter(item => item !== "")
    console.log(masterRoute[0], "first pathname query")
    if (masterRoute[0] === "companies") {
      setMenuCompaniesOpen(true)
    }
    else {
      console.log("ahora es falso")
      setMenuCompaniesOpen(false)
    }

  }, [location])

  console.log(location, "locationnnnnn")


  const classes = useStyles({ drawerWidth });



  const { userDispatch } = useUserLayer()
  const logout = (cb) => {
    userDispatch({ type: "SET_USER_NULL" })
    cb()
  }
  return (
    <div>
      <AppBar
        data-testid="navbar"
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: sidebarOpen,
        })}
        ref={topNavigation}
      >
        <Toolbar>
          <IconButton

            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: sidebarOpen,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {menuCompaniesOpen ? state.currentCompany.name : "FinnTrack"}
          </Typography>
          <div
            style={{ marginLeft: "auto", display: "flex", alignItems: "centeryyy" }}
          >
            <Button variant="contained" color="primary"
              onClick={() => { history.push("/login") }}
            >login</Button>
            <Button variant="contained" color="primary"
              onClick={() => { logout(() => history.push("/login")) }}
            >Logout</Button>
            <Button
              onClick={() => { history.push("/portfoliof") }}
              variant="contained"
            >
              Investment Dashboard
            </Button>
            <Typography>
              {formatter.format(state.currentPossesions.userCash)} $
            </Typography>
          </div>
          <button onClick={() => { history.push("/interests") }}>interests</button>
        </Toolbar>
      </AppBar>
      <CompanyNav {...{ menuCompaniesOpen, topNavigation }} />
    </div>
  );
};

