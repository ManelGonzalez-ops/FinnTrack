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
import { CompanyNav } from "./subNavigations/CompanyNav";
import { useUserLayer } from "../UserContext";
import Cookie from "js-cookie"
import { NavSearch } from "./navSearch";
import { useViewport } from "../utils/useViewport";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  grow: {
    flex: "1 1 auto"
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      flexGrow: 1,
      display: "unset"
    }
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
    width: ({ drawerWidth, viewport }) => viewport < 600 ? "100%" : `calc(100% - ${drawerWidth}px)`,

    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  desktopActions: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      alignItems: "center",
      marginLeft: "auto",
    }
  }
}));

export const Navbar = () => {
  //const { authState, authService } = useOktaAuth();
  const history = useHistory()
  const { state, dispatch } = useDataLayer()
  const { viewport } = useViewport()
  const { sidebarOpen, drawerWidth, setSidebarOpen } = useUILayer()
  const location = useLocation()
  const topNavigation = useRef(null)
  const [menuCompaniesOpen, setMenuCompaniesOpen] = useState(false)
  console.log(history, "hiiiii")
  const params = useLocation()
  console.log(params, "psspsp")
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


  const classes = useStyles({ drawerWidth, viewport });



  const { userDispatch, userState: { isAuthenticated } } = useUserLayer()
  const logout = (cb) => {

    dispatch({ type: "REINITILIZE" })
    Cookie.remove("token", { path: "/", domain: "financeapp-v1.herokuapp.com" })
    localStorage.removeItem("token")
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
            onClick={() => { setSidebarOpen(true) }}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: sidebarOpen,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap
            className={classes.title}
          >
            {menuCompaniesOpen ? state.currentCompany.name : "FinnTrack"}
          </Typography>
          <div className={classes.grow} />
          <NavSearch />
          <div
            className={classes.desktopActions}
          >
            <Button variant="contained" color="primary"
              onClick={() => { history.push("/login", { background: location }) }}
            >login</Button>
            {isAuthenticated && <Button variant="contained" color="primary"
              onClick={() => { logout(() => history.push("/")) }}
            >Logout</Button>}
            {isAuthenticated && <Typography>
              {formatter.format(state.currentPossesions.userCash)} $
            </Typography>}
          </div>
        </Toolbar>
      </AppBar>
      <CompanyNav {...{ menuCompaniesOpen, topNavigation }} />
    </div>
  );
};

