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
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  appBarCompany: {
    flexDirection: "row",
    alignItems: "center",
    transition: theme.transitions.create(["top", "transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    transform: "translateX(0px)",
  },
  appBarCompanyShift: {
    transform: `translateX(${drawerWidth}px)`
  },
  tab: {
    marginLeft: "60px",

  },
  white: {
    borderColor: "white"
  }

}));

export const Navbar = ({ handleDrawerOpen }) => {
  const { authState, authService } = useOktaAuth();
  const [tabValue, setTabValue] = React.useState(0);
  const topNavigation = useRef(null)
  const history = useHistory()
  const { state } = useDataLayer()
  const { sidebarOpen, setMountApproval } = useUILayer()
  const location = useLocation()
  const [menuCompaniesOpen, setMenuCompaniesOpen] = useState(false)
  const theme = useTheme()
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
  const { height } = useMesure(topNavigation)

  const classes = useStyles({ height });
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (e, val) => {
    setTabValue(val)
  }

  const menu2transitions = {
    entering: {
      top: `${height}px`,
    },
    entered: {
      top: `${height}px`,
    },
    exiting: {
      top: "0px",
    },
    exited: {
      top: "0px"
    }
  }

  const button = authState.isAuthenticated ?
  <button onClick={() => { authService.logout() }}>Logout</button> :
  <button onClick={() => { history.push('/login') }}>Login</button>;

  return (
    <div>
      <AppBar
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
        </Toolbar>
      </AppBar>
      <Transition
        in={menuCompaniesOpen}
        // mountOnEnter
        // unmountOnExit
        onExited={() => { setMountApproval(true) }}
      >
        {animationState => (
          <AppBar
            className={clsx(classes.appBarCompany, {
              [classes.appBarCompanyShift]: sidebarOpen
            })}
            style={menu2transitions[animationState]}
          >
            <Tabs value={tabValue} onChange={handleChange} aria-label="simple tabs example"
              classes={{ root: classes.tab }}
            >
              <Tab label="Overview" {...a11yProps(0)} onClick={() => { history.push(`/companies/overview/${state.currentCompany.ticker}`) }} />
              <Tab label="Financials" {...a11yProps(1)} onClick={() => { history.push(`/companies/financials/${state.currentCompany.ticker}`) }} />
              <Tab label="Key metrics" {...a11yProps(2)} onClick={() => { history.push(`/companies/keymetrics/${state.currentCompany.ticker}`) }} />
              <Tab label="News" {...a11yProps(2)} onClick={() => { history.push(`/news/${state.currentCompany.ticker}`) }} />
            </Tabs>
            <Chip label="not owned" size="small" variant="outlined" style={{ color: "white" }}
              classes={{
                outlined: classes.white
              }}
            />
          </AppBar>
        )}
      </Transition>
    </div>
  );
};

